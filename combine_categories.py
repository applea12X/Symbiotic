#!/usr/bin/env python3

import json
import os
from pathlib import Path
from collections import defaultdict
from tqdm import tqdm

# Configuration
INPUT_DIR = Path("data/papers")
OUTPUT_DIR = Path("data/combined")
OUTPUT_FORMAT = "jsonl"  # Options: "jsonl" (one JSON object per line) or "json" (single array)
INCLUDE_METADATA = True  # Add source file info to each paper

def setup_output_dir():
    """Create the output directory if it doesn't exist."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"✓ Output directory: {OUTPUT_DIR}")

def extract_category_from_filename(filename):
    """
    Extract the category/field from the filename.
    Example: Biology_2022-2022_train_Biology-2022.gz-0000.json -> Biology
    """
    # The category is typically the first part before the first underscore
    parts = filename.split('_')
    if parts:
        # Handle cases like "AgriculturalAndFoodSciences"
        category = parts[0]
        return category
    return "Unknown"

def categorize_files(input_dir):
    """Group files by their category."""
    category_files = defaultdict(list)

    all_files = list(input_dir.glob("*.json")) + list(input_dir.glob("*.jsonl"))

    print(f"✓ Found {len(all_files)} files to process")

    for file_path in all_files:
        category = extract_category_from_filename(file_path.name)
        category_files[category].append(file_path)

    return category_files

def read_json_file(file_path):
    """
    Read a JSON file and return papers as a list.
    Handles both JSON arrays and JSONL format.
    """
    papers = []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            # Try to load as regular JSON first
            try:
                data = json.load(f)
                if isinstance(data, list):
                    papers = data
                elif isinstance(data, dict):
                    papers = [data]
                else:
                    print(f"  ⚠️  Unexpected JSON format in {file_path.name}")
            except json.JSONDecodeError:
                # Try as JSONL (one JSON object per line)
                f.seek(0)
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    if line:
                        try:
                            papers.append(json.loads(line))
                        except json.JSONDecodeError as e:
                            print(f"  ⚠️  Error parsing line {line_num} in {file_path.name}: {e}")
    except Exception as e:
        print(f"  ✗ Error reading {file_path.name}: {e}")

    return papers

def add_source_metadata(papers, source_file):
    """Add metadata about the source file to each paper."""
    for paper in papers:
        if isinstance(paper, dict):
            paper['_source_file'] = source_file.name
            paper['_source_category'] = extract_category_from_filename(source_file.name)
    return papers

def combine_category_files(category, files):
    """Combine all files for a category into a single file."""
    all_papers = []
    total_papers = 0

    print(f"\n  Processing {category} ({len(files)} files)...")

    for file_path in tqdm(files, desc=f"  Reading {category}", leave=False):
        papers = read_json_file(file_path)

        if INCLUDE_METADATA:
            papers = add_source_metadata(papers, file_path)

        all_papers.extend(papers)
        total_papers += len(papers)

    print(f"  ✓ Total papers in {category}: {total_papers:,}")

    return all_papers

def write_combined_file(category, papers, output_dir, format_type):
    """Write combined papers to output file."""
    if format_type == "jsonl":
        output_file = output_dir / f"{category}.jsonl"
        with open(output_file, 'w', encoding='utf-8') as f:
            for paper in papers:
                f.write(json.dumps(paper, ensure_ascii=False) + '\n')
    else:  # json
        output_file = output_dir / f"{category}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(papers, f, ensure_ascii=False, indent=2)

    # Get file size
    size_mb = output_file.stat().st_size / (1024 * 1024)
    print(f"  ✓ Written to {output_file.name} ({size_mb:.1f} MB)")

    return output_file

def generate_summary(category_stats):
    """Generate a summary report."""
    summary_file = OUTPUT_DIR / "summary.txt"

    with open(summary_file, 'w') as f:
        f.write("=" * 60 + "\n")
        f.write("Combined Categories Summary\n")
        f.write("=" * 60 + "\n\n")

        total_papers = 0
        for category, count in sorted(category_stats.items()):
            f.write(f"{category:30s}: {count:10,} papers\n")
            total_papers += count

        f.write("\n" + "=" * 60 + "\n")
        f.write(f"{'TOTAL':30s}: {total_papers:10,} papers\n")
        f.write("=" * 60 + "\n")

    print(f"\n✓ Summary written to {summary_file}")

    # Also print to console
    print("\n" + "=" * 60)
    print("Category Summary:")
    print("=" * 60)
    for category, count in sorted(category_stats.items()):
        print(f"  {category:30s}: {count:10,} papers")
    print("=" * 60)
    print(f"  {'TOTAL':30s}: {sum(category_stats.values()):10,} papers")
    print("=" * 60)

def main():
    print("=" * 60)
    print("Combine Research Papers by Category")
    print("=" * 60)

    # Check if input directory exists
    if not INPUT_DIR.exists():
        print(f"\n✗ Error: Input directory {INPUT_DIR} does not exist!")
        print(f"  Please run cleanup_data.py first to create it.")
        return

    # Setup
    setup_output_dir()

    # Categorize files
    print(f"\nScanning {INPUT_DIR}...")
    category_files = categorize_files(INPUT_DIR)

    if not category_files:
        print("\n✗ No files found to process!")
        return

    print(f"\n✓ Found {len(category_files)} categories:")
    for category, files in sorted(category_files.items()):
        print(f"  - {category:30s}: {len(files)} files")

    # Process each category
    print(f"\n{'=' * 60}")
    print("Combining files...")
    print("=" * 60)

    category_stats = {}

    for category, files in sorted(category_files.items()):
        papers = combine_category_files(category, files)
        write_combined_file(category, papers, OUTPUT_DIR, OUTPUT_FORMAT)
        category_stats[category] = len(papers)

    # Generate summary
    generate_summary(category_stats)

    print(f"\n✓ All categories combined in: {OUTPUT_DIR}")
    print(f"✓ Output format: {OUTPUT_FORMAT.upper()}")

if __name__ == "__main__":
    main()
