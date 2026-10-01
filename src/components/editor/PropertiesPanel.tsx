"use client";

import { useEditorStore } from "@/store/editor-store";
import { getFurnitureById } from "@/lib/furniture";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Copy, Trash2, RotateCw } from "lucide-react";

const COLOR_SWATCHES = [
  "#6B7FD7", "#8B9E5B", "#A0744E", "#D4A5A5", "#5C5C5C",
  "#C97B5A", "#5B8C5A", "#E5C07B", "#1A1A1A", "#FFFFFF",
  "#C9B79C", "#8B6F47", "#2C2C2C", "#B8C5D6", "#F5F5F5",
];

export function PropertiesPanel() {
  const project = useEditorStore((s) => s.project);
  const room = useEditorStore((s) => s.project.rooms.find((r) => r.id === s.project.activeRoomId) || s.project.rooms[0]);
  const walls = room?.walls || [];
  const items = room?.items || [];
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectedType = useEditorStore((s) => s.selectedType);
  const updateItem = useEditorStore((s) => s.updateItem);
  const updateWall = useEditorStore((s) => s.updateWall);
  const removeItem = useEditorStore((s) => s.removeItem);
  const removeWall = useEditorStore((s) => s.removeWall);
  const duplicateItem = useEditorStore((s) => s.duplicateItem);

  if (!selectedId || !selectedType) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="p-3 border-b">
          <h3 className="text-sm font-semibold">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="text-sm text-muted-foreground">
            <p className="mb-1">Nothing selected</p>
            <p className="text-xs">Click on a wall or furniture item to edit its properties.</p>
          </div>
        </div>
        <ProjectStats />
      </div>
    );
  }

  if (selectedType === "item") {
    const item = items.find((i) => i.id === selectedId);
    if (!item) return null;
    const f = getFurnitureById(item.furnitureId);
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="p-3 border-b">
          <h3 className="text-sm font-semibold truncate">{f?.name || "Item"}</h3>
          <p className="text-xs text-muted-foreground">Furniture properties</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* Position */}
            <div>
              <Label className="text-xs text-muted-foreground">Position (cm)</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label className="text-[10px]">X</Label>
                  <Input
                    type="number"
                    value={Math.round(item.x)}
                    onChange={(e) => updateItem(item.id, { x: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">Y</Label>
                  <Input
                    type="number"
                    value={Math.round(item.y)}
                    onChange={(e) => updateItem(item.id, { y: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground">Rotation</Label>
                <span className="text-xs font-mono">{Math.round(item.rotation)}°</span>
              </div>
              <Slider
                value={[item.rotation]}
                min={0}
                max={359}
                step={1}
                onValueChange={(v) => updateItem(item.id, { rotation: v[0] })}
                className="mt-2"
              />
              <div className="flex gap-1 mt-2">
                {[0, 90, 180, 270].map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs flex-1"
                    onClick={() => updateItem(item.id, { rotation: r })}
                  >
                    {r}°
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Dimensions */}
            <div>
              <Label className="text-xs text-muted-foreground">Dimensions (cm)</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <Label className="text-[10px]">W</Label>
                  <Input
                    type="number"
                    value={Math.round(item.width)}
                    onChange={(e) => updateItem(item.id, { width: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">D</Label>
                  <Input
                    type="number"
                    value={Math.round(item.depth)}
                    onChange={(e) => updateItem(item.id, { depth: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">H</Label>
                  <Input
                    type="number"
                    value={Math.round(item.height)}
                    onChange={(e) => updateItem(item.id, { height: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Color */}
            <div>
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="grid grid-cols-5 gap-1.5 mt-2">
                {COLOR_SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateItem(item.id, { color: c })}
                    className={`aspect-square rounded-md border-2 transition-all ${
                      item.color.toLowerCase() === c.toLowerCase()
                        ? "border-emerald-600 scale-110"
                        : "border-transparent hover:border-muted-foreground/40"
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={item.color}
                onChange={(e) => updateItem(item.id, { color: e.target.value })}
                className="h-8 mt-2 p-1"
              />
            </div>

            <Separator />

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => updateItem(item.id, { rotation: (item.rotation + 15) % 360 })}
              >
                <RotateCw className="h-3 w-3 mr-1" /> Rotate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => duplicateItem(item.id)}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Wall
  const wall = walls.find((w) => w.id === selectedId);
  if (!wall) return null;
  const length = Math.round(Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1));
  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold capitalize">{wall.type} Properties</h3>
        <p className="text-xs text-muted-foreground">Length: {length} cm</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Start point</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <Label className="text-[10px]">X</Label>
                <Input
                  type="number"
                  value={Math.round(wall.x1)}
                  onChange={(e) => updateWall(wall.id, { x1: Number(e.target.value) })}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px]">Y</Label>
                <Input
                  type="number"
                  value={Math.round(wall.y1)}
                  onChange={(e) => updateWall(wall.id, { y1: Number(e.target.value) })}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">End point</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <Label className="text-[10px]">X</Label>
                <Input
                  type="number"
                  value={Math.round(wall.x2)}
                  onChange={(e) => updateWall(wall.id, { x2: Number(e.target.value) })}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-[10px]">Y</Label>
                <Input
                  type="number"
                  value={Math.round(wall.y2)}
                  onChange={(e) => updateWall(wall.id, { y2: Number(e.target.value) })}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">Thickness (cm)</Label>
              <span className="text-xs font-mono">{wall.thickness}</span>
            </div>
            <Slider
              value={[wall.thickness]}
              min={5}
              max={40}
              step={1}
              onValueChange={(v) => updateWall(wall.id, { thickness: v[0] })}
              className="mt-2"
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">Height (cm)</Label>
              <span className="text-xs font-mono">{wall.height}</span>
            </div>
            <Slider
              value={[wall.height]}
              min={200}
              max={400}
              step={5}
              onValueChange={(v) => updateWall(wall.id, { height: v[0] })}
              className="mt-2"
            />
          </div>
          <Separator />
          <Button
            variant="destructive"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => removeWall(wall.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" /> Delete {wall.type}
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}

function ProjectStats() {
  const project = useEditorStore((s) => s.project);
  const room = useEditorStore((s) => s.project.rooms.find((r) => r.id === s.project.activeRoomId) || s.project.rooms[0]);
  const walls = (room?.walls || []).filter((w) => w.type === "wall");
  const allWalls = room?.walls || [];
  const totalWallLength = walls.reduce((sum, w) => sum + Math.hypot(w.x2 - w.x1, w.y2 - w.y1), 0);
  const allPts = allWalls.flatMap((w) => [[w.x1, w.y1], [w.x2, w.y2]]);
  const allItems = room?.items || [];
  let area = 0;
  if (allPts.length >= 2) {
    const xs = allPts.map((p) => p[0]);
    const ys = allPts.map((p) => p[1]);
    const w = Math.max(...xs) - Math.min(...xs);
    const h = Math.max(...ys) - Math.min(...ys);
    area = (w * h) / 10000; // m²
  }
  return (
    <div className="border-t p-3 space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Stats</h4>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted rounded-md p-2">
          <div className="text-muted-foreground">Walls</div>
          <div className="font-semibold">{walls.length}</div>
        </div>
        <div className="bg-muted rounded-md p-2">
          <div className="text-muted-foreground">Items</div>
          <div className="font-semibold">{allItems.length}</div>
        </div>
        <div className="bg-muted rounded-md p-2">
          <div className="text-muted-foreground">Wall length</div>
          <div className="font-semibold">{(totalWallLength / 100).toFixed(1)} m</div>
        </div>
        <div className="bg-muted rounded-md p-2">
          <div className="text-muted-foreground">Bounding area</div>
          <div className="font-semibold">{area.toFixed(1)} m²</div>
        </div>
      </div>
    </div>
  );
}

// Local import to avoid cycle
import { ScrollArea } from "@/components/ui/scroll-area";
