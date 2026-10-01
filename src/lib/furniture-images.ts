// Maps furniture catalog item IDs to real product image paths.
// Images are generated via z-ai image generation and stored in /public/furniture/.
// If an ID isn't in this map, the SVG fallback preview is used.

const IMAGE_MAP: Record<string, string> = {
  // Living room
  "sofa-3": "/furniture/sofa.png",
  "sofa-2": "/furniture/sofa.png",
  "sofa-l": "/furniture/sofa.png",
  "loveseat": "/furniture/sofa.png",
  "armchair": "/furniture/armchair.png",
  "armchair-accent": "/furniture/armchair.png",
  "ottomoman": "/furniture/ottoman.png",
  "coffee-table": "/furniture/coffee-table.png",
  "coffee-round": "/furniture/coffee-table.png",
  "side-table": "/furniture/coffee-table.png",
  "console-table": "/furniture/console-table.png",
  "tv-stand": "/furniture/tv-stand.png",
  "bookshelf": "/furniture/bookshelf.png",
  "bookshelf-wide": "/furniture/bookshelf.png",
  "fireplace": "/furniture/tv-stand.png",
  "rug-lg": "/furniture/rug.png",
  "rug-med": "/furniture/rug.png",
  "rug-runner": "/furniture/rug.png",

  // Bedroom
  "bed-king": "/furniture/bed.png",
  "bed-queen": "/furniture/bed.png",
  "bed-double": "/furniture/bed.png",
  "bed-single": "/furniture/bed.png",
  "bed-bunk": "/furniture/bed.png",
  "wardrobe": "/furniture/wardrobe.png",
  "wardrobe-120": "/furniture/wardrobe.png",
  "wardrobe-sliding": "/furniture/wardrobe.png",
  "nightstand": "/furniture/nightstand.png",
  "dresser": "/furniture/dresser.png",
  "dresser-tall": "/furniture/dresser.png",
  "vanity": "/furniture/dresser.png",
  "chest": "/furniture/dresser.png",

  // Kitchen
  "fridge": "/furniture/fridge.png",
  "fridge-french": "/furniture/fridge.png",
  "stove": "/furniture/stove.png",
  "oven": "/furniture/stove.png",
  "microwave": "/furniture/stove.png",
  "kitchen-counter": "/furniture/kitchen-counter.png",
  "kitchen-counter-l": "/furniture/kitchen-counter.png",
  "kitchen-island": "/furniture/kitchen-island.png",
  "kitchen-island-2": "/furniture/kitchen-island.png",
  "dining-table": "/furniture/dining-table.png",
  "dining-table-6": "/furniture/dining-table.png",
  "dining-table-round": "/furniture/dining-table.png",
  "dining-chair": "/furniture/dining-chair.png",
  "bar-stool": "/furniture/bar-stool.png",
  "sink": "/furniture/kitchen-counter.png",
  "range-hood": "/furniture/stove.png",
  "pantry": "/furniture/wardrobe.png",

  // Bathroom
  "bathtub": "/furniture/bathtub.png",
  "bathtub-corner": "/furniture/bathtub.png",
  "shower": "/furniture/shower.png",
  "shower-corner": "/furniture/shower.png",
  "toilet": "/furniture/toilet.png",
  "bidet": "/furniture/toilet.png",
  "bath-sink": "/furniture/vanity.png",
  "bath-vanity": "/furniture/vanity.png",
  "bath-vanity-120": "/furniture/vanity.png",
  "mirror": "/furniture/vanity.png",
  "bath-cabinet": "/furniture/wardrobe.png",
  "towel-rack": "/furniture/vanity.png",

  // Office
  "desk": "/furniture/desk.png",
  "desk-160": "/furniture/desk.png",
  "desk-corner": "/furniture/desk.png",
  "office-chair": "/furniture/office-chair.png",
  "office-chair-ergo": "/furniture/office-chair.png",
  "filing-cabinet": "/furniture/bookshelf.png",
  "bookcase-tall": "/furniture/bookshelf.png",
  "conference-table": "/furniture/dining-table.png",
  "whiteboard": "/furniture/desk.png",
  "cabinet-storage": "/furniture/wardrobe.png",

  // Outdoor
  "patio-table": "/furniture/patio-set.png",
  "patio-table-round": "/furniture/patio-set.png",
  "patio-chair": "/furniture/patio-set.png",
  "lounge-chair": "/furniture/patio-set.png",
  "lounge-set": "/furniture/patio-set.png",
  "hammock": "/furniture/patio-set.png",
  "bbq-grill": "/furniture/stove.png",
  "outdoor-umbrella": "/furniture/rug.png",
  "outdoor-bench": "/furniture/patio-set.png",
  "plant-lg": "/furniture/plant.png",
  "plant-tree": "/furniture/plant.png",
  "planter-box": "/furniture/plant.png",

  // Decor
  "plant-sm": "/furniture/plant.png",
  "plant-med": "/furniture/plant.png",
  "plant-tall": "/furniture/plant.png",
  "vase": "/furniture/plant.png",
  "painting": "/furniture/painting.png",
  "painting-lg": "/furniture/painting.png",
  "wall-clock": "/furniture/painting.png",
  "sculpture": "/furniture/plant.png",
  "candle-set": "/furniture/plant.png",
  "books-stack": "/furniture/bookshelf.png",

  // Lighting
  "lamp-floor": "/furniture/floor-lamp.png",
  "lamp-arc": "/furniture/floor-lamp.png",
  "lamp-table": "/furniture/floor-lamp.png",
  "lamp-desk": "/furniture/floor-lamp.png",
  "chandelier": "/furniture/floor-lamp.png",
  "pendant": "/furniture/floor-lamp.png",
  "wall-sconce": "/furniture/floor-lamp.png",
  "ceiling-light": "/furniture/floor-lamp.png",
  "track-light": "/furniture/floor-lamp.png",

  // Appliances
  "washer": "/furniture/washer.png",
  "dryer": "/furniture/washer.png",
  "dishwasher": "/furniture/washer.png",
  "ac-unit": "/furniture/washer.png",
  "heater": "/furniture/washer.png",
  "water-heater": "/furniture/washer.png",
  "ironing-board": "/furniture/washer.png",
  "vacuum": "/furniture/washer.png",

  // Electronics
  "tv": "/furniture/tv.png",
  "tv-55": "/furniture/tv.png",
  "tv-65": "/furniture/tv.png",
  "tv-75": "/furniture/tv.png",
  "sound-system": "/furniture/tv.png",
  "speaker": "/furniture/tv.png",
  "game-console": "/furniture/tv.png",
  "desktop-pc": "/furniture/desk.png",
  "monitor": "/furniture/tv.png",

  // Storage
  "shoe-rack": "/furniture/wardrobe.png",
  "coat-rack": "/furniture/wardrobe.png",
  "storage-box": "/furniture/wardrobe.png",
  "cabinet-wall": "/furniture/wardrobe.png",
  "drawer-cart": "/furniture/wardrobe.png",
  "wine-rack": "/furniture/wardrobe.png",
  "sideboard": "/furniture/wardrobe.png",
  "buffet": "/furniture/wardrobe.png",

  // Textiles
  "rug-round": "/furniture/rug.png",
  "rug-shag": "/furniture/rug.png",
  "curtain": "/furniture/rug.png",
  "blanket": "/furniture/rug.png",
  "cushion": "/furniture/ottoman.png",
  "carpet-wall": "/furniture/rug.png",

  // Kids
  "crib": "/furniture/bed.png",
  "kids-bed": "/furniture/bed.png",
  "toy-box": "/furniture/wardrobe.png",
  "kids-desk": "/furniture/desk.png",
  "kids-chair": "/furniture/dining-chair.png",
  "play-mat": "/furniture/rug.png",

  // Hallway
  "console-hall": "/furniture/console-table.png",
  "mirror-hall": "/furniture/vanity.png",
  "bench-hall": "/furniture/patio-set.png",
  "umbrella-stand": "/furniture/plant.png",
  "key-cabinet": "/furniture/wardrobe.png",
};

/**
 * Get the real product image URL for a furniture item, if available.
 * Returns undefined if no image is available (caller should use SVG fallback).
 */
export function getFurnitureImage(furnitureId: string): string | undefined {
  return IMAGE_MAP[furnitureId];
}
