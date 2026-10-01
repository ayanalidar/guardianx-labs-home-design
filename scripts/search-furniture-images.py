#!/usr/bin/env python3
"""Search for real furniture images and save results to JSON."""
import subprocess
import json
import sys
import os

RESULTS_FILE = "/home/z/my-project/scripts/furniture-images.json"

# Map of search key -> search query
SEARCHES = {
    "sofa": "modern gray fabric three seat sofa furniture product photo",
    "sofa-2": "modern two seat loveseat sofa furniture",
    "sectional": "modern L shaped sectional sofa furniture",
    "bed": "modern queen size bed with white bedding furniture",
    "bed-king": "luxury king size bed bedroom furniture",
    "bed-single": "single bed bedroom furniture minimal",
    "armchair": "modern accent armchair living room furniture",
    "coffee-table": "modern wooden coffee table living room furniture",
    "coffee-round": "round coffee table living room furniture",
    "dining-table": "wooden dining table furniture product photo",
    "dining-table-round": "round dining table furniture",
    "dining-chair": "wooden dining chair furniture product",
    "wardrobe": "modern wooden wardrobe closet bedroom furniture",
    "nightstand": "modern nightstand bedroom furniture bedside",
    "dresser": "wooden dresser bedroom furniture drawers",
    "fridge": "stainless steel refrigerator kitchen appliance",
    "stove": "modern kitchen stove cooktop appliance",
    "kitchen-counter": "modern kitchen counter cabinet countertop",
    "kitchen-island": "modern kitchen island with bar stools",
    "bathtub": "white porcelain bathtub bathroom fixture",
    "toilet": "modern white toilet bathroom fixture",
    "shower": "glass shower stall bathroom fixture",
    "vanity": "modern bathroom vanity sink cabinet",
    "desk": "modern office desk workspace furniture",
    "office-chair": "ergonomic office chair black furniture",
    "bookshelf": "tall wooden bookshelf with books furniture",
    "plant": "potted indoor houseplant green decoration",
    "plant-tree": "large potted indoor tree plant decoration",
    "floor-lamp": "modern floor lamp living room lighting",
    "table-lamp": "modern table lamp bedroom lighting",
    "tv": "wall mounted television flat screen tv",
    "patio-table": "outdoor patio table chairs furniture set",
    "patio-chair": "outdoor patio chair furniture",
    "lounge-chair": "outdoor lounge chair sunbed furniture",
    "rug": "modern area rug living room floor decor",
    "painting": "framed wall art painting home decor",
    "washer": "white washing machine laundry appliance",
    "bar-stool": "modern bar stool kitchen counter seating",
    "bookcase": "modern bookcase storage furniture",
    "filing-cabinet": "metal filing cabinet office storage",
    "console-table": "modern console table hallway furniture",
    "side-table": "small side table living room furniture",
    "ottoman": "round ottoman pouf living room furniture",
    "tv-stand": "modern tv stand media console furniture",
    "crib": "baby crib nursery furniture white",
    "kids-bed": "kids single bed children bedroom furniture",
    "bench": "wooden bench seating furniture",
    "coatrack": "standing coat rack hallway furniture",
    "shoe-rack": "wooden shoe rack organizer furniture",
    "pendant": "modern pendant light ceiling fixture",
    "chandelier": "crystal chandelier ceiling light fixture",
    "monitor": "computer monitor desktop screen on desk",
    "sculpture": "modern art sculpture decor statue",
    "vase": "ceramic vase decoration home decor",
}

results = {}

for key, query in SEARCHES.items():
    print(f"Searching: {key} -> {query}", flush=True)
    try:
        proc = subprocess.run(
            ["z-ai", "image-search", "-q", query, "--count", "1", "--no-rank", "--gl", "us"],
            capture_output=True, text=True, timeout=120
        )
        if proc.returncode == 0:
            try:
                data = json.loads(proc.stdout)
                if data.get("results") and len(data["results"]) > 0:
                    url = data["results"][0]["original_url"]
                    results[key] = url
                    print(f"  -> {url}", flush=True)
                else:
                    print(f"  -> No results", flush=True)
            except json.JSONDecodeError:
                print(f"  -> JSON parse error", flush=True)
        else:
            print(f"  -> Command failed: {proc.stderr[:100]}", flush=True)
    except subprocess.TimeoutExpired:
        print(f"  -> Timeout", flush=True)
    except Exception as e:
        print(f"  -> Error: {e}", flush=True)

# Save results
with open(RESULTS_FILE, "w") as f:
    json.dump({"images": results}, f, indent=2)

print(f"\n=== DONE: {len(results)}/{len(SEARCHES)} images found ===")
print(f"Saved to {RESULTS_FILE}")
