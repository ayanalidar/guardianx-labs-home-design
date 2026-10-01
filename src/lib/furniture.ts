// Furniture catalog for the home design planner
// All dimensions are in centimeters (cm)

export type FurnitureCategory =
  | "living"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "office"
  | "outdoor"
  | "decor"
  | "lighting"
  | "appliances"
  | "electronics"
  | "storage"
  | "textiles"
  | "kids"
  | "hallway";

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  width: number; // X in cm
  depth: number; // Y in cm
  height: number; // Z in cm
  color: string;
  icon: string; // short label for 2D top-down
  tags?: string[];
  // Optional 3D shape hint
  shape?: "box" | "cylinder" | "sphere" | "plant" | "lamp" | "tv" | "toilet" | "bathtub" | "sink" | "rug" | "shelf" | "bed" | "sofa" | "chair" | "table" | "counter" | "fridge" | "stove" | "washing" | "toilet2";
}

export const FURNITURE_CATALOG: FurnitureItem[] = [
  // ============ LIVING ROOM ============
  { id: "sofa-3", name: "3-Seat Sofa", category: "living", width: 220, depth: 95, height: 85, color: "#6B7FD7", icon: "S", shape: "sofa", tags: ["sofa", "couch", "seating"] },
  { id: "sofa-2", name: "2-Seat Sofa", category: "living", width: 160, depth: 95, height: 85, color: "#6B7FD7", icon: "S", shape: "sofa", tags: ["sofa", "couch"] },
  { id: "sofa-l", name: "L-Sectional Sofa", category: "living", width: 280, depth: 200, height: 85, color: "#5C6BC0", icon: "LS", shape: "sofa", tags: ["sofa", "sectional"] },
  { id: "armchair", name: "Armchair", category: "living", width: 90, depth: 95, height: 85, color: "#8B9E5B", icon: "A", shape: "chair", tags: ["chair"] },
  { id: "armchair-accent", name: "Accent Chair", category: "living", width: 75, depth: 80, height: 80, color: "#C97B5A", icon: "A", shape: "chair", tags: ["chair"] },
  { id: "loveseat", name: "Loveseat", category: "living", width: 130, depth: 90, height: 85, color: "#7E57C2", icon: "LV", shape: "sofa", tags: ["sofa"] },
  { id: "ottomoman", name: "Ottoman", category: "living", width: 60, depth: 60, height: 45, color: "#A1887F", icon: "O", shape: "box", tags: ["stool"] },
  { id: "coffee-table", name: "Coffee Table", category: "living", width: 120, depth: 60, height: 45, color: "#A0744E", icon: "T", shape: "table", tags: ["table"] },
  { id: "coffee-round", name: "Round Coffee Table", category: "living", width: 90, depth: 90, height: 45, color: "#8B6F47", icon: "T", shape: "table", tags: ["table"] },
  { id: "side-table", name: "Side Table", category: "living", width: 45, depth: 45, height: 55, color: "#A0744E", icon: "ST", shape: "table", tags: ["table"] },
  { id: "tv-stand", name: "TV Stand", category: "living", width: 180, depth: 40, height: 50, color: "#5C5C5C", icon: "TV", shape: "box", tags: ["tv", "media"] },
  { id: "bookshelf", name: "Bookshelf", category: "living", width: 90, depth: 35, height: 200, color: "#8B6F47", icon: "B", shape: "shelf", tags: ["shelf"] },
  { id: "bookshelf-wide", name: "Wide Bookshelf", category: "living", width: 160, depth: 35, height: 200, color: "#8B6F47", icon: "B", shape: "shelf", tags: ["shelf"] },
  { id: "fireplace", name: "Fireplace", category: "living", width: 120, depth: 40, height: 110, color: "#5D4037", icon: "FP", shape: "box", tags: ["fireplace"] },
  { id: "rug-lg", name: "Large Rug 240×170", category: "living", width: 240, depth: 170, height: 2, color: "#C97B5A", icon: "R", shape: "rug", tags: ["rug"] },
  { id: "rug-med", name: "Medium Rug 200×140", category: "living", width: 200, depth: 140, height: 2, color: "#C97B5A", icon: "R", shape: "rug", tags: ["rug"] },
  { id: "rug-runner", name: "Runner Rug", category: "living", width: 70, depth: 240, height: 2, color: "#B5651D", icon: "R", shape: "rug", tags: ["rug"] },
  { id: "console-table", name: "Console Table", category: "living", width: 120, depth: 35, height: 80, color: "#A0744E", icon: "CT", shape: "table", tags: ["table"] },

  // ============ BEDROOM ============
  { id: "bed-king", name: "King Bed", category: "bedroom", width: 200, depth: 200, height: 60, color: "#D4A5A5", icon: "KB", shape: "bed", tags: ["bed"] },
  { id: "bed-queen", name: "Queen Bed", category: "bedroom", width: 160, depth: 200, height: 60, color: "#D4A5A5", icon: "QB", shape: "bed", tags: ["bed"] },
  { id: "bed-double", name: "Double Bed", category: "bedroom", width: 140, depth: 200, height: 60, color: "#D4A5A5", icon: "DB", shape: "bed", tags: ["bed"] },
  { id: "bed-single", name: "Single Bed", category: "bedroom", width: 100, depth: 200, height: 60, color: "#D4A5A5", icon: "SB", shape: "bed", tags: ["bed"] },
  { id: "bed-bunk", name: "Bunk Bed", category: "bedroom", width: 100, depth: 200, height: 180, color: "#8B6F47", icon: "BB", shape: "bed", tags: ["bed"] },
  { id: "wardrobe", name: "Wardrobe 180", category: "bedroom", width: 180, depth: 60, height: 210, color: "#8B6F47", icon: "W", shape: "wardrobe", tags: ["closet"] },
  { id: "wardrobe-120", name: "Wardrobe 120", category: "bedroom", width: 120, depth: 60, height: 210, color: "#8B6F47", icon: "W", shape: "wardrobe", tags: ["closet"] },
  { id: "wardrobe-sliding", name: "Sliding Wardrobe", category: "bedroom", width: 240, depth: 65, height: 220, color: "#6D4C41", icon: "SW", shape: "wardrobe", tags: ["closet"] },
  { id: "nightstand", name: "Nightstand", category: "bedroom", width: 50, depth: 40, height: 55, color: "#A0744E", icon: "N", shape: "box", tags: ["drawer"] },
  { id: "dresser", name: "Dresser", category: "bedroom", width: 120, depth: 50, height: 90, color: "#8B6F47", icon: "D", shape: "box", tags: ["drawer"] },
  { id: "dresser-tall", name: "Tall Dresser", category: "bedroom", width: 50, depth: 50, height: 130, color: "#8B6F47", icon: "TD", shape: "box", tags: ["drawer"] },
  { id: "vanity", name: "Vanity Table", category: "bedroom", width: 110, depth: 50, height: 75, color: "#A0744E", icon: "V", shape: "table", tags: ["vanity"] },
  { id: "chest", name: "Storage Chest", category: "bedroom", width: 100, depth: 50, height: 55, color: "#6D4C41", icon: "CH", shape: "box", tags: ["storage"] },

  // ============ KITCHEN ============
  { id: "fridge", name: "Refrigerator", category: "kitchen", width: 80, depth: 70, height: 190, color: "#E5E5E5", icon: "F", shape: "fridge", tags: ["appliance"] },
  { id: "fridge-french", name: "French Door Fridge", category: "kitchen", width: 90, depth: 75, height: 180, color: "#F5F5F5", icon: "F", shape: "fridge", tags: ["appliance"] },
  { id: "stove", name: "Stove", category: "kitchen", width: 75, depth: 65, height: 90, color: "#4A4A4A", icon: "ST", shape: "stove", tags: ["appliance"] },
  { id: "oven", name: "Wall Oven", category: "kitchen", width: 75, depth: 60, height: 75, color: "#3A3A3A", icon: "OV", shape: "box", tags: ["appliance"] },
  { id: "microwave", name: "Microwave", category: "kitchen", width: 55, depth: 40, height: 35, color: "#2C2C2C", icon: "MW", shape: "box", tags: ["appliance"] },
  { id: "kitchen-counter", name: "Kitchen Counter", category: "kitchen", width: 120, depth: 65, height: 90, color: "#C9B79C", icon: "KC", shape: "counter", tags: ["counter"] },
  { id: "kitchen-counter-l", name: "L-Counter Section", category: "kitchen", width: 200, depth: 65, height: 90, color: "#C9B79C", icon: "KC", shape: "counter", tags: ["counter"] },
  { id: "kitchen-island", name: "Kitchen Island", category: "kitchen", width: 180, depth: 90, height: 90, color: "#C9B79C", icon: "KI", shape: "counter", tags: ["counter"] },
  { id: "kitchen-island-2", name: "Large Island", category: "kitchen", width: 240, depth: 100, height: 90, color: "#B5A07D", icon: "KI", shape: "counter", tags: ["counter"] },
  { id: "dining-table", name: "Dining Table 180", category: "kitchen", width: 180, depth: 90, height: 75, color: "#A0744E", icon: "DT", shape: "table", tags: ["table"] },
  { id: "dining-table-6", name: "Dining Table 200", category: "kitchen", width: 200, depth: 100, height: 75, color: "#A0744E", icon: "DT", shape: "table", tags: ["table"] },
  { id: "dining-table-round", name: "Round Dining 120", category: "kitchen", width: 120, depth: 120, height: 75, color: "#8B6F47", icon: "DT", shape: "table", tags: ["table"] },
  { id: "dining-chair", name: "Dining Chair", category: "kitchen", width: 50, depth: 55, height: 90, color: "#6B5436", icon: "DC", shape: "chair", tags: ["chair"] },
  { id: "bar-stool", name: "Bar Stool", category: "kitchen", width: 40, depth: 40, height: 75, color: "#2C2C2C", icon: "BS", shape: "chair", tags: ["stool"] },
  { id: "sink", name: "Kitchen Sink", category: "kitchen", width: 80, depth: 55, height: 85, color: "#B8C5D6", icon: "SK", shape: "sink", tags: ["sink"] },
  { id: "range-hood", name: "Range Hood", category: "kitchen", width: 90, depth: 50, height: 50, color: "#5C5C5C", icon: "RH", shape: "box", tags: ["hood"] },
  { id: "pantry", name: "Pantry Cabinet", category: "kitchen", width: 60, depth: 60, height: 210, color: "#8B6F47", icon: "P", shape: "box", tags: ["cabinet"] },

  // ============ BATHROOM ============
  { id: "bathtub", name: "Bathtub", category: "bathroom", width: 170, depth: 75, height: 55, color: "#F5F5F5", icon: "BT", shape: "bathtub", tags: ["tub"] },
  { id: "bathtub-corner", name: "Corner Bathtub", category: "bathroom", width: 140, depth: 140, height: 55, color: "#F5F5F5", icon: "BT", shape: "bathtub", tags: ["tub"] },
  { id: "shower", name: "Shower Stall", category: "bathroom", width: 90, depth: 90, height: 200, color: "#D6E5F5", icon: "SH", shape: "box", tags: ["shower"] },
  { id: "shower-corner", name: "Corner Shower", category: "bathroom", width: 120, depth: 120, height: 200, color: "#D6E5F5", icon: "SH", shape: "box", tags: ["shower"] },
  { id: "toilet", name: "Toilet", category: "bathroom", width: 40, depth: 65, height: 80, color: "#FFFFFF", icon: "WC", shape: "toilet", tags: ["toilet"] },
  { id: "bidet", name: "Bidet", category: "bathroom", width: 40, depth: 55, height: 40, color: "#FFFFFF", icon: "BD", shape: "box", tags: ["bidet"] },
  { id: "bath-sink", name: "Bathroom Sink", category: "bathroom", width: 60, depth: 50, height: 85, color: "#F5F5F5", icon: "BS", shape: "sink", tags: ["sink"] },
  { id: "bath-vanity", name: "Vanity Cabinet 90", category: "bathroom", width: 90, depth: 50, height: 85, color: "#8B6F47", icon: "V", shape: "counter", tags: ["cabinet"] },
  { id: "bath-vanity-120", name: "Double Vanity 120", category: "bathroom", width: 120, depth: 50, height: 85, color: "#8B6F47", icon: "V", shape: "counter", tags: ["cabinet"] },
  { id: "mirror", name: "Wall Mirror", category: "bathroom", width: 80, depth: 5, height: 70, color: "#B8C5D6", icon: "M", shape: "box", tags: ["mirror"] },
  { id: "bath-cabinet", name: "Bath Cabinet", category: "bathroom", width: 50, depth: 35, height: 180, color: "#8B6F47", icon: "BC", shape: "box", tags: ["cabinet"] },
  { id: "towel-rack", name: "Towel Rack", category: "bathroom", width: 60, depth: 10, height: 90, color: "#A1887F", icon: "TR", shape: "box", tags: ["rack"] },

  // ============ OFFICE ============
  { id: "desk", name: "Desk 140", category: "office", width: 140, depth: 70, height: 75, color: "#A0744E", icon: "DK", shape: "table", tags: ["desk"] },
  { id: "desk-160", name: "Desk 160", category: "office", width: 160, depth: 75, height: 75, color: "#8B6F47", icon: "DK", shape: "table", tags: ["desk"] },
  { id: "desk-corner", name: "Corner Desk", category: "office", width: 160, depth: 120, height: 75, color: "#5D4037", icon: "DK", shape: "table", tags: ["desk"] },
  { id: "office-chair", name: "Office Chair", category: "office", width: 60, depth: 60, height: 110, color: "#2C2C2C", icon: "OC", shape: "chair", tags: ["chair"] },
  { id: "office-chair-ergo", name: "Ergonomic Chair", category: "office", width: 65, depth: 65, height: 120, color: "#37474F", icon: "OC", shape: "chair", tags: ["chair"] },
  { id: "filing-cabinet", name: "Filing Cabinet", category: "office", width: 50, depth: 60, height: 130, color: "#5C5C5C", icon: "FC", shape: "box", tags: ["cabinet"] },
  { id: "bookcase-tall", name: "Tall Bookcase", category: "office", width: 80, depth: 35, height: 200, color: "#5D4037", icon: "BC", shape: "shelf", tags: ["shelf"] },
  { id: "conference-table", name: "Conference Table", category: "office", width: 200, depth: 100, height: 75, color: "#8B6F47", icon: "CT", shape: "table", tags: ["table"] },
  { id: "whiteboard", name: "Whiteboard", category: "office", width: 120, depth: 5, height: 90, color: "#FAFAFA", icon: "WB", shape: "box", tags: ["board"] },
  { id: "cabinet-storage", name: "Storage Cabinet", category: "office", width: 80, depth: 40, height: 180, color: "#6D4C41", icon: "SC", shape: "box", tags: ["cabinet"] },

  // ============ OUTDOOR ============
  { id: "patio-table", name: "Patio Table 120", category: "outdoor", width: 120, depth: 120, height: 75, color: "#6B5436", icon: "PT", shape: "table", tags: ["table"] },
  { id: "patio-table-round", name: "Round Patio Table", category: "outdoor", width: 100, depth: 100, height: 75, color: "#5D4037", icon: "PT", shape: "table", tags: ["table"] },
  { id: "patio-chair", name: "Patio Chair", category: "outdoor", width: 55, depth: 55, height: 90, color: "#5C5C5C", icon: "PC", shape: "chair", tags: ["chair"] },
  { id: "lounge-chair", name: "Lounge Chair", category: "outdoor", width: 70, depth: 180, height: 45, color: "#C97B5A", icon: "LC", shape: "chair", tags: ["chair"] },
  { id: "lounge-set", name: "Lounge Set", category: "outdoor", width: 200, depth: 90, height: 80, color: "#6D4C41", icon: "LS", shape: "sofa", tags: ["sofa"] },
  { id: "hammock", name: "Hammock", category: "outdoor", width: 100, depth: 250, height: 60, color: "#8B9E5B", icon: "HM", shape: "box", tags: ["hammock"] },
  { id: "bbq-grill", name: "BBQ Grill", category: "outdoor", width: 120, depth: 60, height: 110, color: "#2C2C2C", icon: "BBQ", shape: "box", tags: ["grill"] },
  { id: "outdoor-umbrella", name: "Patio Umbrella", category: "outdoor", width: 250, depth: 250, height: 220, color: "#C97B5A", icon: "UM", shape: "box", tags: ["umbrella"] },
  { id: "outdoor-bench", name: "Garden Bench", category: "outdoor", width: 140, depth: 50, height: 85, color: "#5D4037", icon: "BN", shape: "sofa", tags: ["bench"] },
  { id: "plant-lg", name: "Large Plant", category: "outdoor", width: 50, depth: 50, height: 150, color: "#5B8C5A", icon: "P", shape: "plant", tags: ["plant"] },
  { id: "plant-tree", name: "Small Tree", category: "outdoor", width: 80, depth: 80, height: 220, color: "#33691E", icon: "T", shape: "plant", tags: ["plant"] },
  { id: "planter-box", name: "Planter Box", category: "outdoor", width: 80, depth: 35, height: 45, color: "#6D4C41", icon: "PB", shape: "box", tags: ["planter"] },

  // ============ DECOR ============
  { id: "plant-sm", name: "Small Plant", category: "decor", width: 35, depth: 35, height: 60, color: "#5B8C5A", icon: "P", shape: "plant", tags: ["plant"] },
  { id: "plant-med", name: "Medium Plant", category: "decor", width: 45, depth: 45, height: 110, color: "#5B8C5A", icon: "P", shape: "plant", tags: ["plant"] },
  { id: "plant-tall", name: "Floor Plant", category: "decor", width: 50, depth: 50, height: 170, color: "#558B2F", icon: "P", shape: "plant", tags: ["plant"] },
  { id: "vase", name: "Vase", category: "decor", width: 25, depth: 25, height: 50, color: "#9E9E9E", icon: "V", shape: "cylinder", tags: ["vase"] },
  { id: "painting", name: "Painting", category: "decor", width: 80, depth: 5, height: 60, color: "#C97B5A", icon: "AR", shape: "box", tags: ["art"] },
  { id: "painting-lg", name: "Large Painting", category: "decor", width: 120, depth: 5, height: 90, color: "#5C6BC0", icon: "AR", shape: "box", tags: ["art"] },
  { id: "wall-clock", name: "Wall Clock", category: "decor", width: 40, depth: 5, height: 40, color: "#37474F", icon: "CL", shape: "box", tags: ["clock"] },
  { id: "sculpture", name: "Sculpture", category: "decor", width: 40, depth: 40, height: 120, color: "#8B6F47", icon: "SC", shape: "cylinder", tags: ["art"] },
  { id: "candle-set", name: "Candle Set", category: "decor", width: 25, depth: 25, height: 20, color: "#FFB74D", icon: "CA", shape: "box", tags: ["candle"] },
  { id: "books-stack", name: "Books Stack", category: "decor", width: 30, depth: 25, height: 30, color: "#A1887F", icon: "BK", shape: "box", tags: ["books"] },

  // ============ LIGHTING ============
  { id: "lamp-floor", name: "Floor Lamp", category: "lighting", width: 40, depth: 40, height: 160, color: "#E5C07B", icon: "L", shape: "lamp", tags: ["lamp"] },
  { id: "lamp-arc", name: "Arc Floor Lamp", category: "lighting", width: 100, depth: 100, height: 180, color: "#E5C07B", icon: "AL", shape: "lamp", tags: ["lamp"] },
  { id: "lamp-table", name: "Table Lamp", category: "lighting", width: 30, depth: 30, height: 50, color: "#E5C07B", icon: "L", shape: "lamp", tags: ["lamp"] },
  { id: "lamp-desk", name: "Desk Lamp", category: "lighting", width: 25, depth: 25, height: 45, color: "#FFB74D", icon: "DL", shape: "lamp", tags: ["lamp"] },
  { id: "chandelier", name: "Chandelier", category: "lighting", width: 80, depth: 80, height: 60, color: "#FFD54F", icon: "CH", shape: "lamp", tags: ["chandelier"] },
  { id: "pendant", name: "Pendant Light", category: "lighting", width: 35, depth: 35, height: 40, color: "#FFB74D", icon: "PL", shape: "lamp", tags: ["pendant"] },
  { id: "wall-sconce", name: "Wall Sconce", category: "lighting", width: 25, depth: 15, height: 40, color: "#FFC107", icon: "WS", shape: "box", tags: ["sconce"] },
  { id: "ceiling-light", name: "Ceiling Light", category: "lighting", width: 50, depth: 50, height: 20, color: "#FFF8E1", icon: "CL", shape: "box", tags: ["ceiling"] },
  { id: "track-light", name: "Track Light", category: "lighting", width: 120, depth: 15, height: 15, color: "#FFC107", icon: "TL", shape: "box", tags: ["track"] },

  // ============ APPLIANCES ============
  { id: "washer", name: "Washing Machine", category: "appliances", width: 60, depth: 60, height: 90, color: "#E5E5E5", icon: "WA", shape: "washing", tags: ["laundry"] },
  { id: "dryer", name: "Dryer", category: "appliances", width: 60, depth: 60, height: 90, color: "#E5E5E5", icon: "DR", shape: "washing", tags: ["laundry"] },
  { id: "dishwasher", name: "Dishwasher", category: "appliances", width: 60, depth: 60, height: 90, color: "#5C5C5C", icon: "DW", shape: "box", tags: ["appliance"] },
  { id: "ac-unit", name: "AC Unit", category: "appliances", width: 90, depth: 25, height: 30, color: "#E5E5E5", icon: "AC", shape: "box", tags: ["ac"] },
  { id: "heater", name: "Wall Heater", category: "appliances", width: 60, depth: 15, height: 50, color: "#5C5C5C", icon: "HT", shape: "box", tags: ["heater"] },
  { id: "water-heater", name: "Water Heater", category: "appliances", width: 50, depth: 50, height: 150, color: "#E5E5E5", icon: "WH", shape: "cylinder", tags: ["heater"] },
  { id: "ironing-board", name: "Ironing Board", category: "appliances", width: 130, depth: 40, height: 15, color: "#A1887F", icon: "IB", shape: "box", tags: ["laundry"] },
  { id: "vacuum", name: "Vacuum Cleaner", category: "appliances", width: 30, depth: 30, height: 100, color: "#37474F", icon: "VC", shape: "box", tags: ["cleaning"] },

  // ============ ELECTRONICS ============
  { id: "tv", name: "Television", category: "electronics", width: 120, depth: 10, height: 70, color: "#1A1A1A", icon: "TV", shape: "tv", tags: ["tv"] },
  { id: "tv-55", name: 'TV 55"', category: "electronics", width: 130, depth: 10, height: 75, color: "#1A1A1A", icon: "TV", shape: "tv", tags: ["tv"] },
  { id: "tv-65", name: 'TV 65"', category: "electronics", width: 150, depth: 10, height: 85, color: "#1A1A1A", icon: "TV", shape: "tv", tags: ["tv"] },
  { id: "tv-75", name: 'TV 75"', category: "electronics", width: 170, depth: 10, height: 95, color: "#1A1A1A", icon: "TV", shape: "tv", tags: ["tv"] },
  { id: "sound-system", name: "Sound System", category: "electronics", width: 90, depth: 25, height: 30, color: "#2C2C2C", icon: "SS", shape: "box", tags: ["audio"] },
  { id: "speaker", name: "Floor Speaker", category: "electronics", width: 30, depth: 30, height: 110, color: "#1A1A1A", icon: "SP", shape: "box", tags: ["audio"] },
  { id: "game-console", name: "Game Console", category: "electronics", width: 35, depth: 25, height: 10, color: "#2C2C2C", icon: "GC", shape: "box", tags: ["gaming"] },
  { id: "desktop-pc", name: "Desktop PC", category: "electronics", width: 45, depth: 50, height: 35, color: "#2C2C2C", icon: "PC", shape: "box", tags: ["computer"] },
  { id: "monitor", name: "Monitor 27\"", category: "electronics", width: 60, depth: 20, height: 40, color: "#1A1A1A", icon: "MN", shape: "box", tags: ["monitor"] },

  // ============ STORAGE ============
  { id: "shoe-rack", name: "Shoe Rack", category: "storage", width: 80, depth: 30, height: 90, color: "#8B6F47", icon: "SR", shape: "shelf", tags: ["shoes"] },
  { id: "coat-rack", name: "Coat Rack", category: "storage", width: 40, depth: 40, height: 180, color: "#5D4037", icon: "CR", shape: "box", tags: ["rack"] },
  { id: "storage-box", name: "Storage Box", category: "storage", width: 60, depth: 40, height: 40, color: "#8B6F47", icon: "SB", shape: "box", tags: ["storage"] },
  { id: "cabinet-wall", name: "Wall Cabinet", category: "storage", width: 80, depth: 35, height: 70, color: "#8B6F47", icon: "WC", shape: "box", tags: ["cabinet"] },
  { id: "drawer-cart", name: "Drawer Cart", category: "storage", width: 40, depth: 50, height: 75, color: "#6D4C41", icon: "DC", shape: "box", tags: ["drawer"] },
  { id: "wine-rack", name: "Wine Rack", category: "storage", width: 50, depth: 30, height: 90, color: "#5D4037", icon: "WR", shape: "box", tags: ["wine"] },
  { id: "sideboard", name: "Sideboard", category: "storage", width: 160, depth: 45, height: 75, color: "#8B6F47", icon: "SB", shape: "box", tags: ["cabinet"] },
  { id: "buffet", name: "Buffet", category: "storage", width: 180, depth: 50, height: 85, color: "#6D4C41", icon: "BF", shape: "box", tags: ["cabinet"] },

  // ============ TEXTILES ============
  { id: "rug-round", name: "Round Rug", category: "textiles", width: 150, depth: 150, height: 2, color: "#C97B5A", icon: "R", shape: "rug", tags: ["rug"] },
  { id: "rug-shag", name: "Shag Rug", category: "textiles", width: 160, depth: 230, height: 4, color: "#8B6F47", icon: "R", shape: "rug", tags: ["rug"] },
  { id: "curtain", name: "Curtains", category: "textiles", width: 120, depth: 5, height: 250, color: "#E5C07B", icon: "CN", shape: "box", tags: ["curtain"] },
  { id: "blanket", name: "Throw Blanket", category: "textiles", width: 130, depth: 160, height: 2, color: "#7E57C2", icon: "BL", shape: "rug", tags: ["blanket"] },
  { id: "cushion", name: "Cushion", category: "textiles", width: 40, depth: 40, height: 12, color: "#C97B5A", icon: "CU", shape: "box", tags: ["pillow"] },
  { id: "carpet-wall", name: "Wall-to-wall Carpet", category: "textiles", width: 300, depth: 300, height: 1, color: "#8B6F47", icon: "CP", shape: "rug", tags: ["carpet"] },

  // ============ KIDS ============
  { id: "crib", name: "Baby Crib", category: "kids", width: 70, depth: 130, height: 90, color: "#A1887F", icon: "CB", shape: "bed", tags: ["crib"] },
  { id: "kids-bed", name: "Kids Bed", category: "kids", width: 90, depth: 190, height: 50, color: "#FFB74D", icon: "KB", shape: "bed", tags: ["bed"] },
  { id: "toy-box", name: "Toy Box", category: "kids", width: 80, depth: 45, height: 50, color: "#7E57C2", icon: "TB", shape: "box", tags: ["storage"] },
  { id: "kids-desk", name: "Kids Desk", category: "kids", width: 100, depth: 50, height: 60, color: "#FFB74D", icon: "KD", shape: "table", tags: ["desk"] },
  { id: "kids-chair", name: "Kids Chair", category: "kids", width: 40, depth: 40, height: 50, color: "#7E57C2", icon: "KC", shape: "chair", tags: ["chair"] },
  { id: "play-mat", name: "Play Mat", category: "kids", width: 150, depth: 150, height: 1, color: "#7E57C2", icon: "PM", shape: "rug", tags: ["mat"] },

  // ============ HALLWAY ============
  { id: "console-hall", name: "Hall Console", category: "hallway", width: 100, depth: 30, height: 80, color: "#A0744E", icon: "HC", shape: "table", tags: ["table"] },
  { id: "mirror-hall", name: "Hall Mirror", category: "hallway", width: 70, depth: 5, height: 100, color: "#B8C5D6", icon: "M", shape: "box", tags: ["mirror"] },
  { id: "bench-hall", name: "Hall Bench", category: "hallway", width: 120, depth: 40, height: 45, color: "#5D4037", icon: "BN", shape: "box", tags: ["bench"] },
  { id: "umbrella-stand", name: "Umbrella Stand", category: "hallway", width: 25, depth: 25, height: 50, color: "#37474F", icon: "US", shape: "cylinder", tags: ["stand"] },
  { id: "key-cabinet", name: "Key Cabinet", category: "hallway", width: 35, depth: 15, height: 30, color: "#8B6F47", icon: "KC", shape: "box", tags: ["cabinet"] },
];

export const CATEGORY_LABELS: Record<FurnitureCategory, string> = {
  living: "Living Room",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  office: "Office",
  outdoor: "Outdoor",
  decor: "Decor",
  lighting: "Lighting",
  appliances: "Appliances",
  electronics: "Electronics",
  storage: "Storage",
  textiles: "Textiles",
  kids: "Kids Room",
  hallway: "Hallway",
};

export const CATEGORY_ICONS: Record<FurnitureCategory, string> = {
  living: "🛋️",
  bedroom: "🛏️",
  kitchen: "🍳",
  bathroom: "🚿",
  office: "💼",
  outdoor: "🌿",
  decor: "🎨",
  lighting: "💡",
  appliances: "🔌",
  electronics: "📺",
  storage: "📦",
  textiles: "🧶",
  kids: "🧸",
  hallway: "🚪",
};

export function getFurnitureById(id: string): FurnitureItem | undefined {
  return FURNITURE_CATALOG.find((f) => f.id === id);
}

// Canvas scale: 1 cm = 0.5 px. Adjustable via zoom.
export const BASE_SCALE = 0.5;
