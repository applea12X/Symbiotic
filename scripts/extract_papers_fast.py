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
PAPERS_PER_DISCIPLINE = 100  # Base sample size
MIN_PAPERS_PER_DISCIPLINE = 150  # For small disciplines

def calculate_impact_score_fast(text: str, year: int, has_code: bool) -> float:
    """Fast impact score calculation using simple string operations."""
    text_lower = text.lower()
    current_year = 2025

    # Year factor
    year_factor = max(0, 1 - (current_year - year) / 25)

    # Length factor
    text_len = len(text)
    if text_len < 5000:
        length_factor = 0.4
    elif text_len < 20000:
        length_factor = 0.8
    elif text_len < 50000:
        length_factor = 1.0
    else:
        length_factor = 0.7

    # Quick keyword counting (simple contains checks)
    keywords = ['experiment', 'methodology', 'results', 'conclusion', 'abstract',
                'hypothesis', 'algorithm', 'model', 'evaluation', 'performance',
                'references', 'citation', 'discussion', 'analysis', 'significant',
                'framework', 'approach', 'novel', 'proposed']

    keyword_score = sum(1 for kw in keywords if kw in text_lower)
    keyword_factor = min(1.0, keyword_score / 12)

    # Code bonus
    code_factor = 0.2 if has_code else 0

    # Combined score
    score = (
        year_factor * 0.30 +
        length_factor * 0.25 +
        keyword_factor * 0.35 +
        code_factor * 0.10
    ) * 100

    # Add variance
    hash_val = sum(ord(c) for c in str(text_len)[:5])
    variance = (hash_val % 7) - 3  # -3 to +3

    return round(min(95, max(15, score + variance)), 2)

def has_code_available(text: str) -> bool:
    """Quick check for code availability."""
    text_lower = text.lower()
    return ('github.com' in text_lower or
            'code is available' in text_lower or
            'source code' in text_lower)

def extract_papers_from_file(file_path: Path, discipline: str, sample_size: int) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Extract papers with progress indication."""
    papers = []

    print(f"Processing {file_path.name}...")

    with gzip.open(file_path, 'rt', encoding='utf-8') as f:
        all_papers = []
        count = 0
        for line in f:
            try:
                paper = json.loads(line)
                metadata = paper.get("metadata", {})

                year = metadata.get("year")
                if not year or year < 2000:
                    continue

                paper_id = paper.get("id", "")
                if not paper_id:
                    continue

                text = paper.get("text", "")
                title_lines = text.split("\n\n")
                title = title_lines[0] if title_lines else "Untitled"
                title = title.strip()[:200]

                all_papers.append({
                    "id": paper_id,
                    "title": title,
                    "year": year,
                    "text": text,
                    "domain": discipline
                })

                count += 1
                if count % 1000 == 0:
                    print(f"  Read {count} papers...")

            except:
                continue

        total_papers = len(all_papers)
        print(f"  Total valid papers: {total_papers}")

        if total_papers == 0:
            return [], {"paperCount": 0, "avgImpact": 0, "codeAvailableCount": 0}

        # Calculate stats
        total_impact = 0
        total_code = 0
        for paper in all_papers:
            has_code = has_code_available(paper["text"])
            impact = calculate_impact_score_fast(paper["text"], paper["year"], has_code)
            total_impact += impact
            if has_code:
                total_code += 1

        stats = {
            "paperCount": total_papers,
            "avgImpact": total_impact / total_papers,
            "codeAvailableCount": total_code
        }

        print(f"  Avg impact: {stats['avgImpact']:.2f}, Code: {total_code}")

        # Sample papers
        if len(all_papers) > sample_size:
            all_papers.sort(key=lambda x: x["year"])
            step = len(all_papers) / sample_size
            sampled = [all_papers[int(i * step)] for i in range(sample_size)]
        else:
            sampled = all_papers

        # Transform
        for paper in sampled:
            has_code = has_code_available(paper["text"])
            papers.append({
                "id": paper["id"],
                "title": paper["title"],
                "impactScore": calculate_impact_score_fast(paper["text"], paper["year"], has_code),
                "codeAvailable": has_code,
                "year": paper["year"],
                "citations": 0,
                "domain": paper["domain"]
            })

        print(f"  Sampled {len(papers)} papers\n")
        return papers, stats

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
            sample_size = PAPERS_PER_DISCIPLINE
            papers, stats = extract_papers_from_file(file_path, discipline, sample_size)

            # Load more for small disciplines
            if stats["paperCount"] < 1000:
                sample_size = MIN_PAPERS_PER_DISCIPLINE
                papers, stats = extract_papers_from_file(file_path, discipline, sample_size)

            all_papers.extend(papers)
            discipline_stats[discipline] = stats
        else:
            print(f"Warning: {filename} not found")

    print(f"\n{'='*60}")
    print(f"Total sampled: {len(all_papers)}")
    print(f"{'='*60}\n")

    # Write files
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(all_papers, f, indent=2)

    with open(DISCIPLINE_STATS_FILE, 'w') as f:
        json.dump(discipline_stats, f, indent=2)

    print(f"Papers: {OUTPUT_FILE}")
    print(f"Stats: {DISCIPLINE_STATS_FILE}")

    # Print summary
    total_all = sum(s["paperCount"] for s in discipline_stats.values())
    total_code = sum(s["codeAvailableCount"] for s in discipline_stats.values())

    print(f"\nTotal papers: {total_all:,}")
    print(f"With code: {total_code:,} ({total_code/total_all*100:.1f}%)")

    for disc, stats in sorted(discipline_stats.items()):
        print(f"\n{disc}:")
        print(f"  Papers: {stats['paperCount']:,}, Impact: {stats['avgImpact']:.1f}")

if __name__ == "__main__":
    main()
