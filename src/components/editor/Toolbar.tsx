"use client";

import { useEditorStore } from "@/store/editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  MousePointer2,
  Minus,
  DoorOpen,
  Square,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Plus,
  ZoomIn,
  ZoomOut,
  Box,
  LayoutGrid,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getAllSavedProjects, deleteSavedProject, type Project } from "@/store/editor-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ToolbarProps {
  onExit: () => void;
}

export function Toolbar({ onExit }: ToolbarProps) {
  const tool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  const viewMode = useEditorStore((s) => s.viewMode);
  const setViewMode = useEditorStore((s) => s.setViewMode);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const project = useEditorStore((s) => s.project);
  const setProjectName = useEditorStore((s) => s.setProjectName);
  const saveToLocal = useEditorStore((s) => s.saveToLocal);
  const loadFromLocal = useEditorStore((s) => s.loadFromLocal);
  const newProject = useEditorStore((s) => s.newProject);
  const loadProject = useEditorStore((s) => s.loadProject);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const historyIndex = useEditorStore((s) => s.historyIndex);
  const history = useEditorStore((s) => s.history);

  const [openDialog, setOpenDialog] = useState<"load" | null>(null);
  const [savedList, setSavedList] = useState<Project[]>([]);

  // Auto-load on mount
  useEffect(() => {
    loadFromLocal();
  }, [loadFromLocal]);

  const tools = [
    { id: "select", icon: MousePointer2, label: "Select (1)", key: "1" },
    { id: "wall", icon: Minus, label: "Wall (2)", key: "2" },
    { id: "door", icon: DoorOpen, label: "Door (3)", key: "3" },
    { id: "window", icon: Square, label: "Window (4)", key: "4" },
  ] as const;

  const handleSave = () => {
    saveToLocal();
    toast.success("Project saved", { description: project.name });
  };

  const handleOpenLoad = () => {
    setSavedList(getAllSavedProjects().sort((a, b) => b.updatedAt - a.updatedAt));
    setOpenDialog("load");
  };

  const handleLoad = (p: Project) => {
    loadProject(p);
    setOpenDialog(null);
    toast.success("Project loaded", { description: p.name });
  };

  const handleDelete = (id: string) => {
    deleteSavedProject(id);
    setSavedList(getAllSavedProjects().sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const handleNew = () => {
    const totalElements = project.rooms.reduce((s, r) => s + r.walls.length + r.items.length, 0);
    if (totalElements > 0) {
      if (!confirm("Start a new project? Unsaved changes will be lost.")) return;
    }
    newProject();
    toast.success("New project created");
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border-b h-14">
      {/* Back to home */}
      <Button variant="ghost" size="sm" onClick={onExit} className="gap-1.5">
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Button>

      <Separator orientation="vertical" className="h-8" />

      {/* Project name */}
      <Input
        value={project.name}
        onChange={(e) => setProjectName(e.target.value)}
        className="h-8 w-40 md:w-56 text-sm font-medium"
        placeholder="Project name"
      />

      <Separator orientation="vertical" className="h-8" />

      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map((t) => (
          <Button
            key={t.id}
            variant={tool === t.id ? "default" : "ghost"}
            size="sm"
            className={cn("h-8 w-8 p-0", tool === t.id && "bg-emerald-700 hover:bg-emerald-800")}
            onClick={() => setTool(t.id)}
            title={t.label}
          >
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* View toggle */}
      <div className="flex items-center bg-muted rounded-md p-0.5">
        <Button
          variant={viewMode === "2d" ? "default" : "ghost"}
          size="sm"
          className={cn("h-7 gap-1", viewMode === "2d" && "bg-emerald-700 hover:bg-emerald-800")}
          onClick={() => setViewMode("2d")}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span className="hidden md:inline text-xs">2D</span>
        </Button>
        <Button
          variant={viewMode === "3d" ? "default" : "ghost"}
          size="sm"
          className={cn("h-7 gap-1", viewMode === "3d" && "bg-emerald-700 hover:bg-emerald-800")}
          onClick={() => setViewMode("3d")}
        >
          <Box className="h-3.5 w-3.5" />
          <span className="hidden md:inline text-xs">3D</span>
        </Button>
      </div>

      {/* Zoom (only in 2D) */}
      {viewMode === "2d" && (
        <div className="hidden lg:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setZoom(zoom * 0.8)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setZoom(zoom * 1.25)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex-1" />

      {/* Right actions */}
      <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={handleNew}>
        <Plus className="h-4 w-4" />
        <span className="hidden md:inline">New</span>
      </Button>
      <Dialog open={openDialog === "load"} onOpenChange={(o) => setOpenDialog(o ? "load" : null)}>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={handleOpenLoad}>
          <FolderOpen className="h-4 w-4" />
          <span className="hidden md:inline">Open</span>
        </Button>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Open Project</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {savedList.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No saved projects yet. Save your current project to see it here.
              </div>
            )}
            {savedList.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                onClick={() => handleLoad(p)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.rooms.length} room{p.rooms.length !== 1 ? "s" : ""} · {p.rooms.reduce((s, r) => s + r.walls.length, 0)} walls · {p.rooms.reduce((s, r) => s + r.items.length, 0)} items · {new Date(p.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Button
        variant="default"
        size="sm"
        className="h-8 gap-1.5 bg-emerald-700 hover:bg-emerald-800"
        onClick={handleSave}
      >
        <Save className="h-4 w-4" />
        <span className="hidden md:inline">Save</span>
      </Button>
    </div>
  );
}
