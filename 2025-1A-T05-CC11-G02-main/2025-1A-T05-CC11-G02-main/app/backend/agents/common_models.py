from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Set

class GroceryItem(BaseModel):
    name: str = Field(..., description="The name of the grocery item, should be a generic product name without brand specifications")
    possible_synonyms: Optional[List[str]] = Field(None, description="List of alternative names or variations that could refer to the same product")
    possible_categories: Optional[List[str]] = Field(None, description="List of supermarket categories where this product might be found")
    description: Optional[str] = Field(None, description="A brief description of what the product is and its common uses")

class GroceryList(BaseModel):
    items: List[GroceryItem] = Field(..., description="List of grocery items that need to be purchased")

class ProductMatch(BaseModel):
    product_id: str = Field(..., description="Unique identifier for the product in the supermarket's system")
    name: str = Field(..., description="Full name of the product including brand and specifications")
    price: float = Field(..., description="Current price of the product in the local currency")
    description: str = Field(..., description="Detailed description of the product including size, weight, and other specifications")
    category: str = Field(..., description="The supermarket category where this product is located")
    similarity: float = Field(..., description="Similarity score between the product and the searched item (0.0 to 1.0)")
    nome_mercado: str = Field(..., description="Name of the supermarket where this product is available")

class ProductMatches(BaseModel):
    query_item: str = Field(..., description="The original grocery item that was searched for")
    matches: List[ProductMatch] = Field(..., description="List of products found that match the search criteria")
    matched_categories: List[str] = Field(..., description="List of categories where matching products were found")

class RetrievalResults(BaseModel):
    corrected_list: GroceryList = Field(..., description="The original grocery list with corrected item names")
    product_matches: Dict[str, ProductMatches] = Field(..., description="Dictionary mapping each grocery item to its found product matches")

class FilterData(BaseModel):
    matches: List[ProductMatch] = Field(..., description="List of filtered product matches that are relevant to the searched item") 
    
class IntentResult(BaseModel):
    intent: str = Field(..., description="Identified intent. Expected values: 'list_correction','something2list' or 'question'")