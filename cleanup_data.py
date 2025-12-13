#!/usr/bin/env python3

import os
import shutil
import gzip
import json
from pathlib import Path
from tqdm import tqdm

DATA_DIR = Path("data")
OUTPUT_DIR = Path("data/papers")
DECOMPRESS_GZ = True 

def setup_output_dir():
    """Create the output directory if it doesn't exist."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"✓ Output directory: {OUTPUT_DIR}")

def find_json_files():
    patterns = ["**/*.json", "**/*.json.gz", "**/*.jsonl.gz"]
    files = []

    for pattern in patterns:
        found = list(DATA_DIR.glob(pattern))
        found = [f for f in found if OUTPUT_DIR not in f.parents]
        files.extend(found)

    return files

def generate_unique_filename(original_path, output_dir):
    """
    Generate a unique filename combining field, year, and split info.
    Example: Biology,2022-2022/train/Biology-2022.gz-0000.json
    -> Biology_2022-2022_train_Biology-2022.gz-0000.json
    """
    parts = original_path.parts

    # Find the field,year directory
    field_year = None
    split = None
    for i, part in enumerate(parts):
        if ',' in part and '-' in part:  # Field,Year-Year pattern
            field_year = part.replace(',', '_')
            if i + 1 < len(parts) and parts[i + 1] in ['train', 'test', 'val']:
                split = parts[i + 1]
            break
    # Build new filename
    if field_year and split:
        new_name = f"{field_year}_{split}_{original_path.name}"
    else:
        new_name = original_path.name

    return output_dir / new_name

def decompress_gz_file(gz_path, output_path):
    """Decompress a .gz file to the output path."""
    try:
        with gzip.open(gz_path, 'rb') as f_in:
            with open(output_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        return True
    except Exception as e:
        print(f"  ✗ Error decompressing {gz_path.name}: {e}")
        return False

def process_files(files):
    """Process and consolidate all JSON files."""
    stats = {
        'copied': 0,
        'decompressed': 0,
        'skipped': 0,
        'errors': 0
    }

    print(f"\nProcessing {len(files)} files...")

    for file_path in tqdm(files, desc="Consolidating files"):
        try:
            output_path = generate_unique_filename(file_path, OUTPUT_DIR)
            if file_path.suffix == '.gz' and DECOMPRESS_GZ:
                output_path = output_path.with_suffix('')

                if output_path.exists():
                    stats['skipped'] += 1
                    continue

                if decompress_gz_file(file_path, output_path):
                    stats['decompressed'] += 1
                else:
                    stats['errors'] += 1
            else:
                if output_path.exists():
                    stats['skipped'] += 1
                    continue

                shutil.copy2(file_path, output_path)
                stats['copied'] += 1

        except Exception as e:
            print(f"  ✗ Error processing {file_path.name}: {e}")
            stats['errors'] += 1

    return stats

def cleanup_old_structure():
    """Optional: Remove old train/test/val directories."""
    print("\n⚠️  Old directory structure cleanup:")
    response = input("Do you want to remove the old Field,Year-Year directories? (yes/no): ")

    if response.lower() in ['yes', 'y']:
        for item in DATA_DIR.iterdir():
            if item.is_dir() and item != OUTPUT_DIR and ',' in item.name:
                try:
                    shutil.rmtree(item)
                    print(f"  ✓ Removed {item.name}")
                except Exception as e:
                    print(f"  ✗ Error removing {item.name}: {e}")
    else:
        print("  Keeping old directories.")

def main():
    print("=" * 60)
    print("Research Paper Data Cleanup Script")
    print("=" * 60)
    setup_output_dir()
    files = find_json_files()
    print(f"✓ Found {len(files)} JSON files")

    if not files:
        print("No files to process!")
        return

    # Show file type breakdown
    json_files = [f for f in files if f.suffix == '.json']
    json_gz_files = [f for f in files if f.name.endswith('.json.gz')]
    jsonl_gz_files = [f for f in files if f.name.endswith('.jsonl.gz')]

    print(f"\nFile breakdown:")
    print(f"  - .json files: {len(json_files)}")
    print(f"  - .json.gz files: {len(json_gz_files)}")
    print(f"  - .jsonl.gz files: {len(jsonl_gz_files)}")

    if DECOMPRESS_GZ:
        print(f"\n⚙️  Will decompress .gz files")

    # Process files
    stats = process_files(files)

    # Print summary
    print("\n" + "=" * 60)
    print("Summary:")
    print(f"  ✓ Copied: {stats['copied']}")
    print(f"  ✓ Decompressed: {stats['decompressed']}")
    print(f"  - Skipped (already exists): {stats['skipped']}")
    print(f"  ✗ Errors: {stats['errors']}")
    print("=" * 60)

    # Optional cleanup
    cleanup_old_structure()

    print(f"\n✓ All files consolidated in: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
