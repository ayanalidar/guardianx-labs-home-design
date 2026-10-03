"use client";

import { useEditorStore } from "@/store/editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  MousePointer2, Minus, DoorOpen, Square, Undo2, Redo2, Save, FolderOpen,
  Plus, ZoomIn, ZoomOut, Box, LayoutGrid, Type, RectangleHorizontal,
  Circle, Pencil, Ruler, Tag, LayoutPanelTop, Download, FileText,
  Spline, Copy, Move, PersonStanding, Sun, Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getAllSavedProjects, deleteSavedProject, type Project } from "@/store/editor-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ToolbarProps { onExit: () => void; }

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

  // Feature toggles
  const blueprintMode = useEditorStore((s) => (s as any).blueprintMode);
  const setBlueprintMode = useEditorStore((s) => (s as any).setBlueprintMode);
  const showMeasurements = useEditorStore((s) => (s as any).showMeasurements);
  const setShowMeasurements = useEditorStore((s) => (s as any).setShowMeasurements);
  const showRoomLabels = useEditorStore((s) => (s as any).showRoomLabels);
  const setShowRoomLabels = useEditorStore((s) => (s as any).setShowRoomLabels);
  const showTitleBlock = useEditorStore((s) => (s as any).showTitleBlock);
  const setShowTitleBlock = useEditorStore((s) => (s as any).setShowTitleBlock);
  const orthoMode = useEditorStore((s) => (s as any).orthoMode);
  const setOrthoMode = useEditorStore((s) => (s as any).setOrthoMode);
  const snapToGrid = useEditorStore((s) => (s as any).snapToGrid);
  const setSnapToGrid = useEditorStore((s) => (s as any).setSnapToGrid);
  const unitSystem = useEditorStore((s) => (s as any).unitSystem);
  const setUnitSystem = useEditorStore((s) => (s as any).setUnitSystem);
  const dayNight = useEditorStore((s) => (s as any).dayNight);
  const setDayNight = useEditorStore((s) => (s as any).setDayNight);

  const [openDialog, setOpenDialog] = useState<"load" | null>(null);
  const [savedList, setSavedList] = useState<Project[]>([]);

  useEffect(() => { loadFromLocal(); }, [loadFromLocal]);

  const tools = [
    { id: "select", icon: MousePointer2, label: "Select (1)" },
    { id: "wall", icon: Minus, label: "Wall (2)" },
    { id: "door", icon: DoorOpen, label: "Door (3)" },
    { id: "window", icon: Square, label: "Window (4)" },
  ] as const;

  const archTools = [
    { id: "curve", icon: Spline, label: "Curved Wall" },
    { id: "copy", icon: Copy, label: "Copy" },
    { id: "offset", icon: Move, label: "Offset" },
  ] as const;

  const drawTools = [
    { id: "text", icon: Type, label: "Text" },
    { id: "rect", icon: RectangleHorizontal, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "freehand", icon: Pencil, label: "Freehand" },
    { id: "dimension", icon: Ruler, label: "Dimension" },
  ] as const;

  const handleSave = () => { saveToLocal(); toast.success("Project saved", { description: project.name }); };
  const handleNew = () => {
    const total = project.rooms.reduce((s, r) => s + r.walls.length + r.items.length, 0);
    if (total > 0 && !confirm("Start a new project? Unsaved changes will be lost.")) return;
    newProject(); toast.success("New project created");
  };
  const handleExportPNG = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${project.name.replace(/[^a-z0-9]/gi, "_")}_${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Exported as PNG");
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border-b h-14 overflow-x-auto">
      {/* Back to home with logo */}
      <Button variant="ghost" size="sm" onClick={onExit} className="gap-1.5 flex-shrink-0">
        <img src="/guardianx-logo.png" alt="GuardianX Arc Labs" className="h-6 w-6 rounded object-contain" />
        <span className="hidden lg:inline font-bold text-sm">GuardianX Arc Labs</span>
      </Button>
      <Separator orientation="vertical" className="h-8 flex-shrink-0" />

      {/* Project name */}
      <Input value={project.name} onChange={(e) => setProjectName(e.target.value)} className="h-8 w-32 md:w-48 text-sm font-medium flex-shrink-0" placeholder="Project name" />
      <Separator orientation="vertical" className="h-8 flex-shrink-0" />

      {/* Basic tools */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {tools.map((t) => (
          <Button key={t.id} variant={tool === t.id ? "default" : "ghost"} size="sm" className={cn("h-8 w-8 p-0", tool === t.id && "bg-emerald-700 hover:bg-emerald-800")} onClick={() => setTool(t.id as any)} title={t.label}>
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Architecture tools */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {archTools.map((t) => (
          <Button key={t.id} variant={tool === t.id ? "default" : "ghost"} size="sm" className={cn("h-8 w-8 p-0", tool === t.id && "bg-emerald-700 hover:bg-emerald-800")} onClick={() => setTool(t.id as any)} title={t.label}>
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Drawing tools */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {drawTools.map((t) => (
          <Button key={t.id} variant={tool === t.id ? "default" : "ghost"} size="sm" className={cn("h-8 w-8 p-0", tool === t.id && "bg-emerald-700 hover:bg-emerald-800")} onClick={() => setTool(t.id as any)} title={t.label}>
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" className="h-8 flex-shrink-0" />

      {/* AutoCAD toggles */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant={orthoMode ? "default" : "ghost"} size="sm" className={cn("h-8 px-2 text-xs font-bold", orthoMode && "bg-orange-600 hover:bg-orange-700")} onClick={() => setOrthoMode?.(!orthoMode)} title="Ortho Mode (F8)">ORTHO</Button>
        <Button variant={snapToGrid ? "default" : "ghost"} size="sm" className={cn("h-8 px-2 text-xs font-bold", snapToGrid && "bg-orange-600 hover:bg-orange-700")} onClick={() => setSnapToGrid?.(!snapToGrid)} title="Snap to Grid (F9)">SNAP</Button>
        <Button variant="default" size="sm" className="h-8 px-2 text-xs font-bold bg-indigo-700 hover:bg-indigo-800" onClick={() => setUnitSystem?.(unitSystem === "metric" ? "imperial" : "metric")} title="Toggle units">{unitSystem === "metric" ? "m/cm" : "ft/in"}</Button>
      </div>
      <Separator orientation="vertical" className="h-8 flex-shrink-0" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={undo} disabled={historyIndex <= 0} title="Undo"><Undo2 className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo"><Redo2 className="h-4 w-4" /></Button>
      </div>
      <Separator orientation="vertical" className="h-8 flex-shrink-0" />

      {/* View toggle */}
      <div className="flex items-center bg-muted rounded-md p-0.5 flex-shrink-0">
        <Button variant={viewMode === "2d" ? "default" : "ghost"} size="sm" className={cn("h-7 gap-1", viewMode === "2d" && "bg-emerald-700 hover:bg-emerald-800")} onClick={() => setViewMode("2d")}><LayoutGrid className="h-3.5 w-3.5" /><span className="hidden md:inline text-xs">2D</span></Button>
        <Button variant={viewMode === "3d" ? "default" : "ghost"} size="sm" className={cn("h-7 gap-1", viewMode === "3d" && "bg-emerald-700 hover:bg-emerald-800")} onClick={() => setViewMode("3d")}><Box className="h-3.5 w-3.5" /><span className="hidden md:inline text-xs">3D</span></Button>
        <Button variant={(viewMode as string) === "walkthrough" ? "default" : "ghost"} size="sm" className={cn("h-7 gap-1", (viewMode as string) === "walkthrough" && "bg-purple-700 hover:bg-purple-800")} onClick={() => setViewMode("walkthrough" as any)} title="Walkthrough"><PersonStanding className="h-3.5 w-3.5" /><span className="hidden md:inline text-xs">Walk</span></Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDayNight?.(dayNight === "day" ? "night" : "day")} title="Day/Night">{dayNight === "day" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}</Button>
      </div>

      {/* Zoom */}
      {viewMode === "2d" && (
        <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setZoom(zoom * 0.8)}><ZoomOut className="h-4 w-4" /></Button>
          <span className="text-xs w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setZoom(zoom * 1.25)}><ZoomIn className="h-4 w-4" /></Button>
        </div>
      )}
      <Separator orientation="vertical" className="h-8 flex-shrink-0" />

      {/* Architectural toggles */}
      {viewMode === "2d" && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant={blueprintMode ? "default" : "ghost"} size="sm" className={cn("h-8 gap-1", blueprintMode && "bg-blue-800 hover:bg-blue-900")} onClick={() => setBlueprintMode?.(!blueprintMode)} title="Blueprint Mode"><FileText className="h-3.5 w-3.5" /><span className="hidden xl:inline text-xs">Blueprint</span></Button>
          <Button variant={showMeasurements ? "default" : "ghost"} size="sm" className={cn("h-8 w-8 p-0", showMeasurements && "bg-emerald-700 hover:bg-emerald-800")} onClick={() => setShowMeasurements?.(!showMeasurements)} title="Measurements"><Ruler className="h-3.5 w-3.5" /></Button>
          <Button variant={showRoomLabels ? "default" : "ghost"} size="sm" className={cn("h-8 w-8 p-0", showRoomLabels && "bg-emerald-700 hover:bg-emerald-800")} onClick={() => setShowRoomLabels?.(!showRoomLabels)} title="Room Labels"><Tag className="h-3.5 w-3.5" /></Button>
          <Button variant={showTitleBlock ? "default" : "ghost"} size="sm" className={cn("h-8 w-8 p-0", showTitleBlock && "bg-emerald-700 hover:bg-emerald-800")} onClick={() => setShowTitleBlock?.(!showTitleBlock)} title="Title Block"><LayoutPanelTop className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={handleExportPNG} title="Export PNG"><Download className="h-3.5 w-3.5" /><span className="hidden xl:inline text-xs">Export</span></Button>
        </div>
      )}

      <div className="flex-1" />

      {/* Right actions */}
      <Button variant="ghost" size="sm" className="h-8 gap-1.5 flex-shrink-0" onClick={handleNew}><Plus className="h-4 w-4" /><span className="hidden md:inline">New</span></Button>
      <Dialog open={openDialog === "load"} onOpenChange={(o) => setOpenDialog(o ? "load" : null)}>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 flex-shrink-0" onClick={() => { setSavedList(getAllSavedProjects().sort((a, b) => b.updatedAt - a.updatedAt)); setOpenDialog("load"); }}><FolderOpen className="h-4 w-4" /><span className="hidden md:inline">Open</span></Button>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Open Project</DialogTitle></DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {savedList.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground">No saved projects yet.</div>}
            {savedList.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer" onClick={() => { loadProject(p); setOpenDialog(null); toast.success("Project loaded"); }}>
                <div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{p.name}</div><div className="text-xs text-muted-foreground">{p.rooms?.length || 0} rooms · {p.rooms?.reduce((s, r) => s + (r.walls?.length || 0), 0) || 0} walls · {new Date(p.updatedAt).toLocaleDateString()}</div></div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={(e) => { e.stopPropagation(); deleteSavedProject(p.id); setSavedList(getAllSavedProjects()); }}>Delete</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="default" size="sm" className="h-8 gap-1.5 bg-emerald-700 hover:bg-emerald-800 flex-shrink-0" onClick={handleSave}><Save className="h-4 w-4" /><span className="hidden md:inline">Save</span></Button>
    </div>
  );
}
