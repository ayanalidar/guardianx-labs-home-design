// Furniture catalog for the home design planner
// All dimensions are in centimeters (cm) - converted to canvas pixels at render time

export type FurnitureCategory =
  | "living"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "office"
  | "outdoor"
  | "decor";

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  width: number; // X dimension in cm
  depth: number; // Y dimension in cm
  height: number; // Z dimension in cm (for 3D)
  color: string; // base color
  icon: string; // emoji or short label for 2D top-down view
  tags?: string[];
}

export const FURNITURE_CATALOG: FurnitureItem[] = [
  // Living Room
  { id: "sofa-3", name: "3-Seat Sofa", category: "living", width: 220, depth: 95, height: 85, color: "#6B7FD7", icon: "S", tags: ["sofa", "couch"] },
  { id: "sofa-2", name: "2-Seat Sofa", category: "living", width: 160, depth: 95, height: 85, color: "#6B7FD7", icon: "S", tags: ["sofa", "couch"] },
  { id: "armchair", name: "Armchair", category: "living", width: 90, depth: 95, height: 85, color: "#8B9E5B", icon: "A", tags: ["chair"] },
  { id: "coffee-table", name: "Coffee Table", category: "living", width: 120, depth: 60, height: 45, color: "#A0744E", icon: "T", tags: ["table"] },
  { id: "tv-stand", name: "TV Stand", category: "living", width: 180, depth: 40, height: 50, color: "#5C5C5C", icon: "TV", tags: ["tv", "media"] },
  { id: "bookshelf", name: "Bookshelf", category: "living", width: 90, depth: 35, height: 200, color: "#8B6F47", icon: "B", tags: ["shelf"] },
  { id: "rug-lg", name: "Large Rug", category: "living", width: 240, depth: 170, height: 2, color: "#C97B5A", icon: "R", tags: ["rug"] },

  // Bedroom
  { id: "bed-king", name: "King Bed", category: "bedroom", width: 200, depth: 200, height: 60, color: "#D4A5A5", icon: "KB", tags: ["bed"] },
  { id: "bed-queen", name: "Queen Bed", category: "bedroom", width: 160, depth: 200, height: 60, color: "#D4A5A5", icon: "QB", tags: ["bed"] },
  { id: "bed-single", name: "Single Bed", category: "bedroom", width: 100, depth: 200, height: 60, color: "#D4A5A5", icon: "SB", tags: ["bed"] },
  { id: "wardrobe", name: "Wardrobe", category: "bedroom", width: 180, depth: 60, height: 210, color: "#8B6F47", icon: "W", tags: ["closet"] },
  { id: "nightstand", name: "Nightstand", category: "bedroom", width: 50, depth: 40, height: 55, color: "#A0744E", icon: "N", tags: ["drawer"] },
  { id: "dresser", name: "Dresser", category: "bedroom", width: 120, depth: 50, height: 90, color: "#8B6F47", icon: "D", tags: ["drawer"] },

  // Kitchen
  { id: "fridge", name: "Refrigerator", category: "kitchen", width: 80, depth: 70, height: 190, color: "#E5E5E5", icon: "F", tags: ["appliance"] },
  { id: "stove", name: "Stove", category: "kitchen", width: 75, depth: 65, height: 90, color: "#4A4A4A", icon: "ST", tags: ["appliance"] },
  { id: "kitchen-counter", name: "Kitchen Counter", category: "kitchen", width: 120, depth: 65, height: 90, color: "#C9B79C", icon: "KC", tags: ["counter"] },
  { id: "kitchen-island", name: "Kitchen Island", category: "kitchen", width: 180, depth: 90, height: 90, color: "#C9B79C", icon: "KI", tags: ["counter"] },
  { id: "dining-table", name: "Dining Table", category: "kitchen", width: 180, depth: 90, height: 75, color: "#A0744E", icon: "DT", tags: ["table"] },
  { id: "dining-chair", name: "Dining Chair", category: "kitchen", width: 50, depth: 55, height: 90, color: "#6B5436", icon: "DC", tags: ["chair"] },
  { id: "sink", name: "Kitchen Sink", category: "kitchen", width: 80, depth: 55, height: 85, color: "#B8C5D6", icon: "SK", tags: ["sink"] },

  // Bathroom
  { id: "bathtub", name: "Bathtub", category: "bathroom", width: 170, depth: 75, height: 55, color: "#F5F5F5", icon: "BT", tags: ["tub"] },
  { id: "shower", name: "Shower", category: "bathroom", width: 90, depth: 90, height: 200, color: "#D6E5F5", icon: "SH", tags: ["shower"] },
  { id: "toilet", name: "Toilet", category: "bathroom", width: 40, depth: 65, height: 80, color: "#FFFFFF", icon: "WC", tags: ["toilet"] },
  { id: "bath-sink", name: "Bathroom Sink", category: "bathroom", width: 60, depth: 50, height: 85, color: "#F5F5F5", icon: "BS", tags: ["sink", "vanity"] },
  { id: "bath-vanity", name: "Vanity Cabinet", category: "bathroom", width: 90, depth: 50, height: 85, color: "#8B6F47", icon: "V", tags: ["cabinet"] },

  // Office
  { id: "desk", name: "Desk", category: "office", width: 140, depth: 70, height: 75, color: "#A0744E", icon: "DK", tags: ["desk"] },
  { id: "office-chair", name: "Office Chair", category: "office", width: 60, depth: 60, height: 110, color: "#2C2C2C", icon: "OC", tags: ["chair"] },
  { id: "filing-cabinet", name: "Filing Cabinet", category: "office", width: 50, depth: 60, height: 130, color: "#5C5C5C", icon: "FC", tags: ["cabinet"] },
  { id: "conference-table", name: "Conference Table", category: "office", width: 200, depth: 100, height: 75, color: "#8B6F47", icon: "CT", tags: ["table"] },

  // Outdoor
  { id: "patio-table", name: "Patio Table", category: "outdoor", width: 120, depth: 120, height: 75, color: "#6B5436", icon: "PT", tags: ["table"] },
  { id: "patio-chair", name: "Patio Chair", category: "outdoor", width: 55, depth: 55, height: 90, color: "#5C5C5C", icon: "PC", tags: ["chair"] },
  { id: "lounge-chair", name: "Lounge Chair", category: "outdoor", width: 70, depth: 180, height: 45, color: "#C97B5A", icon: "LC", tags: ["chair"] },
  { id: "plant-lg", name: "Large Plant", category: "outdoor", width: 50, depth: 50, height: 150, color: "#5B8C5A", icon: "P", tags: ["plant"] },

  // Decor
  { id: "plant-sm", name: "Small Plant", category: "decor", width: 35, depth: 35, height: 60, color: "#5B8C5A", icon: "P", tags: ["plant"] },
  { id: "lamp-floor", name: "Floor Lamp", category: "decor", width: 40, depth: 40, height: 160, color: "#E5C07B", icon: "L", tags: ["lamp"] },
  { id: "lamp-table", name: "Table Lamp", category: "decor", width: 30, depth: 30, height: 50, color: "#E5C07B", icon: "L", tags: ["lamp"] },
  { id: "tv", name: "Television", category: "decor", width: 120, depth: 10, height: 70, color: "#1A1A1A", icon: "TV", tags: ["tv"] },
  { id: "painting", name: "Painting", category: "decor", width: 80, depth: 5, height: 60, color: "#C97B5A", icon: "AR", tags: ["art"] },
];

export const CATEGORY_LABELS: Record<FurnitureCategory, string> = {
  living: "Living Room",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  office: "Office",
  outdoor: "Outdoor",
  decor: "Decor",
};

export const CATEGORY_ICONS: Record<FurnitureCategory, string> = {
  living: "🛋️",
  bedroom: "🛏️",
  kitchen: "🍳",
  bathroom: "🚿",
  office: "💼",
  outdoor: "🌿",
  decor: "🎨",
};

export function getFurnitureById(id: string): FurnitureItem | undefined {
  return FURNITURE_CATALOG.find((f) => f.id === id);
}

// Canvas scale: 1 cm = 0.5 px (so 100cm = 50px). Adjustable via zoom.
export const BASE_SCALE = 0.5;
