"use client";
import { useEditorStore } from "@/store/editor-store";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function FloorTabs() {
  const project = useEditorStore((s) => s.project);
  const addFloor = useEditorStore((s) => s.addFloor);
  const removeFloor = useEditorStore((s) => s.removeFloor);
  const setActiveFloor = useEditorStore((s) => s.setActiveFloor);
  const floors = (project as any).floors || [];
  const activeFloorId = (project as any).activeFloorId || "";

  return (
    <div className="flex items-center gap-1 px-3 py-1 bg-muted/30 border-b overflow-x-auto">
      {floors.map((floor: any) => (
        <div
          key={floor.id}
          className={cn(
            "group flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors",
            floor.id === activeFloorId ? "bg-indigo-700 text-white" : "bg-background hover:bg-background/70 border"
          )}
          onClick={() => setActiveFloor(floor.id)}
        >
          <Building2 className="h-3 w-3" />
          <span>{floor.name}</span>
          {floors.length > 1 && (
            <button
              className="ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); removeFloor(floor.id); toast.success("Floor removed"); }}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
      <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => { addFloor(); toast.success("New floor added"); }}>
        <Plus className="h-3 w-3" /> Add Floor
      </Button>
    </div>
  );
}
