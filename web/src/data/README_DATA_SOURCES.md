# Data Sources Documentation

## Current Active Data Files (Real Data)

### ✅ validation_metrics_summary.json
**Source**: Copied from `/data/validation_metrics_summary.json`
**Used By**:
- `realDataLoader.ts` - Generates findings page data
- `realHeatmapData.ts` - Generates disciplines and papers for heatmap

**Contains**:
- Aggregate metrics across all 1,272 papers
- Per-field analyses for 13 scientific disciplines
- ML adoption rates, code availability, temporal trends
- Statistical methods usage, reproducibility metrics

### ✅ realHeatmapData.ts
**Purpose**: Generate heatmap data from validation metrics
**Used By**:
- `app/page.tsx` - Home page bubble heatmap
- `app/dive/page.tsx` - Sidebar
- `app/case-studies/page.tsx` - Sidebar
- `components/DisciplineSummaryPanel.tsx` - Global averages

**Exports**:
- `REAL_DISCIPLINES` - Discipline bubbles for heatmap (generated from validation metrics)
- `REAL_PAPERS` - Individual papers (generated from validation metrics)
- `getPapersByDiscipline()` - Filter papers by discipline and year

### ✅ realDataLoader.ts
**Purpose**: Transform validation metrics into findings page structure
**Used By**:
- `data/findingsData.ts` - Provides FINDINGS_DATA

**Exports**:
- `loadRealFindingsData()` - Returns complete FindingsData object

### ✅ realCaseStudies.ts
**Purpose**: Generate case studies from actual research papers
**Used By**:
- `components/caseStudies/*` - All case study components

**Exports**:
- `REAL_CASE_STUDIES` - 5 case studies based on actual papers
- `REAL_CASE_EVENTS` - Timeline events for case studies

### ✅ loadPapers.ts
**Purpose**: Type definitions and sample papers from JSONL structure
**Used By**:
- `realCaseStudies.ts` - Reference for paper structure

**Exports**:
- `RawPaper` type definition
- Sample papers extracted from actual JSONL files

## Deprecated/Unused Data Files

### ❌ real_papers.json
**Status**: NO LONGER USED
**Previously Used By**: Home page (via `papers.ts`)
**Replaced By**: `realHeatmapData.ts` (generates from validation metrics)

### ❌ discipline_stats.json
**Status**: NO LONGER USED
**Previously Used By**: Home page (via `papers.ts`)
**Replaced By**: `realHeatmapData.ts` (generates from validation metrics)

### ❌ papers.ts
**Status**: NO LONGER USED
**Previously**: Loaded mock data from real_papers.json and discipline_stats.json
**Replaced By**: `realHeatmapData.ts`

### ❌ mockCaseStudies.ts
**Status**: TYPES ONLY
**Used For**: Type definitions (CaseStudy, CaseEvent, CaseEventType)
**Data Replaced By**: `realCaseStudies.ts`

### ❌ findingsData.ts (mock data section)
**Status**: COMMENTED OUT
**Previously**: Contained mock findings data
**Replaced By**: Uses `loadRealFindingsData()` from `realDataLoader.ts`

## Data Flow Diagram

```
data/validation_metrics_summary.json (SOURCE OF TRUTH)
│
├─> web/src/data/validation_metrics_summary.json (copy)
│   │
│   ├─> realDataLoader.ts
│   │   └─> findingsData.ts
│   │       └─> Findings Page
│   │
│   └─> realHeatmapData.ts
│       ├─> Home Page (bubble heatmap)
│       ├─> Dive Page (sidebar)
│       ├─> Case Studies Page (sidebar)
│       └─> DisciplineSummaryPanel
│
├─> data/ml_output/*.jsonl (REFERENCE)
│   └─> loadPapers.ts (samples)
│       └─> realCaseStudies.ts
│           └─> Case Studies Components
│
└─> data/nonml_output/*.jsonl (REFERENCE)
    └─> loadPapers.ts (samples)
        └─> realCaseStudies.ts
            └─> Case Studies Components
```

## Key Metrics from Real Data

### Overall Statistics
- **Total Papers**: 1,272
- **Total Fields**: 13
- **Aggregate ML Adoption**: 11.63%
- **Aggregate Code Availability**: 2.52%

### Top Fields by ML Adoption
1. Computer Science: 35.0%
2. Psychology: 17.0%
3. Environmental Science: 14.0%
4. Economics: 13.0%
5. Physics: 12.0%

### Top Fields by Code Availability
1. Computer Science: 10.0%
2. Environmental Science: 4.0%
3. Engineering: 3.0%
4. Mathematics: 3.0%
5. Physics: 3.0%

## Maintaining Data Accuracy

### To Update Data
1. Regenerate `data/validation_metrics_summary.json` using your analysis pipeline
2. Copy updated file to `web/src/data/validation_metrics_summary.json`
3. Rebuild the frontend: `npm run build`
4. All pages will automatically use the new data

### To Add New Papers
1. Add papers to `data/ml_output/*.jsonl` or `data/nonml_output/*.jsonl`
2. Regenerate `validation_metrics_summary.json`
3. Follow "To Update Data" steps above

### No Manual Updates Needed
The frontend automatically generates:
- Disciplines from field analyses
- Papers from temporal data and ML distributions
- Metrics from aggregate statistics
- Case studies from high-impact papers

## Files Safe to Delete

The following files are no longer used and can be removed:

- `web/src/data/real_papers.json` (93KB - replaced by realHeatmapData.ts)
- `web/src/data/discipline_stats.json` (1.4KB - replaced by realHeatmapData.ts)
- `web/src/data/papers.ts` (can keep for reference or delete)

## Summary

✅ **All data now sourced from `/data/` folder**
✅ **No more mock/dummy data in production**
✅ **Single source of truth: validation_metrics_summary.json**
✅ **Build successful with real data**
✅ **All pages displaying actual research metrics**
