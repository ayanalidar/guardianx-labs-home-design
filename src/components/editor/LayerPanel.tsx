"use client";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Layers as LayersIcon } from "lucide-react";

const LAYERS = [
  { id: "walls", label: "Walls", color: "bg-gray-600" },
  { id: "doors", label: "Doors", color: "bg-purple-600" },
  { id: "windows", label: "Windows", color: "bg-cyan-600" },
  { id: "furniture", label: "Furniture", color: "bg-emerald-600" },
  { id: "electrical", label: "Electrical", color: "bg-yellow-600" },
  { id: "plumbing", label: "Plumbing", color: "bg-blue-600" },
  { id: "dimensions", label: "Dimensions", color: "bg-indigo-600" },
  { id: "text", label: "Text", color: "bg-stone-600" },
  { id: "landscape", label: "Landscape", color: "bg-green-600" },
];

export function LayerPanel() {
  const visibleLayers = useEditorStore((s) => (s as any).visibleLayers) || {};
  const toggleLayer = useEditorStore((s) => (s as any).toggleLayer);

  if (!toggleLayer) return null;

  return (
    <div className="flex-shrink-0 p-3 border-b bg-card">
      <div className="flex items-center gap-1.5 mb-2">
        <LayersIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-xs font-semibold">Layers</h3>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {LAYERS.map((layer) => {
          const visible = visibleLayers[layer.id] !== false;
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-colors", visible ? "bg-muted hover:bg-muted/70" : "bg-muted/30 opacity-50")}
            >
              <div className={cn("w-2 h-2 rounded-full", layer.color)} />
              <span className="flex-1 text-left">{layer.label}</span>
              {visible ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
