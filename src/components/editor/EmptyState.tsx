"use client";

import { useEditorStore } from "@/store/editor-store";
import { AddRoomButton } from "./AddRoomButton";
import { Button } from "@/components/ui/button";
import { MousePointer2, DoorOpen, Sparkles, ArrowRight } from "lucide-react";

export function EmptyState() {
  const room = useEditorStore((s) => s.project.rooms.find((r) => r.id === s.project.activeRoomId) || s.project.rooms[0]);
  const setTool = useEditorStore((s) => s.setTool);
  const walls = room?.walls || [];
  const items = room?.items || [];

  if (walls.length > 0 || items.length > 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 p-4">
      <div className="max-w-md bg-white/95 backdrop-blur-sm border rounded-2xl shadow-xl p-6 pointer-events-auto">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-center font-bold text-lg mb-2">Start designing your room</h3>
        <p className="text-center text-sm text-muted-foreground mb-5">
          Pick a pre-built room template, or draw walls yourself. Then drag in furniture from the left panel.
        </p>
        <div className="space-y-2">
          <AddRoomButton />
          <div className="text-center text-xs text-muted-foreground py-1">— or —</div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setTool("wall")}
          >
            <DoorOpen className="h-4 w-4" />
            Draw walls manually
            <ArrowRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
        <div className="mt-5 pt-4 border-t text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5">
            <MousePointer2 className="h-3 w-3" />
            Tip: Use 2D mode to plan, then switch to 3D to walk through
          </div>
        </div>
      </div>
    </div>
  );
}
