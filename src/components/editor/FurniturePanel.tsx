"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  FURNITURE_CATALOG,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  type FurnitureCategory,
  type FurnitureItem,
} from "@/lib/furniture";
import { Input } from "@/components/ui/input";
import { FurniturePreview } from "./FurniturePreview";
import { getFurnitureImage } from "@/lib/furniture-images";
import { Plus, Search, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { toast } from "sonner";

const CATEGORIES: FurnitureCategory[] = [
  "living", "bedroom", "kitchen", "bathroom", "office",
  "outdoor", "decor", "lighting", "appliances", "electronics",
  "storage", "textiles", "kids", "hallway",
];

export function FurniturePanel() {
  const [active, setActive] = useState<FurnitureCategory | "all">("all");
  const [search, setSearch] = useState("");
  const addItem = useEditorStore((s) => s.addItem);
  const setZoom = useEditorStore((s) => s.setZoom);
  const setPan = useEditorStore((s) => s.setPan);
  const zoom = useEditorStore((s) => s.zoom);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartedRef = useRef(false);

  const filtered = useMemo(() => {
    return FURNITURE_CATALOG.filter((f) => {
      if (active !== "all" && f.category !== active) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!f.name.toLowerCase().includes(q) && !(f.tags || []).some((t) => t.includes(q))) return false;
      }
      return true;
    });
  }, [active, search]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [active, search]);

  // When clicking the Add button, add item at center of VISIBLE canvas area
  const handleAddClick = (f: FurnitureItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const setTool = useEditorStore.getState().setTool;
    const state = useEditorStore.getState();
    // Find the canvas element and compute its visible center in world coords
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const BASE_SCALE = 0.5;
      const worldX = (centerX - state.panX) / (BASE_SCALE * state.zoom);
      const worldY = (centerY - state.panY) / (BASE_SCALE * state.zoom);
      setTool("select");
      addItem(f.id, worldX, worldY, 0);
    } else {
      setTool("select");
      addItem(f.id, 200, 200, 0);
    }
    setRecentlyAdded(f.id);
    setTimeout(() => setRecentlyAdded(null), 1500);
    toast.success(`${f.name} added`, {
      description: "Selected — drag it on the canvas to reposition",
    });
  };

  // Drag handler — only fires on actual drag, not click
  const handleDragStart = (e: React.DragEvent, f: FurnitureItem) => {
    dragStartedRef.current = true;
    e.dataTransfer.setData("text/furniture-id", f.id);
    e.dataTransfer.effectAllowed = "copy";
    // Create a drag image from the card
    const dragImg = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(dragImg, 45, 45);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-card min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Furniture Library</h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {FURNITURE_CATALOG.length} items
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search furniture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm pl-8"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex-shrink-0 flex gap-1 p-2 border-b overflow-x-auto">
        <button
          onClick={() => setActive("all")}
          className={cn(
            "px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors",
            active === "all" ? "bg-emerald-700 text-white" : "bg-muted hover:bg-muted/70"
          )}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors flex items-center gap-1",
              active === c ? "bg-emerald-700 text-white" : "bg-muted hover:bg-muted/70"
            )}
            title={CATEGORY_LABELS[c]}
          >
            <span>{CATEGORY_ICONS[c]}</span>
            <span className="hidden xl:inline">{CATEGORY_LABELS[c]}</span>
          </button>
        ))}
      </div>

      {/* Scrollable grid */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#888 transparent" }}
      >
        <style>{`
          .fp-scroll::-webkit-scrollbar { width: 8px; }
          .fp-scroll::-webkit-scrollbar-track { background: transparent; }
          .fp-scroll::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
          .fp-scroll::-webkit-scrollbar-thumb:hover { background: #666; }
        `}</style>
        <div className="grid grid-cols-2 gap-2.5 p-3">
          {filtered.map((f) => {
            const justAdded = recentlyAdded === f.id;
            return (
              <div
                key={f.id}
                draggable
                onDragStart={(e) => handleDragStart(e, f)}
                onDragEnd={() => { dragStartedRef.current = false; }}
                className={cn(
                  "group relative rounded-lg border bg-background transition-all overflow-hidden select-none cursor-grab active:cursor-grabbing",
                  justAdded
                    ? "border-emerald-600 ring-2 ring-emerald-400"
                    : "border-stone-200 hover:border-emerald-500 hover:shadow-md"
                )}
                title={`${f.name} (${f.width}×${f.depth}cm) — drag to canvas`}
              >
                {/* Preview area — real product image if available, SVG fallback otherwise */}
                <div className="relative aspect-square bg-stone-50 flex items-center justify-center p-2 pointer-events-none">
                  <FurniturePreview item={f} size={90} imageUrl={getFurnitureImage(f.id)} />
                </div>

                {/* Name + dimensions + Add button */}
                <div className="p-2 border-t bg-white">
                  <div className="text-[11px] font-medium leading-tight line-clamp-2 min-h-[28px]">
                    {f.name}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground">
                      {f.width}×{f.depth}cm
                    </span>
                    <button
                      onClick={(e) => handleAddClick(f, e)}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                      title="Add to room center"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Added confirmation overlay */}
                {justAdded && (
                  <div className="absolute inset-0 bg-emerald-600/10 flex items-center justify-center pointer-events-none">
                    <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ✓ Added!
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No furniture found</div>
        )}
      </div>

      {/* Footer hint */}
      <div className="flex-shrink-0 p-2 border-t bg-emerald-50">
        <div className="text-[10px] text-emerald-800 text-center font-medium flex items-center justify-center gap-1">
          <MousePointer2 className="h-3 w-3" />
          Drag a card to the canvas · Or click "Add" to drop at center
        </div>
      </div>
    </div>
  );
}
