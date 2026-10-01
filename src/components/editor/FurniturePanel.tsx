"use client";

import { useState, useMemo } from "react";
import { FURNITURE_CATALOG, CATEGORY_LABELS, CATEGORY_ICONS, type FurnitureCategory } from "@/lib/furniture";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const CATEGORIES: FurnitureCategory[] = ["living", "bedroom", "kitchen", "bathroom", "office", "outdoor", "decor"];

export function FurniturePanel() {
  const [active, setActive] = useState<FurnitureCategory | "all">("all");
  const [search, setSearch] = useState("");

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

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold mb-2">Furniture Library</h3>
        <Input
          placeholder="Search furniture..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-sm"
        />
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
              className="group cursor-grab active:cursor-grabbing rounded-lg border bg-background hover:border-emerald-500 hover:shadow-md transition-all p-2 flex flex-col items-center gap-1.5"
              title={`${f.name} (${f.width}×${f.depth}cm)`}
            >
              <div
                className="w-full aspect-square rounded-md flex items-center justify-center text-white font-bold text-sm shadow-inner"
                style={{ backgroundColor: f.color }}
              >
                {f.icon}
              </div>
              <div className="text-[11px] text-center font-medium leading-tight line-clamp-2">{f.name}</div>
              <div className="text-[10px] text-muted-foreground">
                {f.width}×{f.depth}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No furniture found</div>
        )}
      </ScrollArea>
      <div className="p-2 border-t text-[10px] text-muted-foreground text-center">
        Drag items onto the canvas
      </div>
    </div>
  );
}
