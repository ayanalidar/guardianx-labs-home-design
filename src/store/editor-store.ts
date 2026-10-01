"use client";

import { create } from "zustand";
import { getFurnitureById } from "@/lib/furniture";

// Types
export type Tool = "select" | "wall" | "door" | "window";

export interface Wall {
  id: string;
  x1: number; // canvas coords in cm
  y1: number;
  x2: number;
  y2: number;
  thickness: number; // cm
  height: number; // cm (for 3D)
  type: "wall" | "door" | "window";
}

export interface PlacedItem {
  id: string;
  furnitureId: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  width: number;
  depth: number;
  height: number;
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  items: PlacedItem[];
}

export interface Project {
  id: string;
  name: string;
  rooms: Room[];
  activeRoomId: string;
  createdAt: number;
  updatedAt: number;
}

export type ViewMode = "2d" | "3d";

interface EditorState {
  project: Project;
  tool: Tool;
  viewMode: ViewMode;
  selectedId: string | null;
  selectedType: "wall" | "item" | null;
  zoom: number;
  panX: number;
  panY: number;
  wallStart: { x: number; y: number } | null;
  history: Project[];
  historyIndex: number;

  setTool: (tool: Tool) => void;
  setViewMode: (mode: ViewMode) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  select: (id: string | null, type: "wall" | "item" | null) => void;

  // Room operations
  activeRoom: () => Room;
  addRoom: (name?: string, walls?: Wall[], items?: PlacedItem[]) => string;
  removeRoom: (id: string) => void;
  setActiveRoom: (id: string) => void;
  renameRoom: (id: string, name: string) => void;
  duplicateRoom: (id: string) => void;

  // Wall operations (on active room)
  addWall: (wall: Omit<Wall, "id">) => void;
  updateWall: (id: string, updates: Partial<Wall>) => void;
  removeWall: (id: string) => void;
  addWallsBulk: (walls: Omit<Wall, "id">[]) => void;

  // Item operations (on active room)
  addItem: (furnitureId: string, x: number, y: number, rotation?: number) => void;
  updateItem: (id: string, updates: Partial<PlacedItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  addItemsBulk: (items: PlacedItem[]) => void;

  setWallStart: (p: { x: number; y: number } | null) => void;

  newProject: () => void;
  loadProject: (p: Project) => void;
  setProjectName: (name: string) => void;
  saveToLocal: () => void;
  loadFromLocal: () => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  clearAll: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 11);

function makeRoom(name: string): Room {
  return { id: uid(), name, walls: [], items: [] };
}

function makeProject(): Project {
  const room = makeRoom("Living Room");
  return {
    id: uid(),
    name: "Untitled Project",
    rooms: [room],
    activeRoomId: room.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

const emptyProject = makeProject();

export const useEditorStore = create<EditorState>((set, get) => ({
  project: emptyProject,
  tool: "select",
  viewMode: "2d",
  selectedId: null,
  selectedType: null,
  zoom: 1,
  panX: 0,
  panY: 0,
  wallStart: null,
  history: [emptyProject],
  historyIndex: 0,

  setTool: (tool) => set({ tool, wallStart: null }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setZoom: (zoom) => set({ zoom: Math.max(0.2, Math.min(3, zoom)) }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  select: (id, type) => set({ selectedId: id, selectedType: type }),

  activeRoom: () => {
    const { project } = get();
    return project.rooms.find((r) => r.id === project.activeRoomId) || project.rooms[0];
  },

  addRoom: (name, walls, items) => {
    const room = makeRoom(name || `Room ${get().project.rooms.length + 1}`);
    if (walls) room.walls = walls;
    if (items) room.items = items;
    set((s) => ({
      project: {
        ...s.project,
        rooms: [...s.project.rooms, room],
        activeRoomId: room.id,
        updatedAt: Date.now(),
      },
      selectedId: null,
      selectedType: null,
    }));
    get().pushHistory();
    return room.id;
  },

  removeRoom: (id) => {
    set((s) => {
      if (s.project.rooms.length <= 1) return s;
      const rooms = s.project.rooms.filter((r) => r.id !== id);
      const activeRoomId = s.project.activeRoomId === id ? rooms[0].id : s.project.activeRoomId;
      return {
        project: { ...s.project, rooms, activeRoomId, updatedAt: Date.now() },
        selectedId: null,
        selectedType: null,
      };
    });
    get().pushHistory();
  },

  setActiveRoom: (id) =>
    set((s) => ({
      project: { ...s.project, activeRoomId: id, updatedAt: Date.now() },
      selectedId: null,
      selectedType: null,
      wallStart: null,
    })),

  renameRoom: (id, name) =>
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) => (r.id === id ? { ...r, name } : r)),
        updatedAt: Date.now(),
      },
    })),

  duplicateRoom: (id) => {
    const room = get().project.rooms.find((r) => r.id === id);
    if (!room) return;
    const copy: Room = {
      id: uid(),
      name: `${room.name} copy`,
      walls: room.walls.map((w) => ({ ...w, id: uid() })),
      items: room.items.map((i) => ({ ...i, id: uid() })),
    };
    set((s) => ({
      project: {
        ...s.project,
        rooms: [...s.project.rooms, copy],
        activeRoomId: copy.id,
        updatedAt: Date.now(),
      },
    }));
    get().pushHistory();
  },

  pushHistory: () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({
      ...state.project,
      rooms: state.project.rooms.map((r) => ({
        ...r,
        walls: r.walls.map((w) => ({ ...w })),
        items: r.items.map((i) => ({ ...i })),
      })),
    });
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  addWall: (wall) => {
    const w: Wall = { ...wall, id: uid() };
    set((s) => {
      const rooms = s.project.rooms.map((r) =>
        r.id === s.project.activeRoomId ? { ...r, walls: [...r.walls, w] } : r
      );
      return { project: { ...s.project, rooms, updatedAt: Date.now() } };
    });
    get().pushHistory();
  },

  updateWall: (id, updates) =>
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId
            ? { ...r, walls: r.walls.map((w) => (w.id === id ? { ...w, ...updates } : w)) }
            : r
        ),
        updatedAt: Date.now(),
      },
    })),

  removeWall: (id) => {
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId ? { ...r, walls: r.walls.filter((w) => w.id !== id) } : r
        ),
        updatedAt: Date.now(),
      },
      selectedId: s.selectedId === id ? null : s.selectedId,
      selectedType: s.selectedId === id ? null : s.selectedType,
    }));
    get().pushHistory();
  },

  addWallsBulk: (walls) => {
    const newWalls: Wall[] = walls.map((w) => ({ ...w, id: uid() }));
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId ? { ...r, walls: [...r.walls, ...newWalls] } : r
        ),
        updatedAt: Date.now(),
      },
    }));
    get().pushHistory();
  },

  addItem: (furnitureId, x, y, rotation = 0) => {
    const f = getFurnitureById(furnitureId);
    if (!f) return;
    const item: PlacedItem = {
      id: uid(),
      furnitureId,
      x,
      y,
      rotation,
      color: f.color,
      width: f.width,
      depth: f.depth,
      height: f.height,
    };
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId ? { ...r, items: [...r.items, item] } : r
        ),
        updatedAt: Date.now(),
      },
      // Auto-select the newly added item so user can edit it immediately
      selectedId: item.id,
      selectedType: "item",
    }));
    get().pushHistory();
    return item.id;
  },

  updateItem: (id, updates) =>
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId
            ? { ...r, items: r.items.map((it) => (it.id === id ? { ...it, ...updates } : it)) }
            : r
        ),
        updatedAt: Date.now(),
      },
    })),

  removeItem: (id) => {
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId ? { ...r, items: r.items.filter((it) => it.id !== id) } : r
        ),
        updatedAt: Date.now(),
      },
      selectedId: s.selectedId === id ? null : s.selectedId,
      selectedType: s.selectedId === id ? null : s.selectedType,
    }));
    get().pushHistory();
  },

  duplicateItem: (id) => {
    const room = get().activeRoom();
    const item = room.items.find((i) => i.id === id);
    if (!item) return;
    const copy: PlacedItem = { ...item, id: uid(), x: item.x + 30, y: item.y + 30 };
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId ? { ...r, items: [...r.items, copy] } : r
        ),
        updatedAt: Date.now(),
      },
    }));
    get().pushHistory();
  },

  addItemsBulk: (items) => {
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId ? { ...r, items: [...r.items, ...items] } : r
        ),
        updatedAt: Date.now(),
      },
    }));
    get().pushHistory();
  },

  setWallStart: (p) => set({ wallStart: p }),

  newProject: () => {
    const p = makeProject();
    set({ project: p, selectedId: null, selectedType: null, history: [p], historyIndex: 0 });
  },

  loadProject: (p) => {
    set({ project: p, selectedId: null, selectedType: null, history: [p], historyIndex: 0 });
  },

  setProjectName: (name) =>
    set((s) => ({ project: { ...s.project, name, updatedAt: Date.now() } })),

  saveToLocal: () => {
    const { project } = get();
    try {
      const all = JSON.parse(localStorage.getItem("planner_projects") || "[]");
      const idx = all.findIndex((p: Project) => p.id === project.id);
      if (idx >= 0) all[idx] = project;
      else all.push(project);
      localStorage.setItem("planner_projects", JSON.stringify(all));
      localStorage.setItem("planner_current", JSON.stringify(project));
    } catch (e) {
      console.error("Failed to save", e);
    }
  },

  loadFromLocal: () => {
    try {
      const data = localStorage.getItem("planner_current");
      if (data) {
        const p = JSON.parse(data) as Project;
        // Migration: if old format with walls/items at root, wrap into a single Room
        if (!p.rooms && (p as any).walls) {
          const migrated: Project = {
            id: p.id,
            name: p.name,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            rooms: [{ id: uid(), name: "Living Room", walls: (p as any).walls, items: (p as any).items }],
            activeRoomId: "",
          };
          migrated.activeRoomId = migrated.rooms[0].id;
          get().loadProject(migrated);
        } else {
          get().loadProject(p);
        }
      }
    } catch (e) {
      console.error("Failed to load", e);
    }
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      set({ project: history[newIdx], historyIndex: newIdx, selectedId: null, selectedType: null });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      set({ project: history[newIdx], historyIndex: newIdx, selectedId: null, selectedType: null });
    }
  },

  clearAll: () => {
    set((s) => ({
      project: {
        ...s.project,
        rooms: s.project.rooms.map((r) =>
          r.id === s.project.activeRoomId ? { ...r, walls: [], items: [] } : r
        ),
        updatedAt: Date.now(),
      },
      selectedId: null,
      selectedType: null,
    }));
    get().pushHistory();
  },
}));

// Helpers
export function getAllSavedProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("planner_projects") || "[]");
  } catch {
    return [];
  }
}

export function deleteSavedProject(id: string) {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem("planner_projects") || "[]");
    const filtered = all.filter((p: Project) => p.id !== id);
    localStorage.setItem("planner_projects", JSON.stringify(filtered));
  } catch {}
}

// Compat: keep `walls` and `items` accessors on Project for components that haven't migrated.
// Use project.rooms.find(active).walls etc. directly instead.
