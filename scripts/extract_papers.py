#!/usr/bin/env python3

import gzip
import json
import os
from pathlib import Path
import random
from typing import List, Dict, Any

# Configuration
DATA_DIR = Path("data/combined_compressed")
OUTPUT_FILE = Path("web/src/data/real_papers.json")
DISCIPLINE_STATS_FILE = Path("web/src/data/discipline_stats.json")
PAPERS_PER_DISCIPLINE = 100  # Base sample size for visualization
MIN_PAPERS_PER_DISCIPLINE = 150  # Minimum papers for small disciplines

def calculate_impact_score(paper_data: Dict[str, Any], year: int) -> float:
    """
    Calculate impact score based on multiple factors since citations aren't available.
    Factors: text quality, length, recency, methodology keywords, code availability
    """
    import re

    current_year = 2025
    text = paper_data.get("text", "").lower()

    year_factor = max(0, 1 - (current_year - year) / 25)  # Papers from 2000+ have some recency value

    text_length = len(text)
    if text_length < 2000:
        length_factor = 0.3
    elif text_length < 5000:
        length_factor = 0.5
    elif text_length < 15000:
        length_factor = 0.8
    elif text_length < 50000:
        length_factor = 1.0
    else:
        length_factor = 0.7

    methodology_keywords = [
        r'\bexperiment',
        r'\bmethodology',
        r'\bstatistical analysis',
        r'\bdata collection',
        r'\bresults',
        r'\bconclusion',
        r'\babstract',
        r'\bhypothesis',
        r'\bp\s*<\s*0\.0',  # Statistical significance
        r'\bn\s*=\s*\d+',  # Sample size
        r'\balgorithm',
        r'\bmodel',
        r'\bevaluation',
        r'\bperformance',
    ]

    methodology_score = sum(1 for keyword in methodology_keywords if re.search(keyword, text))
    methodology_factor = min(1.0, methodology_score / 8)  # Cap at 8 keywords

    # 4. Research depth indicators (0-1)
    depth_indicators = [
        r'\breferences',
        r'\bcitation',
        r'\brelated work',
        r'\bliterature review',
        r'\bfuture work',
        r'\bdiscussion',
        r'\blimitations',
        r'\bcontribution',
    ]

    depth_score = sum(1 for indicator in depth_indicators if re.search(indicator, text))
    depth_factor = min(1.0, depth_score / 5)

    # 5. Code/reproducibility bonus (0-1)
    code_bonus = 0.3 if has_code_available(paper_data) else 0

    # 6. Technical terms density (for scientific rigor)
    technical_terms = [
        r'\banalysis',
        r'\bsignificant',
        r'\bframework',
        r'\bapproach',
        r'\bnovel',
        r'\bproposed',
        r'\bimprovement',
    ]
    tech_score = sum(1 for term in technical_terms if re.search(term, text))
    tech_factor = min(1.0, tech_score / 5)

    # Weighted combination
    score = (
        year_factor * 0.20 +        # 20% recency
        length_factor * 0.15 +       # 15% comprehensiveness
        methodology_factor * 0.25 +  # 25% methodology
        depth_factor * 0.20 +        # 20% research depth
        code_bonus * 0.10 +          # 10% code availability
        tech_factor * 0.10           # 10% technical rigor
    ) * 100

    # Add some variance to avoid identical scores
    import random
    random.seed(paper_data.get("id", "0"))
    variance = random.uniform(-2, 2)

    return round(min(100, max(10, score + variance)), 2)

def has_code_available(paper_data: Dict[str, Any]) -> bool:

    text = paper_data.get("text", "").lower()

    # Check for common code availability indicators
    code_indicators = [
        "github.com",
        "code is available",
        "source code",
        "open source",
        "code available at",
        "implementation available"
    ]

    return any(indicator in text for indicator in code_indicators)

def extract_papers_from_file(file_path: Path, discipline: str, sample_size: int) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Extract and transform papers from a compressed JSONL file.
    Returns: (sampled_papers, full_discipline_stats)
    """
    papers = []

    print(f"Processing {file_path.name}...")

    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        all_papers = []
        for line in f:
            try:
                paper = json.loads(line)
                metadata = paper.get("metadata", {})

                # Extract required fields
                year = metadata.get("year")
                if not year or year < 2000:  # Filter old papers
                    continue

                # Get paper ID
                paper_id = paper.get("id", "")
                if not paper_id:
                    continue

                # Extract title from text (usually first line or section)
                text = paper.get("text", "")
                title_lines = text.split("\n\n")
                title = title_lines[0] if title_lines else "Untitled"
                # Clean title - take first reasonable length part
                title = title.strip()[:200]

                # Get citations (not in all datasets, default to 0)
                citations = metadata.get("citations", 0)
                if isinstance(citations, str):
                    try:
                        citations = int(citations)
                    except:
                        citations = 0

                all_papers.append({
                    "id": paper_id,
                    "title": title,
                    "year": year,
                    "citations": citations,
                    "domain": discipline,
                    "raw_data": paper
                })

            except json.JSONDecodeError:
                continue
            except Exception as e:
                print(f"Error processing paper: {e}")
                continue

        # Calculate statistics from ALL papers
        total_papers = len(all_papers)
        if total_papers == 0:
            return [], {"paperCount": 0, "avgImpact": 0, "codeAvailableCount": 0}

        total_impact = 0
        total_code_available = 0
        for paper in all_papers:
            impact = calculate_impact_score(paper["raw_data"], paper["year"])
            total_impact += impact
            if has_code_available(paper["raw_data"]):
                total_code_available += 1

        discipline_stats = {
            "paperCount": total_papers,
            "avgImpact": total_impact / total_papers,
            "codeAvailableCount": total_code_available
        }

        print(f"  Total papers in {discipline}: {total_papers}")
        print(f"  Avg impact: {discipline_stats['avgImpact']:.2f}, Code available: {total_code_available}")

        if len(all_papers) > sample_size:
            all_papers.sort(key=lambda x: x["year"])
            step = len(all_papers) / sample_size
            sampled_papers = [all_papers[int(i * step)] for i in range(sample_size)]
        else:
            sampled_papers = all_papers

        for paper in sampled_papers:
            transformed = {
                "id": paper["id"],
                "title": paper["title"],
                "impactScore": calculate_impact_score(paper["raw_data"], paper["year"]),
                "codeAvailable": has_code_available(paper["raw_data"]),
                "year": paper["year"],
                "citations": paper["citations"],
                "domain": paper["domain"]
            }
            papers.append(transformed)

    print(f"  Sampled {len(papers)} papers for visualization")
    return papers, discipline_stats

def main():
    """Main extraction process."""
    discipline_mapping = {
        "AgriculturalAndFoodSciences.jsonl.gz": "Agricultural and Food Sciences",
        "Biology.jsonl.gz": "Biology",
        "Chemistry.jsonl.gz": "Chemistry",
        "ComputerScience.jsonl.gz": "Computer Science",
        "Economics.jsonl.gz": "Economics",
        "Engineering.jsonl.gz": "Engineering",
        "EnvironmentalScience.jsonl.gz": "Environmental Science",
        "Mathematics.jsonl.gz": "Mathematics",
        "Medicine.jsonl.gz": "Medicine",
        "Physics.jsonl.gz": "Physics",
        "PoliticalScience.jsonl.gz": "Political Science",
        "Psychology.jsonl.gz": "Psychology",
    }

    all_papers = []
    discipline_stats = {}

    for filename, discipline in discipline_mapping.items():
        file_path = DATA_DIR / filename
        if file_path.exists():
            # Load more papers for smaller disciplines
            sample_size = PAPERS_PER_DISCIPLINE
            papers, stats = extract_papers_from_file(file_path, discipline, sample_size)

            # If discipline has very few papers, load more to ensure visibility
            if stats["paperCount"] < 1000:
                sample_size = MIN_PAPERS_PER_DISCIPLINE
                papers, stats = extract_papers_from_file(file_path, discipline, sample_size)
                print(f"  → Increased sample size to {sample_size} for small discipline")

            all_papers.extend(papers)
            discipline_stats[discipline] = stats
        else:
            print(f"Warning: {filename} not found")

    print(f"\n{'='*60}")
    print(f"Total papers sampled for visualization: {len(all_papers)}")
    print(f"{'='*60}")

    # Create output directory if it doesn't exist
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Write papers to JSON file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_papers, f, indent=2)

    # Write discipline stats to separate file
    with open(DISCIPLINE_STATS_FILE, 'w', encoding='utf-8') as f:
        json.dump(discipline_stats, f, indent=2)

    print(f"\nPapers written to {OUTPUT_FILE}")
    print(f"Discipline stats written to {DISCIPLINE_STATS_FILE}")

    # Print statistics
    print("\n" + "="*60)
    print("FULL DATASET STATISTICS (all papers):")
    print("="*60)

    total_all = sum(stats["paperCount"] for stats in discipline_stats.values())
    total_code_all = sum(stats["codeAvailableCount"] for stats in discipline_stats.values())

    print(f"\nTotal papers analyzed: {total_all:,}")
    print(f"Total with code: {total_code_all:,} ({total_code_all/total_all*100:.1f}%)")

    for discipline, stats in sorted(discipline_stats.items()):
        print(f"\n{discipline}:")
        print(f"  Total papers: {stats['paperCount']:,}")
        print(f"  With code: {stats['codeAvailableCount']:,} ({stats['codeAvailableCount']/stats['paperCount']*100:.1f}%)")
        print(f"  Avg impact score: {stats['avgImpact']:.2f}")

    print("\n" + "="*60)
    print("SAMPLED DATA STATISTICS (visualization subset):")
    print("="*60)
    by_discipline = {}
    for paper in all_papers:
        discipline = paper["domain"]
        if discipline not in by_discipline:
            by_discipline[discipline] = {
                "count": 0,
                "with_code": 0,
                "avg_impact": 0,
                "avg_citations": 0
            }
        by_discipline[discipline]["count"] += 1
        if paper["codeAvailable"]:
            by_discipline[discipline]["with_code"] += 1
        by_discipline[discipline]["avg_impact"] += paper["impactScore"]
        by_discipline[discipline]["avg_citations"] += paper["citations"]

    for discipline, stats in sorted(by_discipline.items()):
        stats["avg_impact"] /= stats["count"]
        stats["avg_citations"] /= stats["count"]
        print(f"\n{discipline}:")
        print(f"  Sampled papers: {stats['count']}")
        print(f"  With code: {stats['with_code']} ({stats['with_code']/stats['count']*100:.1f}%)")
        print(f"  Avg impact score: {stats['avg_impact']:.2f}")
        print(f"  Avg citations: {stats['avg_citations']:.0f}")

if __name__ == "__main__":
    main()
