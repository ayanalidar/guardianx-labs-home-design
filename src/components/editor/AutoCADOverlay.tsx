"use client";

import { useEditorStore } from "@/store/editor-store";
import { formatMeasurement } from "@/lib/units";
import { useEffect, useState } from "react";

/**
 * AutoCAD-style overlays:
 * 1. Dynamic input box near cursor (shows coordinates + length)
 * 2. Command line at the bottom
 * 3. OSNAP/Polar tracking indicators
 */
export function AutoCADOverlay() {
  const cursorWorld = useEditorStore((s) => s.cursorWorld);
  const commandLine = useEditorStore((s) => s.commandLine);
  const commandActive = useEditorStore((s) => s.commandActive);
  const setCommandLine = useEditorStore((s) => s.setCommandLine);
  const setCommandActive = useEditorStore((s) => s.setCommandActive);
  const dynamicInput = useEditorStore((s) => s.dynamicInput);
  const unitSystem = useEditorStore((s) => s.unitSystem);
  const tool = useEditorStore((s) => s.tool);
  const wallStart = useEditorStore((s) => s.wallStart);
  const snapIndicator = useEditorStore((s) => s.snapIndicator);
  const setTool = useEditorStore((s) => s.setTool);
  const hover = useEditorStore((s) => s.hover);

  // Command line input
  const [cmdInput, setCmdInput] = useState("");

  const executeCommand = (cmd: string) => {
    const c = cmd.trim().toLowerCase();
    switch (c) {
      case "l":
      case "line":
        setTool("wall");
        break;
      case "c":
      case "circle":
        setTool("circle");
        break;
      case "a":
      case "arc":
        setTool("curve");
        break;
      case "d":
      case "door":
        setTool("door");
        break;
      case "w":
      case "window":
        setTool("window");
        break;
      case "t":
      case "text":
        setTool("text");
        break;
      case "di":
      case "dimension":
        setTool("dimension");
        break;
      case "h":
      case "hatch":
        setTool("rect");
        break;
      case "co":
      case "copy":
        setTool("copy");
        break;
      case "m":
      case "move":
        setTool("select");
        break;
      case "ro":
      case "rotate":
        break;
      case "ar":
      case "array":
        setTool("copy");
        break;
      case "tr":
      case "trim":
        break;
      case "ex":
      case "extend":
        break;
      case "f":
      case "fillet":
        break;
      case "o":
      case "offset":
        setTool("offset");
        break;
      case "mi":
      case "mirror":
        break;
      case "s":
      case "select":
        setTool("select");
        break;
      case "esc":
        setTool("select");
        break;
    }
    setCommandActive(false);
    setCmdInput("");
  };

  // Dynamic input — show near cursor
  const dynamicInputText = (() => {
    if (!cursorWorld) return null;
    const xText = formatMeasurement(Math.abs(cursorWorld.x), unitSystem);
    const yText = formatMeasurement(Math.abs(cursorWorld.y), unitSystem);
    if (wallStart && tool === "wall") {
      const dx = cursorWorld.x - wallStart.x;
      const dy = cursorWorld.y - wallStart.y;
      const len = Math.hypot(dx, dy);
      const angle = Math.atan2(-dy, dx) * 180 / Math.PI;
      return `${formatMeasurement(len, unitSystem)} < ${angle.toFixed(1)}°`;
    }
    return `${xText}, ${yText}`;
  })();

  return (
    <>
      {/* Dynamic input tooltip near cursor */}
      {dynamicInput && dynamicInputText && hover && (
        <div
          className="absolute pointer-events-none z-30 bg-yellow-300 text-black text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm border border-yellow-600"
          style={{
            left: hover.x + 15,
            top: hover.y - 20,
          }}
        >
          {dynamicInputText}
        </div>
      )}

      {/* OSNAP indicator */}
      {snapIndicator && hover && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: snapIndicator.x - 8,
            top: snapIndicator.y - 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 0 L8 16 M0 8 L16 8" stroke="#FFD700" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

      {/* Command line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gray-900 text-green-400 font-mono text-xs flex items-center px-3 h-7 border-t border-gray-700">
        <span className="text-gray-500 mr-2">Command:</span>
        {commandActive ? (
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") executeCommand(cmdInput);
              if (e.key === "Escape") {
                setCommandActive(false);
                setCmdInput("");
              }
            }}
            onBlur={() => {
              if (cmdInput) executeCommand(cmdInput);
              else setCommandActive(false);
            }}
            autoFocus
            className="flex-1 bg-transparent text-green-400 outline-none"
            placeholder="Type command (L=Line, C=Circle, A=Arc, D=Door, W=Window, CO=Copy, O=Offset, DI=Dimension, T=Text...)"
          />
        ) : (
          <button
            onClick={() => setCommandActive(true)}
            className="flex-1 text-left text-gray-500 hover:text-green-400"
          >
            {commandLine || "Click here or press a key to type a command..."}
          </button>
        )}
        <span className="text-gray-600 ml-3 text-[10px]">
          {tool === "wall" ? "LINE" : tool === "select" ? "SELECT" : tool.toUpperCase()}
        </span>
      </div>
    </>
  );
}
