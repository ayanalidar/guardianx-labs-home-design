"use client";

import { useState, useMemo } from "react";
import {
  FURNITURE_CATALOG,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  type FurnitureCategory,
  type FurnitureItem,
} from "@/lib/furniture";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Search, GripVertical } from "lucide-react";
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

  const onDragStart = (e: React.DragEvent, furnitureId: string) => {
    e.dataTransfer.setData("text/furniture-id", furnitureId);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClickAdd = (f: FurnitureItem) => {
    // Place at canvas center (approx 200, 200 in world coords)
    addItem(f.id, 200, 200, 0);
    toast.success(`${f.name} added`, { description: "Drag to position it on the floor plan" });
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-3 border-b">
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

      <div className="flex gap-1 p-2 border-b overflow-x-auto">
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

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2 p-3">
          {filtered.map((f) => (
            <div
              key={f.id}
              draggable
              onDragStart={(e) => onDragStart(e, f.id)}
              className="group relative cursor-grab active:cursor-grabbing rounded-lg border bg-background hover:border-emerald-500 hover:shadow-md transition-all overflow-hidden"
              title={`${f.name} (${f.width}×${f.depth}cm) — drag to canvas or click + to add`}
            >
              {/* Drag handle indicator */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
              </div>
              {/* Click-to-add button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickAdd(f);
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-700 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-emerald-800 z-10"
                title="Add to room"
              >
                <Plus className="h-3 w-3" />
              </button>
              <div className="p-2 flex flex-col items-center gap-1.5">
                <div
                  className="w-full aspect-square rounded-md flex items-center justify-center text-white font-bold text-sm shadow-inner"
                  style={{ backgroundColor: f.color }}
                >
                  {f.icon}
                </div>
                <div className="text-[11px] text-center font-medium leading-tight line-clamp-2 min-h-[28px]">
                  {f.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {f.width}×{f.depth}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No furniture found</div>
        )}
      </ScrollArea>
      <div className="p-2 border-t text-[10px] text-muted-foreground text-center space-y-0.5">
        <div>Drag to canvas · Click + to add at center</div>
      </div>
    </div>
  );
}
