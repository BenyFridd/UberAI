from rich.console import Console

console = Console()

def format_results_as_json(results, group_by_market=False):
    """Format the retrieval results as a JSON with items as top-level keys.
    
    Args:
        results: The retrieval results containing product matches
        group_by_market: If True, results will be organized by market instead of by item
    """
    out_name=[]
    if not group_by_market:
        formatted_results = {}
        
        # Process each item in the shopping list
        for item in results.corrected_list.items:
            formatted_results[item.name] = []
            item_results = results.product_matches.get(item.name)
            
            if not item_results or not item_results.matches:
                out_name.append(item_results.query_item)
                continue
            
            # Process each product match

            for match in item_results.matches:
                
                # Create product info
                product_info = {
                    "nome_produto": match.name,
                    "preco": match.price,
                    "descricao": match.description,
                    "categoria": match.category,
                    "similaridade": match.similarity,
                    "nome_mercado": match.nome_mercado if hasattr(match, 'nome_mercado') else "",
                }
                
                # Check if this exact product is already in the list
                if product_info not in formatted_results[item.name]:
                    formatted_results[item.name].append(product_info)
        
        console.print(f"[green] maaaaaa olha -> {out_name}")
        return formatted_results, out_name
    else:
        # Group by market
        market_results = {}
        
        # First, collect all unique markets
        all_markets = set()
        for item_name, item_results in results.product_matches.items():
            if item_results and item_results.matches:
                for match in item_results.matches:
                    markets = match.nome_mercado.split('|') if hasattr(match, 'nome_mercado') else ["Mercado Genérico"]
                    all_markets.update(markets)
        
        # Initialize results for each market
        for market in all_markets:
            market_results[market] = {}
            # Initialize empty lists for all items in this market
            for item in results.corrected_list.items:
                market_results[market][item.name] = []
        
        # Process each item and its matches
        for item in results.corrected_list.items:
            item_results = results.product_matches.get(item.name)
            
            if not item_results or not item_results.matches:
                out_name.append(item_results.query_item)
                continue
            
            # Process each product match
            for match in item_results.matches:
                
    
                # Create product info
                product_info = {
                    "nome_produto": match.name,
                    "preco": match.price,
                    "descricao": match.description,
                    "categoria": match.category,
                    "similaridade": match.similarity,
                    "nome_mercado": match.nome_mercado if hasattr(match, 'nome_mercado') else "",
                }
                
                # Add product to each market it belongs to
                markets = match.nome_mercado.split('|') if hasattr(match, 'nome_mercado') else ["Mercado Genérico"]
                for market in markets:
                    if product_info not in market_results[market][item.name]:
                        market_results[market][item.name].append(product_info)
        console.print(f"[gree] maaaaaaa olhaaa ->> {out_name}") 
        return market_results, out_name 

def format_results_for_frontend(results_json):
    """
    Formats the search results to match the MARKET_DATA structure in marketData.ts.
    
    Args:
        results_json: JSON results from hybrid_product_retrieval
        
    Returns:
        List of market objects in the format expected by frontend
    """
    # If the results are already grouped by market
    if isinstance(results_json, dict) and any(isinstance(v, dict) for v in results_json.values()):
        markets_list = []
        
        # Transform each market entry to match the frontend format
        for market_name, items in results_json.items():
            market_data = {
                "nome_mercado": market_name,
                "itens": {}
            }
            
            # Transform the items structure
            for item_name, products in items.items():
                market_data["itens"][item_name] = [
                    {
                        "categoria": p.get("categoria", ""),
                        "descricao": p.get("descricao", ""),
                        "marca": p.get("marca", "Não especificada"),
                        "nome": p.get("nome_produto", ""),
                        "similaridade": p.get("similaridade", 0),
                        "valor": p.get("preco", "R$ 0.00")
                    }
                    for p in products
                ]
            
            markets_list.append(market_data)
        
        return markets_list
    
    # If the results are grouped by item, restructure them
    else:
        # First, collect all unique markets across all products
        all_markets = set()
        for item_name, products in results_json.items():
            for product in products:
                if "nome_mercado" in product:
                    markets = product.get("nome_mercado", "").split("|")
                    all_markets.update(markets)
                
        # If no market information is found, create a generic market
        if not all_markets:
            all_markets = {"Mercado Genérico"}
        
        # Create the structure for each market
        markets_list = []
        for market_name in all_markets:
            market_data = {
                "nome_mercado": market_name,
                "itens": {}
            }
            
            # Initialize empty lists for all items
            for item_name in results_json.keys():
                market_data["itens"][item_name] = []
            
            # Add products to their respective markets
            for item_name, products in results_json.items():
                for product in products:
                    # Check if this product belongs to this market
                    product_markets = product.get("nome_mercado", "").split("|") if "nome_mercado" in product else []
                    
                    if market_name in product_markets:
                        product_data = {
                            "categoria": product.get("categoria", ""),
                            "descricao": product.get("descricao", ""),
                            "marca": product.get("marca", "Não especificada"),
                            "nome": product.get("nome_produto", ""),
                            "similaridade": product.get("similaridade", 0),
                            "valor": product.get("preco", "R$ 0.00")
                        }
                        market_data["itens"][item_name].append(product_data)
            
            markets_list.append(market_data)
        
        return markets_list 
