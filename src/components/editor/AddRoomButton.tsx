"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { ROOM_TEMPLATES, instantiateRoomTemplate, type RoomTemplate } from "@/lib/room-templates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, LayoutTemplate, Ruler, RoomTiles } from "lucide-react";
import { toast } from "sonner";

export function AddRoomButton() {
  const [open, setOpen] = useState(false);
  const addRoom = useEditorStore((s) => s.addRoom);
  const project = useEditorStore((s) => s.project);

  const handleTemplate = (tpl: RoomTemplate) => {
    const { walls, items } = instantiateRoomTemplate(tpl);
    addRoom(tpl.name, walls, items);
    setOpen(false);
    toast.success(`${tpl.name} added`, { description: "Switch to it from the room tabs above" });
  };

  const [width, setWidth] = useState(400);
  const [depth, setDepth] = useState(300);
  const [roomName, setRoomName] = useState("");

  const handleCustomRoom = () => {
    const w = Math.max(50, Math.min(2000, width));
    const d = Math.max(50, Math.min(2000, depth));
    const name = roomName.trim() || `Room ${project.rooms.length + 1}`;
    const uid = () => Math.random().toString(36).slice(2, 11);
    // 4 walls + door on bottom
    const walls = [
      { id: uid(), x1: 0, y1: 0, x2: w, y2: 0, thickness: 15, height: 270, type: "wall" as const },
      { id: uid(), x1: w, y1: 0, x2: w, y2: d, thickness: 15, height: 270, type: "wall" as const },
      { id: uid(), x1: w, y1: d, x2: Math.max(60, w * 0.3), y2: d, thickness: 15, height: 270, type: "wall" as const },
      { id: uid(), x1: Math.max(60, w * 0.3), y1: d, x2: Math.min(w - 60, w * 0.3) + 80, y2: d, thickness: 10, height: 210, type: "door" as const },
      { id: uid(), x1: Math.min(w - 60, w * 0.3) + 80, y1: d, x2: 0, y2: d, thickness: 15, height: 270, type: "wall" as const },
      { id: uid(), x1: 0, y1: d, x2: 0, y2: 0, thickness: 15, height: 270, type: "wall" as const },
    ];
    addRoom(name, walls, []);
    setOpen(false);
    setRoomName("");
    toast.success(`${name} added`, { description: `${w}×${d} cm (${((w * d) / 10000).toFixed(1)} m²)` });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1.5 bg-emerald-700 hover:bg-emerald-800">
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-emerald-700" />
            Add a Room
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="templates" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="templates" className="gap-1.5">
              <LayoutTemplate className="h-3.5 w-3.5" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="custom" className="gap-1.5">
              <Ruler className="h-3.5 w-3.5" />
              Custom Dimensions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="flex-1 overflow-hidden mt-2">
            <ScrollArea className="h-[55vh] pr-2">
              <div className="grid sm:grid-cols-2 gap-3">
                {ROOM_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleTemplate(tpl)}
                    className="group text-left p-4 rounded-lg border hover:border-emerald-500 hover:shadow-md transition-all bg-background"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center text-2xl transition-colors flex-shrink-0">
                        {tpl.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{tpl.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{tpl.description}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {tpl.items.length > 0 ? `${tpl.items.length} pre-placed items` : "Empty walls only"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="custom" className="flex-1 mt-2">
            <div className="p-4 space-y-4">
              <div>
                <Label htmlFor="room-name">Room name</Label>
                <Input
                  id="room-name"
                  placeholder={`Room ${project.rooms.length + 1}`}
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    min={50}
                    max={2000}
                    step={10}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="depth">Depth (cm)</Label>
                  <Input
                    id="depth"
                    type="number"
                    min={50}
                    max={2000}
                    step={10}
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Quick presets */}
              <div>
                <Label className="text-xs text-muted-foreground">Quick presets</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {[
                    { label: "Small 3×3", w: 300, d: 300 },
                    { label: "Medium 4×4", w: 400, d: 400 },
                    { label: "Large 5×5", w: 500, d: 500 },
                    { label: "XL 6×6", w: 600, d: 600 },
                    { label: "Long 6×3", w: 600, d: 300 },
                    { label: "Wide 3×6", w: 300, d: 600 },
                    { label: "L-Shape 6×5", w: 600, d: 500 },
                    { label: "Hallway 8×2", w: 800, d: 200 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setWidth(p.w);
                        setDepth(p.d);
                      }}
                      className="px-2 py-1.5 text-xs rounded-md bg-muted hover:bg-muted/70 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Area</span>
                  <span className="font-semibold">{((width * depth) / 10000).toFixed(1)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Perimeter</span>
                  <span className="font-semibold">{((2 * (width + depth)) / 100).toFixed(1)} m</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCustomRoom} className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="h-4 w-4 mr-1" />
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
