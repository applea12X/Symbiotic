# Quick Start Guide - Dive Feature

## What's New? 🎉

Your Dive feature now has two powerful capabilities:

1. **💬 Ask Questions**: Query the research dataset with natural language
2. **📄 Upload Papers**: Upload your own PDF and get ML impact analysis

## Start the System

### 1. Terminal 1 - Backend
```bash
cd backend
python main.py
```

Wait for: `✓ Dataset loaded successfully`

### 2. Terminal 2 - Frontend
```bash
cd web
npm run dev
```

### 3. Open Browser
Go to: `http://localhost:3000/dive`

## Using the Features

### Ask Questions About the Dataset
Just type in the chat box:
- "How many biology papers implement AI?"
- "What's the ML adoption rate in Computer Science?"
- "Which field has the highest code availability?"

### Upload Your Own Paper
1. Click the **📄 file icon** (changed from the Plus icon)
2. Select a PDF research paper
3. Wait 30-60 seconds
4. Get automatic analysis comparing your work to the dataset!

## What the Analysis Shows

When you upload a paper, you'll get:

✅ **Paper Overview**
- Field identification
- Topic summary
- Publication year

✅ **ML Impact Assessment**
- ML usage level (NONE to CORE)
- Specific techniques identified
- Tools/frameworks mentioned

✅ **Field Comparison**
- How you compare to field average
- Whether you're above/below the curve
- Context about your ML usage

✅ **Key Insights**
- Detailed comparison to peers
- Recommendations
- Notable aspects

## Example Workflow

1. **Ask a question**: "What's the average ML adoption in Biology?"
   - Response: "Biology has 10% ML adoption rate (10 out of 100 papers)"

2. **Upload your biology paper**: Click 📄, select your PDF
   - Wait for analysis...
   - Get: "Your paper shows MODERATE ML usage, which is above the 10% field average!"

3. **Ask follow-up**: "What ML techniques are common in Biology papers?"
   - Get insights from the dataset

## Tips

- Use **text-based PDFs** (not scanned images)
- Papers under 10MB work best
- Analysis takes 30-60 seconds
- Backend must be running for uploads to work
- You can ask questions while waiting for paper analysis

## Troubleshooting

### Upload button disabled?
- Wait for any current analysis to finish
- Check backend is running: `curl http://localhost:8000/api/health`

### "Could not extract text"?
- Your PDF might be image-based
- Try a different paper or convert to text-based PDF

### Slow responses?
- First query loads the Ollama model (slower)
- Subsequent queries are faster
- Consider GPU acceleration for Ollama

## Architecture

```
User clicks 📄 → Uploads PDF → Backend extracts text →
Sends to Ollama with dataset context →
Gets analysis → Shows in chat
```

All automatic - no typing needed after upload!

## Next Steps

- Try uploading one of your research papers
- Compare different papers from the same field
- Ask comparative questions about the dataset
- Explore ML adoption trends across fields

Enjoy exploring your research with AI! 🚀
