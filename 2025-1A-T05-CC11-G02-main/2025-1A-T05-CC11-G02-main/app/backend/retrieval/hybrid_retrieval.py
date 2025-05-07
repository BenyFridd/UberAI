import json
import pandas as pd
import numpy as np
import pickle
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity
import asyncio
import os

from agents.common_models import (
    GroceryItem, GroceryList, ProductMatch, ProductMatches, 
    RetrievalResults, FilterData
)
from agents.list_correction_agent import list_correction_agent
from agents.context_expansion_agent import context_expansion_agent
from agents.product_filter_agent import product_filter_agent

# Initialize Rich console for better output formatting
console = Console()

def get_embeddings_client():
    """Initialize and return the OpenAI client for embeddings."""
    return OpenAI()

def calculate_similarities(embedding, embeddings_list):
    """Calculate cosine similarities between embedding and a list of embeddings."""
    # Extract embedding values
    query_vector = np.array(embedding.embedding).reshape(1, -1)
    product_vectors = np.array([emb.embedding for emb in embeddings_list])
    
    # Calculate similarities
    similarities = cosine_similarity(query_vector, product_vectors).flatten()
    return similarities

def calculate_adaptive_threshold(similarities, min_threshold=0.3, max_threshold=0.7):
    """Calculate an adaptive threshold based on the distribution of similarities."""
    if len(similarities) == 0:
        return min_threshold
    
    # Get distribution statistics
    mean = np.mean(similarities)
    std = np.std(similarities)
    max_sim = np.max(similarities)
    
    # If max similarity is very high, use a higher threshold
    if max_sim > 0.8:
        return max(0.65 * max_sim, min_threshold)
    
    # If there's a clear separation in results (high std), use mean + 0.5*std
    if std > 0.1:
        return max(mean + 0.5 * std, min_threshold)
    
    # Default case
    return min_threshold

async def get_matching_categories(suggested_categories, category_embeddings, threshold=0.75):
    """Find matching categories from the catalog based on suggested categories."""
    matches = set()
    
    # Get embeddings for suggested categories
    client = get_embeddings_client()
    suggested_contexts = [f"categoria: {cat}" for cat in suggested_categories]
    suggested_embeddings = client.embeddings.create(
        input=suggested_contexts,
        model="text-embedding-3-large"
    ).data
    
    # Compare with all catalog categories
    for cat_name, cat_embedding in category_embeddings.items():
        for i, sugg_embedding in enumerate(suggested_embeddings):
            # Calculate similarity
            similarity = cosine_similarity(
                np.array(sugg_embedding.embedding).reshape(1, -1),
                cat_embedding.reshape(1, -1)
            )[0][0]
            
            if similarity >= threshold:
                matches.add(cat_name)
    
    # If no matches found with high threshold, reduce threshold
    if len(matches) == 0:
        for cat_name, cat_embedding in category_embeddings.items():
            for i, sugg_embedding in enumerate(suggested_embeddings):
                similarity = cosine_similarity(
                    np.array(sugg_embedding.embedding).reshape(1, -1),
                    cat_embedding.reshape(1, -1)
                )[0][0]
                
                if similarity >= 0.6:  # Lower threshold
                    matches.add(cat_name)
    
    return list(matches)

def get_keyword_matches(keywords, df, column='nome_produto'):
    """Find products containing any of the keywords."""
    mask = df[column].str.lower().apply(
        lambda x: any(keyword.lower() in x.lower() for keyword in keywords)
    )
    return df[mask]

async def process_item(item, df, category_embeddings, client, item_context, min_results=3, max_results=10):
    """Process a single grocery item asynchronously."""
    console.print(f"[bold yellow]Processing item:[/] [bold]{item.name}[/]")
    
    # Print expanded context
    console.print(Panel(
        f"[bold]Expanded Context:[/]\n"
        f"[cyan]Synonyms:[/] {', '.join(item_context.data.possible_synonyms or [])}\n"
        f"[cyan]Categories:[/] {', '.join(item_context.data.possible_categories or [])}\n"
        f"[cyan]Description:[/] {item_context.data.description}",
        title=f"Context for {item.name}",
        expand=False
    ))
    
    # Step 2: Category-based filtering
    matched_categories = await get_matching_categories(
        item_context.data.possible_categories, 
        category_embeddings
    )
    
    # Filter products by matching categories
    if matched_categories:
        category_filtered_df = df[df['categoria'].apply(
            lambda x: any(cat in x for cat in matched_categories)
        )]
        console.print(f"[green]Found {len(category_filtered_df)} products in {len(matched_categories)} matching categories[/]")
    else:
        # If no category matches, use all products
        category_filtered_df = df
        console.print("[yellow]No matching categories found, using all products[/]")
    
    # Step 3: Keyword-based pre-filtering
    # Include the original item and synonyms
    keywords = [item.name] + (item_context.data.possible_synonyms or [])
    keyword_matches = get_keyword_matches(keywords, category_filtered_df)
    
    if len(keyword_matches) > 0:
        console.print(f"[green]Found {len(keyword_matches)} products matching keywords[/]")
    else:
        console.print("[yellow]No keyword matches found[/]")
    
    # Step 4 & 5: Similarity ranking on the reduced dataset
    candidates = keyword_matches if len(keyword_matches) > 0 else category_filtered_df
    
    if len(candidates) > 0:
        # Get embedding for the item description
        item_desc_embedding = client.embeddings.create(
            input=[item_context.data.description or item.name],
            model="text-embedding-3-large"
        ).data[0]
        
        # Calculate similarities
        similarities = calculate_similarities(item_desc_embedding, candidates['embedding'])
        candidates = candidates.copy()
        candidates['similarity'] = similarities
        
        # Step 6: Apply adaptive threshold based on result distribution
        threshold = calculate_adaptive_threshold(similarities)
        console.print(f"[cyan]Adaptive threshold:[/] {threshold:.4f}")
        
        final_results = candidates[candidates['similarity'] >= threshold].sort_values(
            'similarity', ascending=False
        )
        
        # Ensure minimum results
        if len(final_results) < min_results and len(candidates) >= min_results:
            final_results = candidates.sort_values('similarity', ascending=False).head(min_results)
        
        # Limit maximum results
        final_results = final_results.head(max_results)
    else:
        final_results = pd.DataFrame()
    
    # Create ProductMatches object
    matches = []
    for _, row in final_results.iterrows():
        matches.append(ProductMatch(
            product_id=str(row.name),  # Index as string
            name=row['nome_produto'],
            price=row['preco'],
            description=row['descricao'],
            category=row['categoria'],
            similarity=float(row.get('similarity', 0)),
            nome_mercado=row['nome_mercado']
        ))
    
    result = ProductMatches(
        query_item=item.name,
        matches=matches,
        matched_categories=matched_categories
    )
    
    # Print item results
    display_item_results(result)
    
    return result

def display_item_results(item_results):
    """Display formatted results for a single item."""
    if not item_results.matches:
        console.print("[bold red]No matches found![/]")
        return
    
    # Create a table for results
    table = Table(title=f"Results for {item_results.query_item}")
    table.add_column("No.", style="dim")
    table.add_column("Product Name", style="cyan")
    table.add_column("Price", style="green")
    table.add_column("Category", style="yellow")
    table.add_column("Similarity", style="magenta")
    
    # Add rows to the table
    for i, match in enumerate(item_results.matches):
        # Extract primary category (first one from the categories string)
        primary_category = match.category.split('|')[0] if '|' in match.category else match.category
        
        table.add_row(
            str(i+1),
            match.name,
            f"R${match.price:.2f}",
            primary_category,
            f"{match.similarity:.2f}"
        )
    
    console.print(table)
    console.print(f"[cyan]Matched categories:[/] {', '.join(item_results.matched_categories)}")
    console.print()

async def hybrid_product_retrieval(corrected_list, df, category_embeddings, 
                                  min_results=3, max_results=10):
    """
    Hybrid approach to retrieve products based on a shopping list.
    
    Args:
        corrected_list (GroceryList): Pre-corrected list of grocery items
        df (DataFrame): Preprocessed product DataFrame with embeddings
        category_embeddings (dict): Dictionary mapping categories to embeddings
        min_results (int): Minimum number of results to return per item
        max_results (int): Maximum number of results to return per item
        
    Returns:
        RetrievalResults: Object containing corrected list and product matches
    """
    client = get_embeddings_client()
    
    # Display corrected list
    corrected_items = [item.name for item in corrected_list.items]
    console.print(Panel(
        "\n".join([f"• {item}" for item in corrected_items]),
        title="Shopping List",
        expand=False
    ))

    print("Iniciando context expansion para todos os itens...")
    
    # Step 1: First expand context for all items asynchronously
    async def expand_item_context(item_name):
        item_context = await context_expansion_agent.run(item_name)
        return item_name, item_context
    
    # Create tasks for context expansion
    context_expansion_tasks = [expand_item_context(item.name) for item in corrected_list.items]
    
    # Run all context expansion tasks concurrently
    context_expansion_results = await asyncio.gather(*context_expansion_tasks)
    
    # Create a dictionary with the expanded contexts
    expanded_context = {}
    for item_name, item_context in context_expansion_results:
        expanded_context[item_name] = {
            "name": item_name,
            "possible_synonyms": item_context.data.possible_synonyms,
            "possible_categories": item_context.data.possible_categories,
            "description": item_context.data.description
        }
    
    print("Context expansion concluída. Iniciando processamento de itens...")
    
    # Step 2: Process each item using the expanded context
    tasks = []
    for item in corrected_list.items:
        item_context_obj = context_expansion_results[[i for i, (name, _) in enumerate(context_expansion_results) if name == item.name][0]][1]
        
        tasks.append(process_item(
            item, 
            df, 
            category_embeddings, 
            client,
            item_context_obj,
            min_results, 
            max_results
        ))
    
    print("Vai começar o gather para processamento dos itens")
    # Wait for all tasks to complete
    results = await asyncio.gather(*tasks)
    print("Gather finalizado")
    
    # Build results dictionary
    results_dict = {result.query_item: result for result in results}
    
    # Step 3: Filter irrelevant products
    console.print("[bold blue]Filtering irrelevant products...[/]")
    
    async def filter_single_item(item_name, item_matches, item_context):
        try:
            # Store original product information for reconstruction
            original_products = {match.product_id: match for match in item_matches.matches}
            
            # Convert to serializable format for the agent with only essential fields
            serializable_data = {
                "query_item": item_matches.query_item,
                "matches": [{
                    "product_id": match.product_id,
                    "name": match.name,
                    "description": match.description,
                    "category": match.category,
                } for match in item_matches.matches],
                "expanded_context": {
                    item_name: {
                        "name": item_context["name"],
                        "possible_synonyms": item_context["possible_synonyms"] or [],
                        "possible_categories": item_context["possible_categories"] or [],
                        "description": item_context["description"] or ""
                    }
                }
            }
            
            # Convert to JSON
            filter_data_json = json.dumps(serializable_data, ensure_ascii=False)
            
            # Debug print the JSON being sent to the agent
            console.print(Panel(
                json.dumps(serializable_data, indent=2, ensure_ascii=False),
                title=f"Data being sent to product_filter_agent for {item_name}",
                expand=False
            ))
            
            # Filter products using the agent
            filtered_results = await product_filter_agent.run(filter_data_json)
            
            if not filtered_results or not filtered_results.data:
                console.print(f"[red]Error in filtering for {item_name}, using original matches[/]")
                return item_name, item_matches.matches
            
            # If agent returns empty list, it means no products matched the criteria
            if not filtered_results.data.matches:
                console.print(f"[green]No relevant products found for {item_name} after filtering[/]")
                return item_name, []
            
            # Reconstruct filtered products with original data
            reconstructed_matches = []
            for filtered_match in filtered_results.data.matches:
                # Get the original product data
                original_match = original_products.get(filtered_match.product_id)
                if original_match:
                    # Create a new ProductMatch with all original data
                    reconstructed_matches.append(ProductMatch(
                        product_id=original_match.product_id,
                        name=original_match.name,
                        price=original_match.price,
                        description=original_match.description,
                        category=original_match.category,
                        similarity=original_match.similarity,
                        nome_mercado=original_match.nome_mercado
                    ))
            
            return item_name, reconstructed_matches
        except Exception as e:
            console.print(f"[red]Error filtering {item_name}: {str(e)}[/]")
            console.print("[yellow]Using original matches as fallback[/]")
            return item_name, item_matches.matches
    
    # Process all items concurrently
    filter_tasks = []
    for item_name, item_matches in results_dict.items():
        filter_tasks.append(filter_single_item(
            item_name,
            item_matches,
            expanded_context[item_name]
        ))
    
    # Wait for all tasks to complete
    filtered_results = await asyncio.gather(*filter_tasks)

    print("filtered_results")
    print(filtered_results)
    
    # Convert back to the original format
    final_results = {}
    for item_name, matches in filtered_results:
        final_results[item_name] = ProductMatches(
            query_item=item_name,
            matches=matches,  # matches are already ProductMatch objects
            matched_categories=results_dict[item_name].matched_categories
        )
    
    console.print(f"[green]Filtering complete. Processed {len(filtered_results)} items.[/]")
    
    # Return the results
    return RetrievalResults(
        corrected_list=corrected_list,
        product_matches=final_results
    )

def display_final_results(results):
    """Display a comprehensive summary of all results."""
    total_items = len(results.corrected_list.items)
    total_matches = sum(len(matches.matches) for matches in results.product_matches.values())
    
    console.print("\n")
    console.print(Panel(
        f"[bold]Total items:[/] {total_items}\n"
        f"[bold]Total product matches:[/] {total_matches}",
        title="Summary",
        expand=False
    ))
    
    # Display all found products grouped by item
    console.print(Panel("[bold]All Found Products[/]", expand=False))
    
    for item in results.corrected_list.items:
        item_results = results.product_matches.get(item.name)
        if not item_results or not item_results.matches:
            console.print(f"[bold yellow]{item.name}:[/] [red]No matches found[/]")
            console.print()
            continue
        
        console.print(f"[bold yellow]{item.name}[/] ({len(item_results.matches)} products)")
        
        # Create a table for item results
        table = Table(show_header=True, width=100)
        table.add_column("No.", style="dim", width=4)
        table.add_column("Product Name", style="cyan")
        table.add_column("Price", style="green", width=10)
        table.add_column("Category", style="yellow", width=15)
        table.add_column("Similarity", style="magenta", width=10)
        
        for i, match in enumerate(item_results.matches):
            # Extract primary category
            primary_category = match.category.split('|')[0] if '|' in match.category else match.category
            
            table.add_row(
                str(i+1),
                match.name,
                f"R${match.price:.2f}",
                primary_category,
                f"{match.similarity:.2f}"
            )
        
        console.print(table)
        console.print(f"[dim]Matched categories: {', '.join(item_results.matched_categories)}[/]")
        console.print("\n" + "-" * 80 + "\n")  # Divider between items

# Data loading functions
def load_processed_data(df_path='data/processed_df.pkl', cat_path='data/category_embeddings.pkl'):
    """Load the processed dataframe and category embeddings from disk."""
    console.print("[bold blue]Loading preprocessed data...[/]")
    
    # Check if files exist
    if not os.path.exists(df_path) or not os.path.exists(cat_path):
        console.print("[bold red]Error: Preprocessed data files not found![/]")
        console.print("[yellow]Please run preprocess_data.py first to generate the required data files.[/]")
        return None, None
    
    # Load dataframe with embeddings
    with open(df_path, 'rb') as f:
        df = pickle.load(f)
    
    # Load category embeddings
    with open(cat_path, 'rb') as f:
        category_embeddings = pickle.load(f)
    
    console.print(f"[green]Loaded {len(df)} products and {len(category_embeddings)} categories[/]")
    
    return df, category_embeddings

