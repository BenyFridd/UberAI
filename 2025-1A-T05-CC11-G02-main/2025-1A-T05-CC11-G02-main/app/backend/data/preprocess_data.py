import json
import pandas as pd
import numpy as np
import pickle
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import os
from rich.console import Console
from rich.panel import Panel

# Initialize Rich console for better output formatting
console = Console()

# Load environment variables from .env file
load_dotenv()

def preprocess_catalog(catalog_path='catalog/catalog.json'):
    """Load and preprocess the product catalog."""
    console.print("[bold blue]Preprocessing catalog data...[/]")
    
    # Load the catalog data
    with open(catalog_path, 'r', encoding='utf-8') as f:
        catalog = json.load(f)
    
    # First pass: collect all products with their market names
    products_dict = {}
    for market in catalog:
        for product in market['produtos']:
            product_name = product['nome_produto']
            if product_name not in products_dict:
                # Create a copy of the product dictionary
                product_with_market = product.copy()
                product_with_market['nome_mercado'] = market['nome_mercado']
                products_dict[product_name] = product_with_market
            else:
                # Add the market name to the existing product's markets
                products_dict[product_name]['nome_mercado'] += f"|{market['nome_mercado']}"
    
    # Convert the dictionary to a list of products
    products = list(products_dict.values())
    
    # Create a DataFrame
    df = pd.DataFrame(products)
    
    # Remove duplicate products
    df = df.drop_duplicates()
    console.print(f"[green]Loaded {len(df)} unique products from catalog[/]")
    
    # Extract all unique categories
    all_categories = set()
    for category_str in df['categoria'].unique():
        categories = category_str.split('|')
        for category in categories:
            all_categories.add(category)
    
    console.print(f"[green]Found {len(all_categories)} unique categories[/]")
    
    return df, all_categories

def get_embeddings_client():
    """Initialize and return the OpenAI client for embeddings."""
    return OpenAI()

def generate_embeddings(df, client, batch_size=100):
    """Generate embeddings for products in the DataFrame."""
    console.print("[bold blue]Generating embeddings for products...[/]")
    
    embeddings_data = []
    
    for i in range(0, len(df), batch_size):
        batch = df.iloc[i:i+batch_size]
        
        # Combine name, description and category for better semantic representation
        texts = (batch['nome_produto'] + " " + 
                 batch['descricao'] + " " + 
                 batch['categoria']).tolist()
        
        console.print(f"Processing batch {i//batch_size + 1}/{(len(df)+batch_size-1)//batch_size}")
        
        batch_embeddings = client.embeddings.create(
            input=texts, 
            model="text-embedding-3-large"
        ).data
        
        embeddings_data.extend(batch_embeddings)
    
    # Add embeddings to DataFrame
    df['embedding'] = embeddings_data
    console.print("[green]Embeddings generation complete[/]")
    
    return df

def generate_category_embeddings(categories, client):
    """Generate embeddings for categories."""
    console.print("[bold blue]Generating embeddings for categories...[/]")
    
    # Create context for categories to improve embedding quality
    category_contexts = [f"categoria: {cat}" for cat in categories]
    
    # Get embeddings
    embeddings = client.embeddings.create(
        input=category_contexts,
        model="text-embedding-3-large"
    ).data
    
    # Create a dictionary mapping categories to their embeddings
    category_embeddings = {
        cat: np.array(emb.embedding) 
        for cat, emb in zip(categories, embeddings)
    }
    
    console.print(f"[green]Generated embeddings for {len(category_embeddings)} categories[/]")
    
    return category_embeddings

def save_processed_data(df, category_embeddings, df_path='data/processed_df.pkl', cat_path='data/category_embeddings.pkl'):
    """Save the processed dataframe and category embeddings to disk."""
    console.print("[bold blue]Saving processed data to disk...[/]")
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Save dataframe with embeddings
    with open(df_path, 'wb') as f:
        pickle.dump(df, f)
    
    # Save category embeddings
    with open(cat_path, 'wb') as f:
        pickle.dump(category_embeddings, f)
    
    console.print(f"[green]Data saved successfully to {df_path} and {cat_path}[/]")

def main():
    # Initialize
    console.print("[bold blue]Starting data preprocessing...[/]")
    
    # Preprocess data
    df, all_categories = preprocess_catalog()
    
    # Get embeddings client
    client = get_embeddings_client()
    
    # Generate embeddings
    df_with_embeddings = generate_embeddings(df, client)
    category_embeddings = generate_category_embeddings(all_categories, client)
    
    # Save the processed data
    save_processed_data(df_with_embeddings, category_embeddings)
    
    console.print("[bold green]Preprocessing complete![/]")

if __name__ == "__main__":
    main() 