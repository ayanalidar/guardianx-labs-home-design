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
  furnitureId: string; // reference to FURNITURE_CATALOG
  x: number; // center x in cm (canvas space)
  y: number; // center y in cm
  rotation: number; // degrees
  color: string; // override color
  width: number; // cm (override)
  depth: number; // cm (override)
  height: number; // cm (override)
}

export interface Project {
  id: string;
  name: string;
  walls: Wall[];
  items: PlacedItem[];
  createdAt: number;
  updatedAt: number;
}

export type ViewMode = "2d" | "3d";

interface EditorState {
  // Project
  project: Project;
  // UI
  tool: Tool;
  viewMode: ViewMode;
  selectedId: string | null;
  selectedType: "wall" | "item" | null;
  zoom: number;
  panX: number;
  panY: number;
  // Wall drawing temp state
  wallStart: { x: number; y: number } | null;
  // History for undo
  history: Project[];
  historyIndex: number;

  // Actions
  setTool: (tool: Tool) => void;
  setViewMode: (mode: ViewMode) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  select: (id: string | null, type: "wall" | "item" | null) => void;

  addWall: (wall: Omit<Wall, "id">) => void;
  updateWall: (id: string, updates: Partial<Wall>) => void;
  removeWall: (id: string) => void;

  addItem: (furnitureId: string, x: number, y: number) => void;
  updateItem: (id: string, updates: Partial<PlacedItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;

  setWallStart: (p: { x: number; y: number } | null) => void;

  newProject: () => void;
  loadProject: (p: Project) => void;
  setProjectName: (name: string) => void;
  saveToLocal: () => void;
  loadFromLocal: () => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 11);

const emptyProject: Project = {
  id: uid(),
  name: "Untitled Project",
  walls: [],
  items: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

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

  pushHistory: () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ ...state.project, walls: [...state.project.walls], items: [...state.project.items] });
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  addWall: (wall) => {
    const w: Wall = { ...wall, id: uid() };
    set((s) => ({
      project: { ...s.project, walls: [...s.project.walls, w], updatedAt: Date.now() },
    }));
    get().pushHistory();
  },

  updateWall: (id, updates) =>
    set((s) => ({
      project: {
        ...s.project,
        walls: s.project.walls.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        updatedAt: Date.now(),
      },
    })),

  removeWall: (id) => {
    set((s) => ({
      project: { ...s.project, walls: s.project.walls.filter((w) => w.id !== id), updatedAt: Date.now() },
      selectedId: s.selectedId === id ? null : s.selectedId,
      selectedType: s.selectedId === id ? null : s.selectedType,
    }));
    get().pushHistory();
  },

  addItem: (furnitureId, x, y) => {
    const f = getFurnitureById(furnitureId);
    if (!f) return;
    const item: PlacedItem = {
      id: uid(),
      furnitureId,
      x,
      y,
      rotation: 0,
      color: f.color,
      width: f.width,
      depth: f.depth,
      height: f.height,
    };
    set((s) => ({
      project: { ...s.project, items: [...s.project.items, item], updatedAt: Date.now() },
    }));
    get().pushHistory();
  },

  updateItem: (id, updates) =>
    set((s) => ({
      project: {
        ...s.project,
        items: s.project.items.map((it) => (it.id === id ? { ...it, ...updates } : it)),
        updatedAt: Date.now(),
      },
    })),

  removeItem: (id) => {
    set((s) => ({
      project: { ...s.project, items: s.project.items.filter((it) => it.id !== id), updatedAt: Date.now() },
      selectedId: s.selectedId === id ? null : s.selectedId,
      selectedType: s.selectedId === id ? null : s.selectedType,
    }));
    get().pushHistory();
  },

  duplicateItem: (id) => {
    const item = get().project.items.find((i) => i.id === id);
    if (!item) return;
    const copy: PlacedItem = { ...item, id: uid(), x: item.x + 30, y: item.y + 30 };
    set((s) => ({
      project: { ...s.project, items: [...s.project.items, copy], updatedAt: Date.now() },
    }));
    get().pushHistory();
  },

  setWallStart: (p) => set({ wallStart: p }),

  newProject: () => {
    const p: Project = { ...emptyProject, id: uid(), createdAt: Date.now(), updatedAt: Date.now() };
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
        get().loadProject(p);
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
}));

// Helper: get all saved projects from localStorage
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
