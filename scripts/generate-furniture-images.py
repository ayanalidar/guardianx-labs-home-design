#!/usr/bin/env python3
"""Generate real furniture product images using z-ai image generation."""
import subprocess
import json
import os
import sys

OUTPUT_DIR = "/home/z/my-project/public/furniture"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Map of image key -> prompt
# Generate one image per furniture TYPE (not per catalog item)
GENERATIONS = {
    "sofa": "Professional product photo of a modern gray fabric 3-seat sofa, clean white background, studio lighting, e-commerce style, top angle slight",
    "bed": "Professional product photo of a modern queen size bed with white bedding and wooden frame, clean white background, studio lighting, e-commerce style",
    "armchair": "Professional product photo of a modern green accent armchair, clean white background, studio lighting, e-commerce style",
    "coffee-table": "Professional product photo of a modern wooden coffee table, clean white background, studio lighting, e-commerce style",
    "dining-table": "Professional product photo of a wooden dining table with chairs, clean white background, studio lighting, e-commerce style",
    "dining-chair": "Professional product photo of a wooden dining chair, clean white background, studio lighting, e-commerce style",
    "wardrobe": "Professional product photo of a modern wooden wardrobe closet, clean white background, studio lighting, e-commerce style",
    "nightstand": "Professional product photo of a wooden nightstand bedside table, clean white background, studio lighting, e-commerce style",
    "dresser": "Professional product photo of a wooden dresser with drawers, clean white background, studio lighting, e-commerce style",
    "fridge": "Professional product photo of a stainless steel refrigerator, clean white background, studio lighting, e-commerce style",
    "stove": "Professional product photo of a modern kitchen stove, clean white background, studio lighting, e-commerce style",
    "kitchen-counter": "Professional product photo of a modern kitchen counter cabinet, clean white background, studio lighting, e-commerce style",
    "kitchen-island": "Professional product photo of a modern kitchen island, clean white background, studio lighting, e-commerce style",
    "bathtub": "Professional product photo of a white porcelain bathtub, clean white background, studio lighting, e-commerce style",
    "toilet": "Professional product photo of a modern white toilet, clean white background, studio lighting, e-commerce style",
    "shower": "Professional product photo of a glass shower stall, clean white background, studio lighting, e-commerce style",
    "vanity": "Professional product photo of a modern bathroom vanity sink, clean white background, studio lighting, e-commerce style",
    "desk": "Professional product photo of a modern wooden office desk, clean white background, studio lighting, e-commerce style",
    "office-chair": "Professional product photo of an ergonomic black office chair, clean white background, studio lighting, e-commerce style",
    "bookshelf": "Professional product photo of a tall wooden bookshelf, clean white background, studio lighting, e-commerce style",
    "plant": "Professional product photo of a potted indoor houseplant, clean white background, studio lighting, e-commerce style",
    "floor-lamp": "Professional product photo of a modern floor lamp, clean white background, studio lighting, e-commerce style",
    "tv": "Professional product photo of a wall mounted flat screen TV, clean white background, studio lighting, e-commerce style",
    "patio-set": "Professional product photo of outdoor patio table and chairs, clean white background, studio lighting, e-commerce style",
    "rug": "Professional product photo of a modern area rug, clean white background, studio lighting, e-commerce style",
    "painting": "Professional product photo of framed wall art painting, clean white background, studio lighting, e-commerce style",
    "washer": "Professional product photo of a white washing machine, clean white background, studio lighting, e-commerce style",
    "bar-stool": "Professional product photo of modern bar stools, clean white background, studio lighting, e-commerce style",
    "console-table": "Professional product photo of a modern console table, clean white background, studio lighting, e-commerce style",
    "ottoman": "Professional product photo of a round ottoman pouf, clean white background, studio lighting, e-commerce style",
    "tv-stand": "Professional product photo of a modern TV stand media console, clean white background, studio lighting, e-commerce style",
}

results = {}

for key, prompt in GENERATIONS.items():
    output_path = os.path.join(OUTPUT_DIR, f"{key}.png")
    if os.path.exists(output_path):
        print(f"SKIP (exists): {key}", flush=True)
        results[key] = f"/furniture/{key}.png"
        continue
    print(f"Generating: {key}", flush=True)
    try:
        proc = subprocess.run(
            ["z-ai", "image", "-p", prompt, "-o", output_path, "-s", "1024x1024"],
            capture_output=True, text=True, timeout=120
        )
        if proc.returncode == 0 and os.path.exists(output_path):
            results[key] = f"/furniture/{key}.png"
            print(f"  -> OK: {output_path}", flush=True)
        else:
            print(f"  -> FAILED: {proc.stderr[:100]}", flush=True)
    except subprocess.TimeoutExpired:
        print(f"  -> TIMEOUT", flush=True)
    except Exception as e:
        print(f"  -> ERROR: {e}", flush=True)

# Save mapping
with open("/home/z/my-project/scripts/furniture-image-map.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"\n=== DONE: {len(results)}/{len(GENERATIONS)} images generated ===")
