// Room templates — pre-built furnished rooms users can drop in with one click
import { getFurnitureById } from "./furniture";
import type { Wall, PlacedItem } from "@/store/editor-store";

export interface RoomTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  width: number; // cm
  depth: number; // cm
  walls: Array<{ x1: number; y1: number; x2: number; y2: number; type?: "wall" | "door" | "window" }>;
  items: Array<{ furnitureId: string; x: number; y: number; rotation?: number }>;
}

const uid = () => Math.random().toString(36).slice(2, 11);

export function instantiateRoomTemplate(tpl: RoomTemplate, offsetX = 0, offsetY = 0): { walls: Wall[]; items: PlacedItem[] } {
  const walls: Wall[] = tpl.walls.map((w) => ({
    id: uid(),
    x1: w.x1 + offsetX,
    y1: w.y1 + offsetY,
    x2: w.x2 + offsetX,
    y2: w.y2 + offsetY,
    thickness: w.type === "wall" ? 15 : 10,
    height: w.type === "wall" ? 270 : 210,
    type: w.type || "wall",
  }));
  // Lazy import to avoid cycle
  const items: PlacedItem[] = tpl.items.map((it) => {
    const f = getFurnitureById(it.furnitureId);
    return {
      id: uid(),
      furnitureId: it.furnitureId,
      x: it.x + offsetX,
      y: it.y + offsetY,
      rotation: it.rotation || 0,
      color: f?.color || "#999",
      width: f?.width || 50,
      depth: f?.depth || 50,
      height: f?.height || 50,
    };
  });
  return { walls, items };
}

export const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    id: "tpl-bedroom",
    name: "Bedroom",
    icon: "🛏️",
    description: "12 m² · Queen bed, wardrobes, nightstands",
    width: 400,
    depth: 350,
    walls: [
      { x1: 0, y1: 0, x2: 400, y2: 0 },
      { x1: 400, y1: 0, x2: 400, y2: 350 },
      { x1: 400, y1: 350, x2: 0, y2: 350, type: "wall" },
      // Door on bottom wall
      { x1: 100, y1: 350, x2: 180, y2: 350, type: "door" },
      // Window on top wall
      { x1: 200, y1: 0, x2: 280, y2: 0, type: "window" },
      { x1: 0, y1: 350, x2: 0, y2: 0 },
    ],
    items: [
      // Queen bed centered-left, head against top wall
      { furnitureId: "bed-queen", x: 200, y: 100, rotation: 0 },
      // Nightstands flanking
      { furnitureId: "nightstand", x: 130, y: 60 },
      { furnitureId: "nightstand", x: 270, y: 60 },
      // Wardrobe on the right wall
      { furnitureId: "wardrobe", x: 350, y: 200, rotation: 90 },
      // Dresser bottom-left
      { furnitureId: "dresser", x: 70, y: 280, rotation: 0 },
      // Plant in corner
      { furnitureId: "plant-tall", x: 50, y: 50 },
      // Floor lamp
      { furnitureId: "lamp-floor", x: 130, y: 200 },
      // Rug under bed
      { furnitureId: "rug-med", x: 200, y: 200 },
    ],
  },
  {
    id: "tpl-living",
    name: "Living Room",
    icon: "🛋️",
    description: "20 m² · Sofa, TV, coffee table, bookshelf",
    width: 500,
    depth: 400,
    walls: [
      { x1: 0, y1: 0, x2: 500, y2: 0 },
      { x1: 500, y1: 0, x2: 500, y2: 400 },
      { x1: 500, y1: 400, x2: 0, y2: 400 },
      // Door on left wall
      { x1: 0, y1: 300, x2: 0, y2: 220, type: "door" },
      // Window on bottom
      { x1: 150, y1: 400, x2: 350, y2: 400, type: "window" },
      { x1: 0, y1: 400, x2: 0, y2: 0 },
    ],
    items: [
      // 3-seat sofa centered, facing TV
      { furnitureId: "sofa-3", x: 250, y: 280, rotation: 0 },
      // Coffee table in front
      { furnitureId: "coffee-table", x: 250, y: 200, rotation: 0 },
      // Armchairs flanking
      { furnitureId: "armchair", x: 100, y: 250, rotation: 90 },
      { furnitureId: "armchair", x: 400, y: 250, rotation: -90 },
      // TV stand against top wall
      { furnitureId: "tv-stand", x: 250, y: 30, rotation: 0 },
      { furnitureId: "tv-65", x: 250, y: 20, rotation: 0 },
      // Bookshelf on right
      { furnitureId: "bookshelf-wide", x: 470, y: 150, rotation: 90 },
      // Plant corner
      { furnitureId: "plant-lg", x: 50, y: 50 },
      // Floor lamp
      { furnitureId: "lamp-floor", x: 60, y: 350 },
      // Rug
      { furnitureId: "rug-lg", x: 250, y: 240 },
    ],
  },
  {
    id: "tpl-kitchen",
    name: "Kitchen",
    icon: "🍳",
    description: "16 m² · Counters, island, dining set, appliances",
    width: 450,
    depth: 350,
    walls: [
      { x1: 0, y1: 0, x2: 450, y2: 0 },
      { x1: 450, y1: 0, x2: 450, y2: 350 },
      { x1: 450, y1: 350, x2: 0, y2: 350 },
      // Door on bottom
      { x1: 50, y1: 350, x2: 130, y2: 350, type: "door" },
      // Window on right
      { x1: 450, y1: 100, x2: 450, y2: 200, type: "window" },
      { x1: 0, y1: 350, x2: 0, y2: 0 },
    ],
    items: [
      // Counter run along top wall
      { furnitureId: "kitchen-counter-l", x: 100, y: 35, rotation: 0 },
      // Fridge in corner
      { furnitureId: "fridge", x: 30, y: 35, rotation: 0 },
      // Stove on counter
      { furnitureId: "stove", x: 200, y: 35, rotation: 0 },
      // Sink on counter
      { furnitureId: "sink", x: 320, y: 35, rotation: 0 },
      // Island center
      { furnitureId: "kitchen-island", x: 225, y: 180, rotation: 0 },
      // Bar stools
      { furnitureId: "bar-stool", x: 180, y: 260 },
      { furnitureId: "bar-stool", x: 270, y: 260 },
      // Dining set right
      { furnitureId: "dining-table", x: 380, y: 220, rotation: 0 },
      { furnitureId: "dining-chair", x: 380, y: 160 },
      { furnitureId: "dining-chair", x: 380, y: 280 },
      // Range hood
      { furnitureId: "range-hood", x: 200, y: 15 },
    ],
  },
  {
    id: "tpl-bathroom",
    name: "Bathroom",
    icon: "🚿",
    description: "6 m² · Bathtub, shower, toilet, vanity",
    width: 300,
    depth: 220,
    walls: [
      { x1: 0, y1: 0, x2: 300, y2: 0 },
      { x1: 300, y1: 0, x2: 300, y2: 220 },
      { x1: 300, y1: 220, x2: 0, y2: 220 },
      // Door
      { x1: 50, y1: 220, x2: 120, y2: 220, type: "door" },
      // Window top
      { x1: 200, y1: 0, x2: 260, y2: 0, type: "window" },
      { x1: 0, y1: 220, x2: 0, y2: 0 },
    ],
    items: [
      // Bathtub along left wall
      { furnitureId: "bathtub", x: 40, y: 90, rotation: 90 },
      // Shower top-right
      { furnitureId: "shower", x: 250, y: 50, rotation: 0 },
      // Toilet bottom-right
      { furnitureId: "toilet", x: 260, y: 180, rotation: 0 },
      // Vanity sink
      { furnitureId: "bath-vanity", x: 150, y: 30, rotation: 0 },
      // Mirror
      { furnitureId: "mirror", x: 150, y: 5 },
      // Bath cabinet
      { furnitureId: "bath-cabinet", x: 270, y: 110, rotation: 90 },
    ],
  },
  {
    id: "tpl-office",
    name: "Home Office",
    icon: "💼",
    description: "10 m² · Desk, chair, bookcase, filing",
    width: 350,
    depth: 280,
    walls: [
      { x1: 0, y1: 0, x2: 350, y2: 0 },
      { x1: 350, y1: 0, x2: 350, y2: 280 },
      { x1: 350, y1: 280, x2: 0, y2: 280 },
      // Door
      { x1: 0, y1: 100, x2: 0, y2: 180, type: "door" },
      // Window
      { x1: 100, y1: 0, x2: 250, y2: 0, type: "window" },
      { x1: 0, y1: 280, x2: 0, y2: 0 },
    ],
    items: [
      // Desk facing window
      { furnitureId: "desk-160", x: 175, y: 80, rotation: 0 },
      // Office chair
      { furnitureId: "office-chair-ergo", x: 175, y: 140, rotation: 0 },
      // Monitor
      { furnitureId: "monitor", x: 175, y: 70, rotation: 0 },
      // Bookcase on right
      { furnitureId: "bookcase-tall", x: 320, y: 150, rotation: 90 },
      // Filing cabinet
      { furnitureId: "filing-cabinet", x: 320, y: 250, rotation: 90 },
      // Plant
      { furnitureId: "plant-med", x: 30, y: 30 },
      // Floor lamp
      { furnitureId: "lamp-floor", x: 30, y: 250 },
      // Rug
      { furnitureId: "rug-med", x: 175, y: 170 },
    ],
  },
  {
    id: "tpl-dining",
    name: "Dining Room",
    icon: "🍽️",
    description: "16 m² · 6-seat table, sideboard, art",
    width: 400,
    depth: 400,
    walls: [
      { x1: 0, y1: 0, x2: 400, y2: 0 },
      { x1: 400, y1: 0, x2: 400, y2: 400 },
      { x1: 400, y1: 400, x2: 0, y2: 400 },
      // Door
      { x1: 0, y1: 200, x2: 0, y2: 280, type: "door" },
      // Window
      { x1: 100, y1: 0, x2: 300, y2: 0, type: "window" },
      { x1: 0, y1: 400, x2: 0, y2: 0 },
    ],
    items: [
      // Dining table center
      { furnitureId: "dining-table-6", x: 200, y: 200, rotation: 0 },
      // 6 chairs around
      { furnitureId: "dining-chair", x: 200, y: 130, rotation: 0 },
      { furnitureId: "dining-chair", x: 130, y: 200, rotation: 90 },
      { furnitureId: "dining-chair", x: 270, y: 200, rotation: -90 },
      { furnitureId: "dining-chair", x: 200, y: 270, rotation: 180 },
      { furnitureId: "dining-chair", x: 140, y: 140, rotation: 45 },
      { furnitureId: "dining-chair", x: 260, y: 260, rotation: -135 },
      // Sideboard against bottom wall
      { furnitureId: "sideboard", x: 200, y: 370, rotation: 0 },
      // Paintings on walls
      { furnitureId: "painting-lg", x: 50, y: 5, rotation: 0 },
      // Plant
      { furnitureId: "plant-lg", x: 50, y: 350 },
      // Chandelier
      { furnitureId: "chandelier", x: 200, y: 200 },
      // Rug under table
      { furnitureId: "rug-lg", x: 200, y: 200 },
    ],
  },
  {
    id: "tpl-empty-sm",
    name: "Empty Small Room",
    icon: "⬜",
    description: "9 m² · 300×300 cm, just walls",
    width: 300,
    depth: 300,
    walls: [
      { x1: 0, y1: 0, x2: 300, y2: 0 },
      { x1: 300, y1: 0, x2: 300, y2: 300 },
      { x1: 300, y1: 300, x2: 80, y2: 300 },
      { x1: 80, y1: 300, x2: 0, y2: 300, type: "door" },
      { x1: 0, y1: 300, x2: 0, y2: 0 },
    ],
    items: [],
  },
  {
    id: "tpl-empty-md",
    name: "Empty Medium Room",
    icon: "⬜",
    description: "16 m² · 400×400 cm, just walls",
    width: 400,
    depth: 400,
    walls: [
      { x1: 0, y1: 0, x2: 400, y2: 0 },
      { x1: 400, y1: 0, x2: 400, y2: 400 },
      { x1: 400, y1: 400, x2: 100, y2: 400 },
      { x1: 100, y1: 400, x2: 0, y2: 400, type: "door" },
      { x1: 0, y1: 400, x2: 0, y2: 0 },
    ],
    items: [],
  },
  {
    id: "tpl-empty-lg",
    name: "Empty Large Room",
    icon: "⬜",
    description: "25 m² · 500×500 cm, just walls",
    width: 500,
    depth: 500,
    walls: [
      { x1: 0, y1: 0, x2: 500, y2: 0 },
      { x1: 500, y1: 0, x2: 500, y2: 500 },
      { x1: 500, y1: 500, x2: 120, y2: 500 },
      { x1: 120, y1: 500, x2: 0, y2: 500, type: "door" },
      { x1: 0, y1: 500, x2: 0, y2: 0 },
    ],
    items: [],
  },
];
