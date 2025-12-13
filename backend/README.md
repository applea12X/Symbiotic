# Research Paper Dataset API

FastAPI backend for querying the research paper dataset using Ollama.

## Setup

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Make sure Ollama is running with the llama3.1:8b model:
```bash
# Check if Ollama is running
curl http://127.0.0.1:11434/api/tags

# If not running, start Ollama and pull the model
ollama pull llama3.1:8b
```

3. Run the backend server:
```bash
# From the backend directory
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### POST /api/chat
Query the dataset with natural language questions.

**Request:**
```json
{
  "message": "How many papers in biology implement AI?",
  "conversation_history": []
}
```

**Response:**
```json
{
  "response": "Based on the dataset, Biology has 100 total papers with a 10% ML adoption rate...",
  "error": null
}
```

### POST /api/upload-paper
Upload a research paper PDF for ML impact analysis and comparison with the dataset.

**Request:**
- Content-Type: `multipart/form-data`
- Body: PDF file as `file` parameter

**Response:**
```json
{
  "response": "📄 Paper Overview\n- Field: Biology\n- ML Usage Level: MODERATE\n...",
  "error": null
}
```

**Features:**
- Automatically extracts text from PDF
- Identifies research field
- Assesses ML/AI usage level
- Compares to field averages from dataset
- Provides detailed insights and recommendations

### GET /api/health
Health check endpoint to verify the API and Ollama connection.

**Response:**
```json
{
  "status": "healthy",
  "dataset_loaded": true,
  "ollama_reachable": true
}
```

### GET /api/dataset/summary
Get a summary of the available dataset.

**Response:**
```json
{
  "metadata": {...},
  "aggregate_metrics": {...},
  "available_fields": [...]
}
```

## Example Queries

**Dataset Questions:**
- "How many papers in biology implement AI?"
- "What's the ML adoption rate in Computer Science?"
- "Which field has the highest code availability?"
- "Show me the top 3 fields by ML adoption"
- "What frameworks are used in Biology?"

**Paper Upload:**
- Upload your own research paper PDF
- Get automatic ML impact assessment
- Compare your work to field averages
- Receive insights about ML usage in your field
