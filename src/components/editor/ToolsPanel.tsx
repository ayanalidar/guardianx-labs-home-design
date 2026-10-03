"use client";
import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { formatArea } from "@/lib/units";
import { Calculator, X, Table } from "lucide-react";

export function ToolsPanel() {
  const [open, setOpen] = useState<"cost" | "schedule" | null>(null);
  const room = useEditorStore((s) => s.project.rooms.find((r) => r.id === s.project.activeRoomId) || s.project.rooms[0]);
  const unitSystem = useEditorStore((s) => (s as any).unitSystem || "metric");
  const walls = room?.walls || [];
  const items = room?.items || [];

  const pts = walls.flatMap((w) => [[w.x1, w.y1], [w.x2, w.y2]]);
  let area = 0, perimeter = 0;
  if (pts.length >= 2) {
    const xs = pts.map((p) => p[0]); const ys = pts.map((p) => p[1]);
    const w = Math.max(...xs) - Math.min(...xs); const h = Math.max(...ys) - Math.min(...ys);
    area = w * h; perimeter = 2 * (w + h);
  }
  const wallSurface = perimeter * 270;
  const wallCount = walls.filter((w) => w.type === "wall").length;
  const doorCount = walls.filter((w) => w.type === "door").length;
  const windowCount = walls.filter((w) => w.type === "window").length;
  const floorAreaM2 = area / 10000;
  const wallAreaM2 = wallSurface / 10000;
  const floorCost = floorAreaM2 * 80;
  const paintCost = wallAreaM2 * 5;
  const totalCost = floorCost + paintCost;
  const doors = walls.filter((w) => w.type === "door").map((w, i) => ({ id: `D${i+1}`, width: Math.abs(w.x2-w.x1) || Math.abs(w.y2-w.y1) }));
  const windows = walls.filter((w) => w.type === "window").map((w, i) => ({ id: `W${i+1}`, width: Math.abs(w.x2-w.x1) || Math.abs(w.y2-w.y1) }));

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2">
        <button onClick={() => setOpen(open === "cost" ? null : "cost")} className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center" title="Cost Estimator">
          <Calculator className="h-5 w-5" />
        </button>
        <button onClick={() => setOpen(open === "schedule" ? null : "schedule")} className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center" title="Door & Window Schedule">
          <Table className="h-5 w-5" />
        </button>
      </div>
      {open === "cost" && (
        <div className="fixed bottom-20 left-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <div className="flex items-center gap-2"><Calculator className="h-4 w-4" /><h3 className="font-bold text-sm">Cost Estimator</h3></div>
            <button onClick={() => setOpen(null)} className="p-1 rounded hover:bg-white/20"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted rounded-lg p-2"><div className="text-[10px] text-muted-foreground">Floor Area</div><div className="font-bold">{formatArea(area, unitSystem)}</div></div>
              <div className="bg-muted rounded-lg p-2"><div className="text-[10px] text-muted-foreground">Wall Surface</div><div className="font-bold">{formatArea(wallSurface, unitSystem)}</div></div>
              <div className="bg-muted rounded-lg p-2"><div className="text-[10px] text-muted-foreground">Perimeter</div><div className="font-bold">{(perimeter/100).toFixed(2)}m</div></div>
              <div className="bg-muted rounded-lg p-2"><div className="text-[10px] text-muted-foreground">Items</div><div className="font-bold">{items.length}</div></div>
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-xs"><span>Flooring ({floorAreaM2.toFixed(1)} m² × $80)</span><span className="font-semibold">${floorCost.toFixed(0)}</span></div>
              <div className="flex justify-between text-xs"><span>Paint ({wallAreaM2.toFixed(1)} m² × $5)</span><span className="font-semibold">${paintCost.toFixed(0)}</span></div>
              <div className="flex justify-between text-sm font-bold border-t pt-2"><span>Estimated Total</span><span className="text-emerald-700">${totalCost.toFixed(0)}</span></div>
            </div>
          </div>
        </div>
      )}
      {open === "schedule" && (
        <div className="fixed bottom-20 left-6 z-40 w-80 max-h-[60vh] bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-2"><Table className="h-4 w-4" /><h3 className="font-bold text-sm">Door & Window Schedule</h3></div>
            <button onClick={() => setOpen(null)} className="p-1 rounded hover:bg-white/20"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold mb-2 text-muted-foreground">DOORS ({doors.length})</h4>
              {doors.length === 0 ? <p className="text-xs text-muted-foreground">No doors placed</p> : (
                <table className="w-full text-xs"><thead><tr className="border-b text-muted-foreground"><th className="text-left py-1">ID</th><th className="text-right py-1">Width</th></tr></thead>
                <tbody>{doors.map((d) => <tr key={d.id} className="border-b"><td className="py-1 font-mono">{d.id}</td><td className="text-right py-1">{(d.width/100).toFixed(2)}m</td></tr>)}</tbody></table>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold mb-2 text-muted-foreground">WINDOWS ({windows.length})</h4>
              {windows.length === 0 ? <p className="text-xs text-muted-foreground">No windows placed</p> : (
                <table className="w-full text-xs"><thead><tr className="border-b text-muted-foreground"><th className="text-left py-1">ID</th><th className="text-right py-1">Width</th></tr></thead>
                <tbody>{windows.map((w) => <tr key={w.id} className="border-b"><td className="py-1 font-mono">{w.id}</td><td className="text-right py-1">{(w.width/100).toFixed(2)}m</td></tr>)}</tbody></table>
              )}
            </div>
            <div className="border-t pt-3"><div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-muted rounded p-2"><div className="text-lg font-bold">{wallCount}</div><div className="text-[10px] text-muted-foreground">Walls</div></div>
              <div className="bg-muted rounded p-2"><div className="text-lg font-bold">{doorCount}</div><div className="text-[10px] text-muted-foreground">Doors</div></div>
              <div className="bg-muted rounded p-2"><div className="text-lg font-bold">{windowCount}</div><div className="text-[10px] text-muted-foreground">Windows</div></div>
            </div></div>
          </div>
        </div>
      )}
    </>
  );
}
