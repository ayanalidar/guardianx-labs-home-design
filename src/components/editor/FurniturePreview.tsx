"use client";

import type { FurnitureItem } from "@/lib/furniture";

interface PreviewProps {
  item: FurnitureItem;
  size?: number; // pixel size of the square preview
}

/**
 * Renders a top-down SVG preview of a furniture item,
 * scaled to fit within a square of `size` pixels.
 * Each shape type gets a realistic top-down representation.
 */
export function FurniturePreview({ item, size = 80 }: PreviewProps) {
  // Determine the SVG viewBox based on aspect ratio
  const aspect = item.width / item.depth;
  const pad = 4;
  const inner = size - pad * 2;

  let vbW: number, vbH: number;
  if (aspect >= 1) {
    vbW = 100;
    vbH = 100 / aspect;
  } else {
    vbH = 100;
    vbW = 100 * aspect;
  }
  // Pad the viewBox
  const vpad = Math.max(vbW, vbH) * 0.08;
  const fullVbW = vbW + vpad * 2;
  const fullVbH = vbH + vpad * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${fullVbW} ${fullVbH}`}
      className="block"
    >
      <g transform={`translate(${vpad}, ${vpad})`}>
        {renderShape(item, vbW, vbH)}
      </g>
    </svg>
  );
}

function renderShape(f: FurnitureItem, w: number, d: number) {
  const shape = f.shape || "box";
  const c = f.color;
  const dark = darken(c, 0.3);
  const light = lighten(c, 0.2);

  switch (shape) {
    case "sofa":
      return (
        <g>
          {/* Base */}
          <rect x={0} y={0} width={w} height={d} rx={4} fill={c} stroke={dark} strokeWidth={1} />
          {/* Back cushion strip */}
          <rect x={2} y={2} width={w - 4} height={d * 0.2} rx={2} fill={darken(c, 0.1)} />
          {/* Seat cushions */}
          {renderCushions(w, d, c, dark)}
          {/* Arms */}
          <rect x={0} y={d * 0.2} width={w * 0.06} height={d * 0.8} fill={darken(c, 0.15)} />
          <rect x={w - w * 0.06} y={d * 0.2} width={w * 0.06} height={d * 0.8} fill={darken(c, 0.15)} />
        </g>
      );

    case "bed":
      return (
        <g>
          {/* Frame */}
          <rect x={0} y={0} width={w} height={d} rx={3} fill={darken(c, 0.25)} stroke={dark} strokeWidth={1} />
          {/* Mattress */}
          <rect x={2} y={d * 0.12} width={w - 4} height={d * 0.86} rx={2} fill={c} stroke={darken(c, 0.1)} strokeWidth={0.5} />
          {/* Pillows at head (top) */}
          <rect x={w * 0.05} y={d * 0.04} width={w * 0.42} height={d * 0.14} rx={3} fill="#FAFAFA" stroke="#E0E0E0" strokeWidth={0.5} />
          <rect x={w * 0.53} y={d * 0.04} width={w * 0.42} height={d * 0.14} rx={3} fill="#FAFAFA" stroke="#E0E0E0" strokeWidth={0.5} />
          {/* Blanket line */}
          <line x1={2} y1={d * 0.6} x2={w - 2} y2={d * 0.6} stroke={darken(c, 0.2)} strokeWidth={1} strokeDasharray="3 2" />
        </g>
      );

    case "chair":
      return (
        <g>
          {/* Seat */}
          <rect x={0} y={d * 0.15} width={w} height={d * 0.7} rx={3} fill={c} stroke={dark} strokeWidth={1} />
          {/* Backrest (top edge) */}
          <rect x={0} y={0} width={w} height={d * 0.15} rx={2} fill={darken(c, 0.2)} />
          {/* Legs (small dots at corners) */}
          <circle cx={w * 0.1} cy={d * 0.9} r={1.5} fill="#3E2723" />
          <circle cx={w * 0.9} cy={d * 0.9} r={1.5} fill="#3E2723" />
        </g>
      );

    case "table": {
      const isRound = f.id === "coffee-round" || f.id === "dining-table-round" || f.id === "patio-table-round";
      if (isRound) {
        const r = Math.min(w, d) / 2;
        const cx = w / 2, cy = d / 2;
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill={c} stroke={dark} strokeWidth={1} />
            {/* Wood grain */}
            <line x1={cx - r * 0.7} y1={cy} x2={cx + r * 0.7} y2={cy} stroke={darken(c, 0.15)} strokeWidth={0.5} />
            <line x1={cx} y1={cy - r * 0.7} x2={cx} y2={cy + r * 0.7} stroke={darken(c, 0.15)} strokeWidth={0.5} />
          </g>
        );
      }
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          {/* Wood grain lines */}
          <line x1={2} y1={d * 0.25} x2={w - 2} y2={d * 0.25} stroke={darken(c, 0.12)} strokeWidth={0.5} />
          <line x1={2} y1={d * 0.5} x2={w - 2} y2={d * 0.5} stroke={darken(c, 0.12)} strokeWidth={0.5} />
          <line x1={2} y1={d * 0.75} x2={w - 2} y2={d * 0.75} stroke={darken(c, 0.12)} strokeWidth={0.5} />
        </g>
      );
    }

    case "rug":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={1} fill={c} fillOpacity={0.3} stroke={c} strokeWidth={1.5} strokeDasharray="4 2" />
          {/* Inner border */}
          <rect x={3} y={3} width={w - 6} height={d - 6} rx={1} fill="none" stroke={c} strokeWidth={0.5} strokeOpacity={0.5} />
        </g>
      );

    case "plant": {
      const r = Math.min(w, d) / 2;
      const cx = w / 2, cy = d / 2;
      return (
        <g>
          {/* Pot */}
          <circle cx={cx} cy={cy} r={r * 0.5} fill="#8B6F47" stroke="#6D4C41" strokeWidth={0.5} />
          {/* Foliage */}
          <circle cx={cx} cy={cy} r={r * 0.95} fill={c} fillOpacity={0.8} stroke={darken(c, 0.2)} strokeWidth={0.5} />
          {/* Leaf highlights */}
          <circle cx={cx - r * 0.3} cy={cy - r * 0.2} r={r * 0.25} fill={lighten(c, 0.15)} fillOpacity={0.6} />
          <circle cx={cx + r * 0.25} cy={cy + r * 0.15} r={r * 0.2} fill={lighten(c, 0.1)} fillOpacity={0.5} />
        </g>
      );
    }

    case "lamp": {
      const r = Math.min(w, d) / 2;
      const cx = w / 2, cy = d / 2;
      return (
        <g>
          {/* Glow */}
          <circle cx={cx} cy={cy} r={r * 1.1} fill={c} fillOpacity={0.15} />
          {/* Base */}
          <circle cx={cx} cy={cy} r={r * 0.7} fill={c} stroke={dark} strokeWidth={1} />
          {/* Bulb center */}
          <circle cx={cx} cy={cy} r={r * 0.3} fill={lighten(c, 0.4)} />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={cx + Math.cos(rad) * r * 0.75}
                y1={cy + Math.sin(rad) * r * 0.75}
                x2={cx + Math.cos(rad) * r * 0.95}
                y2={cy + Math.sin(rad) * r * 0.95}
                stroke={c}
                strokeWidth={1}
              />
            );
          })}
        </g>
      );
    }

    case "tv":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={1} fill="#1A1A1A" stroke="#333" strokeWidth={0.5} />
          {/* Screen glow */}
          <rect x={1} y={0.5} width={w - 2} height={d - 1} fill="#1a2a3a" stroke="#3a5a7a" strokeWidth={0.5} />
          {/* Stand line */}
          <line x1={w / 2 - 3} y1={d - 0.5} x2={w / 2 + 3} y2={d - 0.5} stroke="#555" strokeWidth={1} />
        </g>
      );

    case "toilet":
      return (
        <g>
          {/* Tank */}
          <rect x={w * 0.15} y={0} width={w * 0.7} height={d * 0.3} rx={2} fill={c} stroke={dark} strokeWidth={0.5} />
          {/* Bowl (oval) */}
          <ellipse cx={w / 2} cy={d * 0.6} rx={w * 0.4} ry={d * 0.38} fill={c} stroke={dark} strokeWidth={0.5} />
          {/* Seat inner */}
          <ellipse cx={w / 2} cy={d * 0.6} rx={w * 0.3} ry={d * 0.28} fill="none" stroke={darken(c, 0.15)} strokeWidth={0.5} />
        </g>
      );

    case "bathtub":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={6} fill={c} stroke={dark} strokeWidth={1} />
          {/* Inner basin */}
          <rect x={4} y={4} width={w - 8} height={d - 8} rx={4} fill="none" stroke={darken(c, 0.15)} strokeWidth={1} />
          {/* Drain */}
          <circle cx={w * 0.8} cy={d / 2} r={2} fill={darken(c, 0.3)} />
          {/* Faucet */}
          <rect x={w * 0.05} y={d / 2 - 2} width={4} height={4} rx={1} fill="#888" />
        </g>
      );

    case "sink":
      return (
        <g>
          {/* Counter */}
          <rect x={0} y={0} width={w} height={d} rx={2} fill={darken(c, 0.1)} stroke={dark} strokeWidth={0.5} />
          {/* Basin */}
          <ellipse cx={w / 2} cy={d / 2} rx={w * 0.35} ry={d * 0.35} fill="#E5E5E5" stroke="#999" strokeWidth={0.5} />
          {/* Faucet */}
          <rect x={w / 2 - 1.5} y={d * 0.1} width={3} height={d * 0.15} rx={1} fill="#888" />
        </g>
      );

    case "fridge":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          {/* Door split */}
          <line x1={0} y1={d * 0.4} x2={w} y2={d * 0.4} stroke={darken(c, 0.2)} strokeWidth={1} />
          {/* Handles */}
          <rect x={w - 3} y={d * 0.1} width={1.5} height={d * 0.25} rx={0.5} fill="#37474F" />
          <rect x={w - 3} y={d * 0.5} width={1.5} height={d * 0.3} rx={0.5} fill="#37474F" />
        </g>
      );

    case "stove":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          {/* 4 burners */}
          {[
            [w * 0.25, d * 0.25],
            [w * 0.75, d * 0.25],
            [w * 0.25, d * 0.75],
            [w * 0.75, d * 0.75],
          ].map(([bx, by], i) => (
            <circle key={i} cx={bx} cy={by} r={Math.min(w, d) * 0.12} fill="#1A1A1A" stroke="#444" strokeWidth={0.5} />
          ))}
        </g>
      );

    case "washing":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          {/* Door (circular glass) */}
          <circle cx={w / 2} cy={d / 2} r={Math.min(w, d) * 0.3} fill="#90A4AE" fillOpacity={0.5} stroke="#555" strokeWidth={1} />
          <circle cx={w / 2} cy={d / 2} r={Math.min(w, d) * 0.22} fill="none" stroke="#666" strokeWidth={0.5} />
        </g>
      );

    case "shelf":
    case "wardrobe":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={1} fill={c} stroke={dark} strokeWidth={1} />
          {/* Shelf divisions */}
          {shape === "shelf" ? (
            <>
              <line x1={0} y1={d * 0.33} x2={w} y2={d * 0.33} stroke={darken(c, 0.25)} strokeWidth={0.5} />
              <line x1={0} y1={d * 0.66} x2={w} y2={d * 0.66} stroke={darken(c, 0.25)} strokeWidth={0.5} />
              <line x1={w / 2} y1={0} x2={w / 2} y2={d} stroke={darken(c, 0.15)} strokeWidth={0.5} />
            </>
          ) : (
            <>
              {/* Wardrobe: vertical door split */}
              <line x1={w / 2} y1={0} x2={w / 2} y2={d} stroke={darken(c, 0.25)} strokeWidth={1} />
              {/* Handles */}
              <circle cx={w / 2 - 2} cy={d / 2} r={1} fill="#37474F" />
              <circle cx={w / 2 + 2} cy={d / 2} r={1} fill="#37474F" />
            </>
          )}
        </g>
      );

    case "counter":
      return (
        <g>
          {/* Cabinet body */}
          <rect x={0} y={0} width={w} height={d} rx={1} fill={c} stroke={dark} strokeWidth={0.5} />
          {/* Countertop (slightly darker outline) */}
          <rect x={1} y={1} width={w - 2} height={d - 2} rx={0.5} fill="none" stroke="#37474F" strokeWidth={1} />
          {/* Door divisions */}
          <line x1={w / 2} y1={0} x2={w / 2} y2={d} stroke={darken(c, 0.2)} strokeWidth={0.5} />
        </g>
      );

    case "cylinder": {
      const r = Math.min(w, d) / 2;
      const cx = w / 2, cy = d / 2;
      return (
        <g>
          <circle cx={cx} cy={cy} r={r} fill={c} stroke={dark} strokeWidth={1} />
          <ellipse cx={cx} cy={cy - r * 0.3} rx={r * 0.7} ry={r * 0.2} fill={lighten(c, 0.15)} fillOpacity={0.5} />
        </g>
      );
    }

    case "sphere": {
      const r = Math.min(w, d) / 2;
      const cx = w / 2, cy = d / 2;
      return (
        <g>
          <circle cx={cx} cy={cy} r={r} fill={c} stroke={dark} strokeWidth={1} />
          <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.3} fill={lighten(c, 0.3)} fillOpacity={0.6} />
        </g>
      );
    }

    default:
      // Default box
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          {/* Top highlight */}
          <rect x={1} y={1} width={w - 2} height={d * 0.3} rx={1} fill={lighten(c, 0.15)} fillOpacity={0.4} />
        </g>
      );
  }
}

function renderCushions(w: number, d: number, c: string, dark: string) {
  // Determine number of cushions based on width
  const seats = Math.max(2, Math.round(w / 70));
  const cushionW = w / seats;
  const elements = [];
  for (let i = 0; i < seats; i++) {
    const x = i * cushionW + 2;
    elements.push(
      <rect
        key={i}
        x={x}
        y={d * 0.3}
        width={cushionW - 4}
        height={d * 0.55}
        rx={2}
        fill={lighten(c, 0.05)}
        stroke={darken(c, 0.1)}
        strokeWidth={0.5}
      />
    );
  }
  return elements;
}

// Color utilities
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return "#" + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}
