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
import { Plus, Search, GripVertical, Check } from "lucide-react";
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
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Reset scroll when category/search changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [active, search]);

  const onDragStart = (e: React.DragEvent, furnitureId: string) => {
    e.dataTransfer.setData("text/furniture-id", furnitureId);
    e.dataTransfer.effectAllowed = "copy";
    // Add a visual drag image
    const dragImg = e.currentTarget.querySelector(".drag-preview") as HTMLElement;
    if (dragImg) {
      e.dataTransfer.setDragImage(dragImg, 40, 40);
    }
  };

  const handleClickAdd = (f: FurnitureItem) => {
    // Place at canvas center (approx 200, 200 in world coords)
    addItem(f.id, 200, 200, 0);
    setRecentlyAdded(f.id);
    setTimeout(() => setRecentlyAdded(null), 1200);
    toast.success(`${f.name} added`, { description: "Click on it in the canvas to move, rotate, or resize" });
  };

  return (
    <div className="flex flex-col h-full bg-card min-h-0">
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

      {/* Scrollable grid — using plain div, NOT ScrollArea */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#888 transparent" }}
      >
        <style>{`
          div::-webkit-scrollbar { width: 8px; }
          div::-webkit-scrollbar-track { background: transparent; }
          div::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
          div::-webkit-scrollbar-thumb:hover { background: #666; }
        `}</style>
        <div className="grid grid-cols-2 gap-2.5 p-3">
          {filtered.map((f) => {
            const justAdded = recentlyAdded === f.id;
            return (
              <div
                key={f.id}
                draggable
                onDragStart={(e) => onDragStart(e, f.id)}
                onClick={() => handleClickAdd(f)}
                className={cn(
                  "group relative cursor-pointer rounded-lg border bg-background transition-all overflow-hidden select-none",
                  justAdded
                    ? "border-emerald-600 ring-2 ring-emerald-400"
                    : "border-stone-200 hover:border-emerald-500 hover:shadow-md"
                )}
                title={`${f.name} (${f.width}×${f.depth}cm) — click to add to room`}
              >
                {/* Drag handle badge — always visible */}
                <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-black/10 backdrop-blur-sm rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-2.5 w-2.5 text-white" />
                  <span className="text-[8px] text-white font-medium">DRAG</span>
                </div>

                {/* Added confirmation */}
                {justAdded && (
                  <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                {/* Preview area with light background */}
                <div className="relative aspect-square bg-stone-50 flex items-center justify-center p-2">
                  <FurniturePreview item={f} size={90} />
                  {/* Hidden larger preview used as drag image */}
                  <div className="drag-preview hidden">
                    <FurniturePreview item={f} size={80} />
                  </div>
                </div>

                {/* Name + dimensions */}
                <div className="p-2 border-t bg-white">
                  <div className="text-[11px] font-medium leading-tight line-clamp-2 min-h-[28px]">
                    {f.name}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px] text-muted-foreground">
                      {f.width}×{f.depth}cm
                    </span>
                    <span className="text-[9px] text-emerald-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      <Plus className="h-2 w-2" />
                      Add
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No furniture found</div>
        )}
      </div>

      {/* Footer hint */}
      <div className="flex-shrink-0 p-2 border-t bg-muted/30">
        <div className="text-[10px] text-muted-foreground text-center font-medium">
          Click any item to add it · Or drag to a specific spot
        </div>
      </div>
    </div>
  );
}
