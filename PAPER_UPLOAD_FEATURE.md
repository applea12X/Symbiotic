# Paper Upload & Analysis Feature

## Overview

The Dive feature now supports uploading your own research papers (PDF) for automatic ML/AI impact analysis. The system will:

1. Extract text from your PDF
2. Identify the research field
3. Assess ML/AI usage level
4. Compare your paper to field averages from the dataset
5. Provide detailed insights and recommendations

## How to Use

### From the Web Interface

1. Go to `http://localhost:3000/dive`
2. Click the **file icon** (📄) next to the input box
3. Select a PDF research paper from your computer
4. The analysis will automatically begin - no need to type anything!
5. Wait for the AI to analyze your paper (usually 30-60 seconds)
6. View the detailed analysis comparing your work to the dataset

### What You'll Get

The analysis includes:

#### 📄 Paper Overview
- **Field**: Automatically identified research field (Biology, Computer Science, etc.)
- **Year**: Extracted publication year (if available)
- **Topic Summary**: Brief description of what the paper is about

#### 🤖 ML/AI Impact Assessment
- **ML Usage Level**: Classification as NONE, MINIMAL, MODERATE, SUBSTANTIAL, or CORE
- **ML Techniques**: Specific techniques identified (neural networks, random forests, etc.)
- **ML Tools/Frameworks**: Software/libraries mentioned (TensorFlow, PyTorch, R, etc.)

#### 📊 Comparison to Field Average
- **Field's Average ML Adoption**: Percentage from our dataset
- **Your Paper's Position**: Whether you're above/below/at the average
- **Context**: How your paper compares to peers in the field

#### 💡 Key Insights
- Detailed comparison to field trends
- Assessment of whether your ML usage is typical/advanced/basic
- Notable aspects of your implementation
- Recommendations for future work

## ML Impact Levels Explained

- **NONE**: No ML/AI methods used in the research
- **MINIMAL**: ML mentioned but not central (e.g., basic statistical software like SPSS)
- **MODERATE**: ML methods used for analysis but not the main focus
- **SUBSTANTIAL**: ML is a significant part of the methodology
- **CORE**: ML/AI is the central focus of the research

## Example Analysis Output

```
📄 Paper Overview
- Field: Computer Science
- Estimated Year: 2023
- Topic Summary: This paper presents a novel deep learning approach for
  image classification using convolutional neural networks with attention
  mechanisms.

🤖 ML/AI Impact Assessment
- ML Usage Level: CORE
- ML Techniques Identified: Deep Learning, Convolutional Neural Networks,
  Attention Mechanisms, Transfer Learning
- ML Tools/Frameworks Mentioned: PyTorch, CUDA, NumPy

📊 Comparison to Field Average
- Your Field's Average ML Adoption: 35%
- Your Paper's Position: Well above average
- Context: Your paper is among the 35% of Computer Science papers that
  use ML/AI, and it represents a CORE ML implementation which is even
  more rare (only 8% of CS papers). This places your work at the
  cutting edge of ML adoption in your field.

💡 Key Insights
- Your paper demonstrates advanced ML usage compared to the 65% of CS
  papers that don't use ML at all
- The combination of CNNs with attention mechanisms represents
  state-of-the-art methodology
- Your ML implementation is more sophisticated than the field average
- Consider publishing your PyTorch implementation for better reproducibility
  (only 10% of CS papers share code)
```

## Technical Details

### Supported File Types
- PDF files only (`.pdf` extension)
- Text-based PDFs (scanned/image PDFs may not work well)

### File Size Limits
- Maximum file size: Depends on your server configuration
- For best results, use papers under 10MB

### Processing Time
- Typical analysis: 30-60 seconds
- Longer papers may take up to 2 minutes
- Processing time depends on:
  - Paper length
  - Ollama model performance
  - Server resources

### Privacy
- Papers are processed in real-time and not stored
- Text is extracted only for analysis
- No data is retained after the analysis completes

## Troubleshooting

### "Could not extract sufficient text from PDF"
- Your PDF might be image-based (scanned)
- Try using a text-based PDF or OCR the document first
- Ensure the PDF is not corrupted

### "Analysis timed out"
- The paper might be too long
- Try splitting into sections or use a shorter paper
- Check if Ollama is running properly

### Upload button is disabled
- Wait for any current analysis to complete
- Check that the backend is running
- Verify your internet connection

### Inaccurate field detection
- The AI uses heuristics to identify the field
- You can mention the field in a follow-up question
- Complex interdisciplinary papers may be harder to classify

## API Usage

For programmatic access:

```bash
curl -X POST http://localhost:8000/api/upload-paper \
  -F "file=@your_paper.pdf"
```

Response:
```json
{
  "response": "📄 Paper Overview\n- Field: Biology\n...",
  "error": null
}
```

## What Fields Are Supported?

The system can compare your paper to these fields in the dataset:

- Agricultural and Food Sciences
- Biology
- Business
- Computer Science
- Economics
- Engineering
- Environmental Science
- Materials Science
- Mathematics
- Medicine
- Physics
- Psychology

Papers from other fields will still be analyzed, but won't have comparison data available.

## Future Enhancements

Potential improvements:
- Support for more file formats (Word, LaTeX, etc.)
- Batch upload for multiple papers
- Detailed citation analysis
- Reproducibility scoring
- Code availability detection
- Collaboration network analysis
