"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useEditorStore, type Wall, type PlacedItem } from "@/store/editor-store";
import { BASE_SCALE, getFurnitureById } from "@/lib/furniture";
import { formatMeasurement } from "@/lib/units";

// Convert cm to screen pixels
const cmToPx = (cm: number, zoom: number) => cm * BASE_SCALE * zoom;

interface DragState {
  type: "item" | "wall-end" | "wall-start" | "pan";
  id?: string;
  startMouseX: number;
  startMouseY: number;
  startData: any;
}

export function Canvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const dragRef = useRef<DragState | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const hoverRef = useRef<{ x: number; y: number } | null>(null);

  const project = useEditorStore((s) => s.project);
  const activeRoomId = useEditorStore((s) => s.project.activeRoomId);
  const room = useEditorStore((s) => s.project.rooms.find((r) => r.id === s.project.activeRoomId) || s.project.rooms[0]);
  const walls = room?.walls || [];
  const items = room?.items || [];
  const tool = useEditorStore((s) => s.tool);
  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectedType = useEditorStore((s) => s.selectedType);
  const wallStart = useEditorStore((s) => s.wallStart);

  const setTool = useEditorStore((s) => s.setTool);
  const setZoom = useEditorStore((s) => s.setZoom);
  const setPan = useEditorStore((s) => s.setPan);
  const select = useEditorStore((s) => s.select);
  const addWall = useEditorStore((s) => s.addWall);
  const updateWall = useEditorStore((s) => s.updateWall);
  const updateItem = useEditorStore((s) => s.updateItem);
  const addItem = useEditorStore((s) => s.addItem);
  const setWallStart = useEditorStore((s) => s.setWallStart);
  const removeWall = useEditorStore((s) => s.removeWall);
  const removeItem = useEditorStore((s) => s.removeItem);
  const duplicateItem = useEditorStore((s) => s.duplicateItem);
  const clearAll = useEditorStore((s) => s.clearAll);

  // AutoCAD features
  const osnap = useEditorStore((s) => s.osnap);
  const polarTracking = useEditorStore((s) => s.polarTracking);
  const dynamicInput = useEditorStore((s) => s.dynamicInput);
  const setCursorWorld = useEditorStore((s) => s.setCursorWorld);
  const setSnapIndicator = useEditorStore((s) => s.setSnapIndicator);

  // OSNAP: find nearest snap point
  const findSnapPoint = useCallback(
    (worldX: number, worldY: number): { x: number; y: number; type: string } | null => {
      const snapRadius = 20 / (BASE_SCALE * zoom); // 20px snap radius in world coords
      let bestDist = snapRadius;
      let bestSnap: { x: number; y: number; type: string } | null = null;

      for (const w of walls) {
        // Endpoint snap
        if (osnap.endpoint) {
          for (const [px, py] of [[w.x1, w.y1], [w.x2, w.y2]]) {
            const d = Math.hypot(worldX - px, worldY - py);
            if (d < bestDist) {
              bestDist = d;
              bestSnap = { x: px, y: py, type: "endpoint" };
            }
          }
        }
        // Midpoint snap
        if (osnap.midpoint) {
          const mx = (w.x1 + w.x2) / 2;
          const my = (w.y1 + w.y2) / 2;
          const d = Math.hypot(worldX - mx, worldY - my);
          if (d < bestDist) {
            bestDist = d;
            bestSnap = { x: mx, y: my, type: "midpoint" };
          }
        }
        // Nearest snap (on the line)
        if (osnap.nearest) {
          const dx = w.x2 - w.x1;
          const dy = w.y2 - w.y1;
          const len2 = dx * dx + dy * dy;
          if (len2 > 0) {
            let t = ((worldX - w.x1) * dx + (worldY - w.y1) * dy) / len2;
            t = Math.max(0, Math.min(1, t));
            const nx = w.x1 + t * dx;
            const ny = w.y1 + t * dy;
            const d = Math.hypot(worldX - nx, worldY - ny);
            if (d < bestDist) {
              bestDist = d;
              bestSnap = { x: nx, y: ny, type: "nearest" };
            }
          }
        }
      }

      // Item centers
      if (osnap.center) {
        for (const it of items) {
          const d = Math.hypot(worldX - it.x, worldY - it.y);
          if (d < bestDist) {
            bestDist = d;
            bestSnap = { x: it.x, y: it.y, type: "center" };
          }
        }
      }

      return bestSnap;
    },
    [walls, items, osnap, zoom]
  );

  // Polar tracking: constrain angle to nearest tracked angle
  const applyPolarTracking = useCallback(
    (startX: number, startY: number, endX: number, endY: number): { x: number; y: number } => {
      if (!polarTracking.enabled) return { x: endX, y: endY };
      const dx = endX - startX;
      const dy = endY - startY;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return { x: endX, y: endY };
      const angle = Math.atan2(-dy, dx) * 180 / Math.PI; // 0 = right, 90 = up
      const normalized = ((angle % 360) + 360) % 360;

      // Find nearest tracked angle
      let bestAngle = 0;
      let bestDiff = 5; // 5 degree tolerance
      for (const a of polarTracking.angles) {
        const diff = Math.min(Math.abs(normalized - a), 360 - Math.abs(normalized - a));
        if (diff < bestDiff) {
          bestDiff = diff;
          bestAngle = a;
        }
      }

      if (bestDiff < 5) {
        const rad = (bestAngle * Math.PI) / 180;
        return {
          x: startX + dist * Math.cos(rad),
          y: startY - dist * Math.sin(rad),
        };
      }
      return { x: endX, y: endY };
    },
    [polarTracking]
  );

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Convert screen -> world (cm)
  const screenToWorld = useCallback(
    (sx: number, sy: number) => {
      const x = (sx - panX) / (BASE_SCALE * zoom);
      const y = (sy - panY) / (BASE_SCALE * zoom);
      return { x, y };
    },
    [panX, panY, zoom]
  );

  // World -> screen
  const worldToScreen = useCallback(
    (wx: number, wy: number) => {
      return {
        x: wx * BASE_SCALE * zoom + panX,
        y: wy * BASE_SCALE * zoom + panY,
      };
    },
    [panX, panY, zoom]
  );

  // Hit testing
  const hitTest = useCallback(
    (sx: number, sy: number): { id: string; type: "wall" | "item" } | null => {
      // Items first (on top)
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        const f = getFurnitureById(it.furnitureId);
        if (!f) continue;
        const center = worldToScreen(it.x, it.y);
        const w = cmToPx(it.width, zoom);
        const d = cmToPx(it.depth, zoom);
        // Rotate point around center
        const dx = sx - center.x;
        const dy = sy - center.y;
        const rad = (-it.rotation * Math.PI) / 180;
        const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
        if (Math.abs(rx) <= w / 2 && Math.abs(ry) <= d / 2) {
          return { id: it.id, type: "item" };
        }
      }
      // Walls
      for (let i = walls.length - 1; i >= 0; i--) {
        const w = walls[i];
        const p1 = worldToScreen(w.x1, w.y1);
        const p2 = worldToScreen(w.x2, w.y2);
        const dist = pointToSegmentDist(sx, sy, p1.x, p1.y, p2.x, p2.y);
        const thickPx = Math.max(cmToPx(w.thickness, zoom), 8);
        if (dist <= thickPx / 2 + 4) {
          return { id: w.id, type: "wall" };
        }
      }
      return null;
    },
    [items, walls, zoom, worldToScreen]
  );

  // Hit test wall endpoints
  const hitTestWallEnd = useCallback(
    (sx: number, sy: number): { id: string; end: "start" | "end" } | null => {
      const r = 8;
      for (const w of walls) {
        const p1 = worldToScreen(w.x1, w.y1);
        const p2 = worldToScreen(w.x2, w.y2);
        if (Math.hypot(sx - p1.x, sy - p1.y) < r) return { id: w.id, end: "start" };
        if (Math.hypot(sx - p2.x, sy - p2.y) < r) return { id: w.id, end: "end" };
      }
      return null;
    },
    [walls, worldToScreen]
  );

  // ====== Drawing ======
  useEffect(() => {
    hoverRef.current = hover;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = "#FAFAF7";
    ctx.fillRect(0, 0, size.w, size.h);

    // Grid
    drawGrid(ctx, size.w, size.h, panX, panY, zoom);

    // Origin axis marker
    const origin = worldToScreen(0, 0);
    if (origin.x > -50 && origin.x < size.w + 50 && origin.y > -50 && origin.y < size.h + 50) {
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(origin.x, 0);
      ctx.lineTo(origin.x, size.h);
      ctx.moveTo(0, origin.y);
      ctx.lineTo(size.w, origin.y);
      ctx.stroke();
    }

    // Walls
    for (const w of walls) {
      drawWall(ctx, w, zoom, worldToScreen, selectedId === w.id);
    }

    // Wall preview (while drawing) — with polar tracking + OSNAP
    if ((tool === "wall" || tool === "door" || tool === "window") && wallStart && hoverRef.current) {
      const start = worldToScreen(wallStart.x, wallStart.y);
      const hover = hoverRef.current;
      // Get world coords of hover
      const hoverWorld = screenToWorld(hover.x, hover.y);
      // Apply OSNAP to hover
      const snapHover = findSnapPoint(hoverWorld.x, hoverWorld.y);
      let endWorld = snapHover ? { x: snapHover.x, y: snapHover.y } : hoverWorld;
      // Apply polar tracking
      endWorld = applyPolarTracking(wallStart.x, wallStart.y, endWorld.x, endWorld.y);
      const endScreen = worldToScreen(endWorld.x, endWorld.y);

      // Polar tracking guide lines (dotted infinite lines at tracked angles)
      if (polarTracking.enabled) {
        ctx.save();
        ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        for (const angle of polarTracking.angles) {
          const rad = (angle * Math.PI) / 180;
          const len = 2000;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(start.x + len * Math.cos(rad), start.y - len * Math.sin(rad));
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Wall preview line (CAD-style: rubber band line)
      ctx.strokeStyle = tool === "door" ? "#8B5CF6" : tool === "window" ? "#06B6D4" : "#0F766E";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(endScreen.x, endScreen.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Length + angle label (AutoCAD-style dynamic input on canvas)
      const len = Math.hypot(endWorld.x - wallStart.x, endWorld.y - wallStart.y);
      const angle = Math.atan2(-(endWorld.y - wallStart.y), endWorld.x - wallStart.x) * 180 / Math.PI;
      ctx.fillStyle = "#0F766E";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      const midX = (start.x + endScreen.x) / 2;
      const midY = (start.y + endScreen.y) / 2;
      ctx.fillText(`${formatMeasurement(len, unitSystem)} < ${angle.toFixed(1)}°`, midX, midY - 10);
      ctx.textAlign = "left";

      // Start point marker
      ctx.fillStyle = "#0F766E";
      ctx.beginPath();
      ctx.arc(start.x, start.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // End point marker (rubber band endpoint)
      ctx.strokeStyle = "#0F766E";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(endScreen.x, endScreen.y, 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Polar tracking cursor crosshair (when not drawing)
    if (polarTracking.enabled && !wallStart && hoverRef.current && (tool === "wall" || tool === "door" || tool === "window")) {
      const h = hoverRef.current;
      ctx.save();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      // Horizontal and vertical crosshair through cursor
      ctx.beginPath();
      ctx.moveTo(0, h.y);
      ctx.lineTo(size.w, h.y);
      ctx.moveTo(h.x, 0);
      ctx.lineTo(h.x, size.h);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Items
    for (const it of items) {
      drawItem(ctx, it, zoom, worldToScreen, selectedId === it.id);
    }

    // Scale ruler (bottom-left)
    drawScaleRuler(ctx, size.w, size.h, zoom);
  }, [walls, items, size, zoom, panX, panY, selectedId, tool, wallStart, hover, worldToScreen]);

  // ====== Mouse handlers ======
  const onMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = screenToWorld(sx, sy);

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Pan
      dragRef.current = { type: "pan", startMouseX: sx, startMouseY: sy, startData: { panX, panY } };
      return;
    }

    if (tool === "wall" || tool === "door" || tool === "window") {
      // OSNAP first, then grid snap
      const osnapResult = findSnapPoint(world.x, world.y);
      let snapped: { x: number; y: number };
      if (osnapResult) {
        snapped = { x: osnapResult.x, y: osnapResult.y };
      } else {
        snapped = snap(world.x, world.y);
      }
      if (!wallStart) {
        setWallStart(snapped);
      } else {
        // Apply polar tracking
        const polar = applyPolarTracking(wallStart.x, wallStart.y, snapped.x, snapped.y);
        snapped = polar;
        // Finish wall
        const thickness = tool === "wall" ? 15 : tool === "door" ? 10 : 10;
        const height = tool === "wall" ? 270 : 210;
        addWall({
          x1: wallStart.x,
          y1: wallStart.y,
          x2: snapped.x,
          y2: snapped.y,
          thickness,
          height,
          type: tool === "wall" ? "wall" : tool,
        });
        // Reset (no chaining — toggle behavior)
        setWallStart(null);
      }
      return;
    }

    // Select tool
    // Check wall endpoints first (for resizing)
    const wallEnd = hitTestWallEnd(sx, sy);
    if (wallEnd && selectedId === wallEnd.id) {
      const w = walls.find((x) => x.id === wallEnd.id)!;
      dragRef.current = {
        type: wallEnd.end === "start" ? "wall-start" : "wall-end",
        id: wallEnd.id,
        startMouseX: sx,
        startMouseY: sy,
        startData: { wall: { ...w } },
      };
      return;
    }

    const hit = hitTest(sx, sy);
    if (hit) {
      select(hit.id, hit.type);
      if (hit.type === "item") {
        const it = items.find((i) => i.id === hit.id)!;
        dragRef.current = {
          type: "item",
          id: hit.id,
          startMouseX: sx,
          startMouseY: sy,
          startData: { item: { ...it } },
        };
      }
    } else {
      select(null, null);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = screenToWorld(sx, sy);
    hoverRef.current = { x: sx, y: sy };
    setHover({ x: sx, y: sy });

    // Update cursor world position for dynamic input
    setCursorWorld({ x: world.x, y: world.y });

    // Update snap indicator
    const snapPt = findSnapPoint(world.x, world.y);
    if (snapPt) {
      const screenPt = worldToScreen(snapPt.x, snapPt.y);
      setSnapIndicator({ x: screenPt.x, y: screenPt.y, type: snapPt.type });
    } else {
      setSnapIndicator(null);
    }

    const drag = dragRef.current;
    if (!drag) return;

    if (drag.type === "pan") {
      const dx = sx - drag.startMouseX;
      const dy = sy - drag.startMouseY;
      setPan(drag.startData.panX + dx, drag.startData.panY + dy);
      return;
    }

    if (drag.type === "item" && drag.id) {
      const dx = (sx - drag.startMouseX) / (BASE_SCALE * zoom);
      const dy = (sy - drag.startMouseY) / (BASE_SCALE * zoom);
      const snapped = snap(drag.startData.item.x + dx, drag.startData.item.y + dy, 5);
      updateItem(drag.id, { x: snapped.x, y: snapped.y });
      return;
    }

    if (drag.type === "wall-start" && drag.id) {
      const snapped = snap(world.x, world.y);
      updateWall(drag.id, { x1: snapped.x, y1: snapped.y });
      return;
    }
    if (drag.type === "wall-end" && drag.id) {
      const snapped = snap(world.x, world.y);
      updateWall(drag.id, { x2: snapped.x, y2: snapped.y });
      return;
    }
  };

  const onMouseUp = () => {
    if (dragRef.current && (dragRef.current.type === "item" || dragRef.current.type?.startsWith("wall"))) {
      // Push history on drag end via update (already done in add). For moves, push history.
      useEditorStore.getState().pushHistory();
    }
    dragRef.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const delta = -e.deltaY * 0.001;
    const newZoom = Math.max(0.2, Math.min(3, zoom * (1 + delta)));
    // Zoom around mouse
    const wx = (mx - panX) / (BASE_SCALE * zoom);
    const wy = (my - panY) / (BASE_SCALE * zoom);
    const newPanX = mx - wx * BASE_SCALE * newZoom;
    const newPanY = my - wy * BASE_SCALE * newZoom;
    setZoom(newZoom);
    setPan(newPanX, newPanY);
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && selectedType === "wall") removeWall(selectedId);
        else if (selectedId && selectedType === "item") removeItem(selectedId);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedId && selectedType === "item") {
        e.preventDefault();
        duplicateItem(selectedId);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        useEditorStore.getState().undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
        e.preventDefault();
        useEditorStore.getState().redo();
      } else if (e.key === "Escape") {
        setWallStart(null);
        select(null, null);
        setTool("select");
      } else if (e.key === "r" && selectedId && selectedType === "item") {
        const it = items.find((i) => i.id === selectedId);
        if (it) updateItem(selectedId, { rotation: (it.rotation + 15) % 360 });
      } else if (e.key === "1") setTool("select");
      else if (e.key === "2") setTool("wall");
      else if (e.key === "3") setTool("door");
      else if (e.key === "4") setTool("window");
      // AutoCAD command shortcuts
      else if (e.key === "l" || e.key === "L") setTool("wall");
      else if (e.key === "c" || e.key === "C") setTool("circle");
      else if (e.key === "a" || e.key === "A") setTool("curve");
      else if (e.key === "d" || e.key === "D") setTool("dimension");
      else if (e.key === "t" || e.key === "T") setTool("text");
      else if (e.key === "Escape") { setTool("select"); setWallStart(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, selectedType, items, removeWall, removeItem, duplicateItem, setWallStart, select, setTool, updateItem]);

  // Allow drop from furniture panel
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const furnitureId = e.dataTransfer.getData("text/furniture-id");
    if (!furnitureId) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = screenToWorld(sx, sy);
    // addItem auto-selects the new item. Also switch to select tool.
    setTool("select");
    addItem(furnitureId, world.x, world.y);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: tool === "select" ? "default" : "crosshair" }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="block"
      />
      {/* Tool hint overlay */}
      {(tool === "wall" || tool === "door" || tool === "window") && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-700 text-white px-4 py-1.5 rounded-full text-xs shadow-lg pointer-events-none">
          {tool === "wall" ? "Click to start a wall, click again to finish. Esc to stop." : `Click to place ${tool} opening`}
        </div>
      )}
    </div>
  );
}

// ====== Helpers ======
function snap(x: number, y: number, grid = 10) {
  return {
    x: Math.round(x / grid) * grid,
    y: Math.round(y / grid) * grid,
  };
}

function pointToSegmentDist(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, panX: number, panY: number, zoom: number) {
  const step = 50 * BASE_SCALE * zoom; // 50cm grid
  const majorStep = step * 5; // 2.5m major
  ctx.lineWidth = 1;
  // Minor
  ctx.strokeStyle = "rgba(0,0,0,0.04)";
  ctx.beginPath();
  for (let x = panX % step; x < w; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = panY % step; y < h; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
  // Major
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  for (let x = panX % majorStep; x < w; x += majorStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = panY % majorStep; y < h; y += majorStep) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
}

function drawWall(
  ctx: CanvasRenderingContext2D,
  w: Wall,
  zoom: number,
  worldToScreen: (x: number, y: number) => { x: number; y: number },
  selected: boolean
) {
  const p1 = worldToScreen(w.x1, w.y1);
  const p2 = worldToScreen(w.x2, w.y2);
  const thickPx = Math.max(cmToPx(w.thickness, zoom), 4);

  ctx.save();
  if (w.type === "door") {
    // Draw door as opening with arc
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
    // Arc indicating door swing
    const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    if (len > 1) {
      const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, len, ang, ang - Math.PI / 2, true);
      ctx.stroke();
    }
  } else if (w.type === "window") {
    // Window: parallel lines
    ctx.strokeStyle = "#06B6D4";
    ctx.lineWidth = 2;
    const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const perp = ang + Math.PI / 2;
    const off = thickPx / 2;
    ctx.beginPath();
    ctx.moveTo(p1.x + Math.cos(perp) * off, p1.y + Math.sin(perp) * off);
    ctx.lineTo(p2.x + Math.cos(perp) * off, p2.y + Math.sin(perp) * off);
    ctx.moveTo(p1.x - Math.cos(perp) * off, p1.y - Math.sin(perp) * off);
    ctx.lineTo(p2.x - Math.cos(perp) * off, p2.y - Math.sin(perp) * off);
    ctx.stroke();
    // Center line
    ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    // Solid wall
    ctx.strokeStyle = selected ? "#0F766E" : "#3F3F46";
    ctx.lineWidth = thickPx;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // Selected: draw endpoints
  if (selected) {
    ctx.fillStyle = "#0F766E";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    for (const p of [p1, p2]) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // Length label
    const len = Math.hypot(w.x2 - w.x1, w.y2 - w.y1);
    const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    ctx.fillStyle = "#0F766E";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round(len)} cm`, mid.x, mid.y - 10);
    ctx.textAlign = "left";
  }
  ctx.restore();
}

function drawItem(
  ctx: CanvasRenderingContext2D,
  it: PlacedItem,
  zoom: number,
  worldToScreen: (x: number, y: number) => { x: number; y: number },
  selected: boolean
) {
  const f = getFurnitureById(it.furnitureId);
  if (!f) return;
  const center = worldToScreen(it.x, it.y);
  const w = cmToPx(it.width, zoom);
  const d = cmToPx(it.depth, zoom);
  const shape = f.shape || "box";

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate((it.rotation * Math.PI) / 180);

  // Round shapes (round tables, plants, cylinders)
  const isRound = shape === "plant" || shape === "cylinder" || shape === "sphere" ||
    (shape === "table" && (f.id === "coffee-round" || f.id === "dining-table-round" || f.id === "patio-table-round"));

  if (isRound) {
    const r = Math.min(w, d) / 2;
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.beginPath();
    ctx.arc(2, 2, r, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillStyle = it.color;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    // Border
    ctx.strokeStyle = selected ? "#0F766E" : "rgba(0,0,0,0.3)";
    ctx.lineWidth = selected ? 2.5 : 1;
    ctx.stroke();
  } else if (shape === "rug") {
    // Rug: dashed outline only, semi-transparent fill
    ctx.fillStyle = it.color + "55";
    ctx.fillRect(-w / 2, -d / 2, w, d);
    ctx.strokeStyle = it.color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(-w / 2, -d / 2, w, d);
    ctx.setLineDash([]);
  } else if (shape === "lamp") {
    // Lamp: small circle (base) with star burst
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(-w / 2 + 2, -d / 2 + 2, w, d);
    ctx.fillStyle = it.color;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(w, d) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = selected ? "#0F766E" : "rgba(0,0,0,0.3)";
    ctx.lineWidth = selected ? 2.5 : 1;
    ctx.stroke();
  } else {
    // Default box
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(-w / 2 + 2, -d / 2 + 2, w, d);
    // Body
    ctx.fillStyle = it.color;
    ctx.fillRect(-w / 2, -d / 2, w, d);
    // Border
    ctx.strokeStyle = selected ? "#0F766E" : "rgba(0,0,0,0.3)";
    ctx.lineWidth = selected ? 2.5 : 1;
    ctx.strokeRect(-w / 2, -d / 2, w, d);

    // Shape-specific accents
    if (shape === "sofa") {
      // Back cushion line
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 4, -d / 2 + 6);
      ctx.lineTo(w / 2 - 4, -d / 2 + 6);
      ctx.stroke();
      // Seat divisions
      const seats = Math.max(2, Math.round(w / 70));
      for (let i = 1; i < seats; i++) {
        const x = -w / 2 + (w * i) / seats;
        ctx.beginPath();
        ctx.moveTo(x, -d / 2 + 6);
        ctx.lineTo(x, d / 2 - 4);
        ctx.stroke();
      }
    } else if (shape === "bed") {
      // Pillow rectangles at the "head" (top)
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      const pw = w / 2 - 8;
      const ph = Math.min(20, d / 4);
      ctx.fillRect(-w / 2 + 4, -d / 2 + 4, pw, ph);
      ctx.fillRect(4, -d / 2 + 4, pw, ph);
      // Blanket line
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-w / 2, d / 2 - ph - 4);
      ctx.lineTo(w / 2, d / 2 - ph - 4);
      ctx.stroke();
    } else if (shape === "toilet") {
      // Oval seat
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.ellipse(0, d / 4, w / 2 - 4, d / 4, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === "bathtub") {
      // Inner basin
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 6, -d / 2 + 6, w - 12, d - 12, 8);
      ctx.fill();
      // Drain
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.arc(w / 4, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === "table") {
      // Wood grain lines
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 3; i++) {
        const y = -d / 2 + (d * (i + 1)) / 4;
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 4, y);
        ctx.lineTo(w / 2 - 4, y);
        ctx.stroke();
      }
    } else if (shape === "wardrobe" || shape === "shelf") {
      // Door/shelf divisions
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 1;
      const shelves = shape === "shelf" ? Math.max(2, Math.round(d / 30)) : 2;
      for (let i = 1; i < shelves; i++) {
        const x = -w / 2 + (w * i) / shelves;
        ctx.beginPath();
        ctx.moveTo(x, -d / 2 + 2);
        ctx.lineTo(x, d / 2 - 2);
        ctx.stroke();
      }
      if (shape === "wardrobe") {
        // Door handles
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.arc(-2, 0, 1.5, 0, Math.PI * 2);
        ctx.arc(2, 0, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (shape === "counter") {
      // Countertop edge
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2 + 2, -d / 2 + 2, w - 4, d - 4);
    } else if (shape === "fridge") {
      // Door split line
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      ctx.lineTo(w / 2, 0);
      ctx.stroke();
      // Handle
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(w / 2 - 4, -d / 2 + 4, 2, d / 3);
    } else if (shape === "stove") {
      // 4 burners
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      for (const [bx, by] of [[-w / 4, -d / 4], [w / 4, -d / 4], [-w / 4, d / 4], [w / 4, d / 4]]) {
        ctx.beginPath();
        ctx.arc(bx, by, Math.min(w, d) / 8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (shape === "tv") {
      // Screen highlight
      ctx.strokeStyle = "rgba(100,200,255,0.6)";
      ctx.lineWidth = 1;
      ctx.strokeRect(-w / 2 + 2, -d / 2 + 2, w - 4, d - 4);
    }
  }

  // Direction indicator (small triangle pointing "up" = front)
  if (shape !== "rug" && shape !== "lamp" && !isRound) {
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.moveTo(0, -d / 2 + Math.min(8, d / 4));
    ctx.lineTo(-Math.min(5, w / 6), -d / 2 + Math.min(14, d / 3));
    ctx.lineTo(Math.min(5, w / 6), -d / 2 + Math.min(14, d / 3));
    ctx.closePath();
    ctx.fill();
  }

  // Label
  if (w > 30 && d > 20) {
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = `${Math.min(11, w / 6)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(f.icon, 0, 0);
  }

  ctx.restore();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // Name label when selected
  if (selected) {
    ctx.fillStyle = "#0F766E";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(f.name, center.x, center.y + d / 2 + 14);
    ctx.textAlign = "left";
  }
}

function drawScaleRuler(ctx: CanvasRenderingContext2D, w: number, h: number, zoom: number) {
  // 1 meter ruler
  const meterPx = 100 * BASE_SCALE * zoom;
  const x = 20;
  const y = h - 30;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(x, y, meterPx, 2);
  ctx.fillRect(x, y - 4, 1, 8);
  ctx.fillRect(x + meterPx, y - 4, 1, 8);
  ctx.font = "10px sans-serif";
  ctx.fillText("1 m", x + meterPx + 6, y + 4);
}
