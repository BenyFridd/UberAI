# Hybrid Search System

This project implements a hybrid search system for product recommendations using both semantic and keyword-based search approaches.

## Prerequisites

- Python 3.8 or higher
- UV package manager

## Installation

1. First, install UV (if not already installed):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Clone this repository:
```bash
git clone <repository-url>
cd hybrid_search
```

3. Create and activate a virtual environment:
```bash
uv venv
source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate
```

4. Install dependencies using UV:
```bash
uv add -r requirements.txt
```

5. Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Project Structure

- `main.py`: The main application that provides a more sophisticated interface with additional features like:
  - Question answering capabilities
  - List correction
  - Product recommendations
  - Interactive command-line interface
  - Rich text formatting

- `list_to_list.py`: A simpler version of the application that focuses on:
  - Basic product search functionality
  - Direct shopping list processing
  - Simpler output formatting

## Running the Applications

### Running main.py

The main application provides a more feature-rich experience:

```bash
uv run main.py
```

This will start an interactive session where you can:
- Enter shopping lists (comma-separated items)
- Ask questions about products
- Get recommendations and corrections

### Running list_to_list.py

For a simpler, direct product search experience:

```bash
uv run list_to_list.py
```

This will prompt you to enter a shopping list and will return matching products.

## Features

- **Hybrid Search**: Combines semantic and keyword-based search for better results
- **List Correction**: Automatically corrects and standardizes shopping list items
- **Product Recommendations**: Suggests additional items based on your shopping list
- **Question Answering**: Can answer questions about products and shopping
- **Rich Interface**: Colorful and formatted output for better readability

## Notes

- Make sure your `.env` file is properly configured with your OpenAI API key
- The system requires an internet connection to access the OpenAI API
- Results are cached for better performance on subsequent searches
