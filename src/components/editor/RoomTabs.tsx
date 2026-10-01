"use client";

import { useEditorStore } from "@/store/editor-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Copy, Edit3, DoorOpen } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function RoomTabs() {
  const project = useEditorStore((s) => s.project);
  const setActiveRoom = useEditorStore((s) => s.setActiveRoom);
  const removeRoom = useEditorStore((s) => s.removeRoom);
  const duplicateRoom = useEditorStore((s) => s.duplicateRoom);
  const renameRoom = useEditorStore((s) => s.renameRoom);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const commitEdit = () => {
    if (editingId) {
      renameRoom(editingId, editValue.trim() || "Untitled Room");
      setEditingId(null);
    }
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto px-3 py-1.5 bg-muted/30 border-b flex-1">
      {project.rooms.map((room) => {
        const isActive = room.id === project.activeRoomId;
        return (
          <div
            key={room.id}
            className={cn(
              "group flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
              isActive
                ? "bg-emerald-700 text-white"
                : "bg-background hover:bg-background/70 text-foreground border"
            )}
            onClick={() => !editingId && setActiveRoom(room.id)}
          >
            {editingId === room.id ? (
              <Input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-32 text-xs px-1"
              />
            ) : (
              <span className="flex items-center gap-1 select-none">
                <DoorOpen className="h-3 w-3" />
                {room.name}
                <span className="opacity-60 ml-1">
                  ({room.items.length})
                </span>
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                    isActive ? "hover:bg-white/20" : "hover:bg-muted"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => startEdit(room.id, room.name)}>
                  <Edit3 className="h-3.5 w-3.5 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateRoom(room.id)}>
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (project.rooms.length > 1) {
                      removeRoom(room.id);
                      toast.success("Room removed");
                    } else {
                      toast.error("Cannot delete the last room");
                    }
                  }}
                  className="text-destructive focus:text-destructive"
                  disabled={project.rooms.length <= 1}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
}
