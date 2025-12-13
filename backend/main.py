"""
FastAPI backend for research paper dataset Q&A using Ollama.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from pathlib import Path
from typing import Optional

app = FastAPI(title="Research Paper Dataset API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset at startup
DATASET_PATH = Path(__file__).parent.parent / "data" / "validation_metrics_summary.json"
dataset = None


@app.on_event("startup")
async def load_dataset():
    """Load the validation metrics dataset."""
    global dataset
    try:
        with open(DATASET_PATH, "r") as f:
            dataset = json.load(f)
        print("✓ Dataset loaded successfully")
    except Exception as e:
        print(f"✗ Error loading dataset: {e}")
        dataset = None


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[list] = []


class ChatResponse(BaseModel):
    response: str
    error: Optional[str] = None


def construct_prompt(user_query: str, dataset_data: dict) -> str:
    """
    Construct a prompt for Ollama that includes relevant dataset context.
    Intelligently detects which field(s) the query is about and prioritizes that data.
    """
    # Extract key information from the dataset
    metadata = dataset_data.get("metadata", {})
    aggregate = dataset_data.get("aggregate_metrics", {})
    fields = dataset_data.get("field_analyses", {})

    # Detect which field the user is asking about
    query_lower = user_query.lower()
    mentioned_fields = []
    field_mapping = {
        "biology": "Biology",
        "computer science": "ComputerScience",
        "cs": "ComputerScience",
        "physics": "Physics",
        "psychology": "Psychology",
        "medicine": "Medicine",
        "engineering": "Engineering",
        "mathematics": "Mathematics",
        "math": "Mathematics",
        "economics": "Economics",
        "business": "Business",
        "environmental science": "EnvironmentalScience",
        "materials science": "MaterialsScience",
        "agricultural": "AgriculturalAndFoodSciences",
        "agriculture": "AgriculturalAndFoodSciences",
    }

    for keyword, field_name in field_mapping.items():
        if keyword in query_lower and field_name in fields:
            mentioned_fields.append(field_name)

    # Build a quick reference table for all fields
    quick_reference = []
    for field_name, field_data in fields.items():
        ml_impact = field_data.get("ml_impact", {})
        reproducibility = field_data.get("reproducibility", {})
        total_papers = ml_impact.get('total_papers', 0)
        ml_rate = ml_impact.get('ml_adoption_rate', 0)
        ml_papers = int(total_papers * ml_rate / 100)

        quick_reference.append(
            f"  • {field_name}: {total_papers} papers, {ml_papers} with ML ({ml_rate}%), "
            f"{reproducibility.get('papers_with_code', 0)} with code"
        )

    # Build detailed data for mentioned fields or all fields if none mentioned
    detailed_fields = mentioned_fields if mentioned_fields else list(fields.keys())

    detailed_data = []
    for field_name in detailed_fields:
        if field_name not in fields:
            continue

        field_data = fields[field_name]
        ml_impact = field_data.get("ml_impact", {})
        reproducibility = field_data.get("reproducibility", {})
        temporal = field_data.get("temporal", {})
        methodology = field_data.get("methodology", {})

        total_papers = ml_impact.get('total_papers', 0)
        ml_rate = ml_impact.get('ml_adoption_rate', 0)
        ml_papers = int(total_papers * ml_rate / 100)

        detail = f"""
{field_name}:
  Total Papers: {total_papers}
  ML/AI Papers: {ml_papers} papers ({ml_rate}% adoption rate)
  ML Distribution:
{json.dumps(ml_impact.get('ml_distribution', {}), indent=4)}

  Code Availability: {reproducibility.get('code_availability_rate', 0)}%
  Papers with Code: {reproducibility.get('papers_with_code', 0)}

  Statistical Methods Usage: {methodology.get('statistical_methods_usage_rate', 0)}%
  Year Range: {temporal.get('year_range', 'N/A')}"""

        detailed_data.append(detail)

    dataset_summary = f"""You are an expert research data analyst. Answer questions about research paper statistics with precision and accuracy.

DATASET OVERVIEW:
• Total Papers: {metadata.get('total_papers', 'N/A')}
• Fields Analyzed: {metadata.get('total_fields', 'N/A')}
• Overall ML Adoption: {aggregate.get('aggregate_ml_adoption_rate', 'N/A')}%
• Overall Code Availability: {aggregate.get('aggregate_code_availability_rate', 'N/A')}%

QUICK REFERENCE - ALL FIELDS:
{chr(10).join(quick_reference)}

DETAILED DATA FOR RELEVANT FIELD(S):
{chr(10).join(detailed_data)}

USER QUESTION: {user_query}

CRITICAL INSTRUCTIONS:
1. The data above is AUTHORITATIVE - Biology and all other fields ARE present in the dataset
2. Look at the QUICK REFERENCE or DETAILED DATA sections - the field data is RIGHT THERE
3. When asked about ML/AI papers, use the "ML/AI Papers" number directly
4. Be specific with numbers - cite exactly what you see in the data
5. DO NOT say a field doesn't exist - it's in the data above
6. Answer concisely but accurately

Now answer the question using ONLY the data provided above:"""

    return dataset_summary


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Handle chat requests and query Ollama with dataset context.
    """
    if dataset is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")

    try:
        # Construct prompt with dataset context
        prompt = construct_prompt(request.message, dataset)

        # Call Ollama API
        ollama_response = requests.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": "llama3.1:8b",
                "prompt": prompt,
                "stream": False,  # Get full response at once
            },
            timeout=60,  # 60 second timeout
        )

        if ollama_response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Ollama API error: {ollama_response.text}"
            )

        # Extract response from Ollama
        ollama_data = ollama_response.json()
        response_text = ollama_data.get("response", "")

        return ChatResponse(response=response_text)

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Request to Ollama timed out")
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama server. Make sure it's running at http://127.0.0.1:11434"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "dataset_loaded": dataset is not None,
        "ollama_reachable": check_ollama_connection()
    }


def check_ollama_connection() -> bool:
    """Check if Ollama server is reachable."""
    try:
        response = requests.get("http://127.0.0.1:11434/api/tags", timeout=2)
        return response.status_code == 200
    except:
        return False


@app.get("/api/dataset/summary")
async def get_dataset_summary():
    """Get a summary of the dataset."""
    if dataset is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")

    return {
        "metadata": dataset.get("metadata", {}),
        "aggregate_metrics": dataset.get("aggregate_metrics", {}),
        "available_fields": list(dataset.get("field_analyses", {}).keys())
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
