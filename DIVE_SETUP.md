# Dive Feature Setup Guide

This guide will help you set up and run the "Dive" feature, which allows users to query the research paper dataset using natural language via Ollama.

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  Next.js    │─────▶│   FastAPI    │─────▶│   Ollama    │
│  Frontend   │      │   Backend    │      │  (llama3.1) │
│  (port 3000)│      │  (port 8000) │      │ (port 11434)│
└─────────────┘      └──────────────┘      └─────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ validation_metrics  │
                    │   _summary.json     │
                    └─────────────────────┘
```

## Prerequisites

1. **Ollama** - Install from https://ollama.ai
2. **Python 3.9+** - For the FastAPI backend
3. **Node.js 18+** - For the Next.js frontend

## Setup Instructions

### 1. Set up Ollama

```bash
# Install Ollama (if not already installed)
# Visit https://ollama.ai for installation instructions

# Pull the llama3.1:8b model
ollama pull llama3.1:8b

# Start Ollama server (if not already running)
# On macOS, Ollama runs automatically after installation
# On Linux, run:
ollama serve
```

Verify Ollama is running:
```bash
curl http://127.0.0.1:11434/api/tags
```

### 2. Set up Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python main.py

# Or use the convenience script
./run.sh
```

The backend will start on `http://localhost:8000`

Verify the backend is running:
```bash
curl http://localhost:8000/api/health
```

### 3. Set up Frontend (Next.js)

```bash
# Navigate to web directory
cd web

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Dive Feature

1. Open your browser to `http://localhost:3000`
2. Navigate to the "Dive" section (click the Dive button in the sidebar)
3. Start asking questions about the research dataset!

## Example Queries

Here are some example questions you can ask:

1. **ML Adoption Queries:**
   - "How many papers in biology implement AI?"
   - "What's the ML adoption rate in Computer Science?"
   - "Which field has the highest ML adoption?"
   - "Show me the top 3 fields by ML adoption"

2. **Code Availability:**
   - "Which field has the highest code availability?"
   - "What's the code availability rate for Physics papers?"
   - "Compare code availability between Biology and Computer Science"

3. **Temporal Analysis:**
   - "How has ML adoption changed over time in Biology?"
   - "What's the year range for Computer Science papers?"
   - "Show me ML adoption trends by year"

4. **Framework Analysis:**
   - "What ML frameworks are used in Computer Science?"
   - "List the top frameworks in Environmental Science"

5. **General Statistics:**
   - "Give me an overview of the dataset"
   - "How many total papers are analyzed?"
   - "What fields are available in the dataset?"

## Troubleshooting

### Backend won't start

**Error: "Cannot connect to Ollama server"**
- Make sure Ollama is running: `curl http://127.0.0.1:11434/api/tags`
- Start Ollama if needed: `ollama serve`
- Verify the model is pulled: `ollama list`

**Error: "Dataset not loaded"**
- Check that `/data/validation_metrics_summary.json` exists
- Verify the file path in `backend/main.py` is correct

### Frontend shows connection error

**Error: "Make sure the backend server is running"**
- Verify backend is running: `curl http://localhost:8000/api/health`
- Check CORS settings in `backend/main.py` if using different ports
- Ensure no firewall is blocking port 8000

### Slow responses

- The first query might be slow as Ollama loads the model
- Subsequent queries should be faster
- Consider using a smaller model if responses are too slow
- GPU acceleration will significantly improve performance

## API Endpoints

### POST /api/chat
Send a natural language query about the dataset.

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
  "response": "Based on the dataset, Biology has 100 total papers with a 10% ML adoption rate. This means 10 papers implement AI/ML techniques.",
  "error": null
}
```

### GET /api/health
Check the health of the backend and Ollama connection.

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
  "metadata": {
    "total_papers": 1272,
    "total_fields": 13
  },
  "aggregate_metrics": {...},
  "available_fields": ["Biology", "ComputerScience", ...]
}
```

## Development

### Modifying the Prompt

The prompt construction logic is in `backend/main.py` in the `construct_prompt()` function. You can modify this to:
- Include more or less dataset context
- Change the formatting of the response
- Add specific instructions for the AI

### Using a Different Model

To use a different Ollama model, modify `backend/main.py`:

```python
ollama_response = requests.post(
    "http://127.0.0.1:11434/api/generate",
    json={
        "model": "your-model-name",  # Change this
        "prompt": prompt,
        "stream": False,
    },
)
```

### Deploying to Production

1. **Backend:**
   - Use a production ASGI server: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`
   - Set up proper CORS origins
   - Add authentication if needed
   - Use environment variables for configuration

2. **Frontend:**
   - Update API URL in `ChatInterface.tsx` to production backend URL
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or your preferred hosting

3. **Ollama:**
   - Ensure Ollama server is running on the backend infrastructure
   - Consider using GPU-enabled instances for better performance
   - Set up monitoring and health checks

## Performance Tips

1. **Caching:** Consider caching common queries
2. **Streaming:** Implement streaming responses for better UX
3. **Rate Limiting:** Add rate limiting to prevent abuse
4. **Model Selection:** Use appropriate model size for your use case
   - `llama3.1:8b` - Good balance of speed and quality
   - `llama3.1:70b` - Better quality but slower
   - `mistral:7b` - Faster but may be less accurate

## License

This is part of the research-paper-agent project.
