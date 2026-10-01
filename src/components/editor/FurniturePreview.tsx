"use client";

import type { FurnitureItem } from "@/lib/furniture";

interface PreviewProps {
  item: FurnitureItem;
  size?: number;
  imageUrl?: string; // optional real product photo
}

/**
 * Renders a furniture preview:
 * - If imageUrl is provided, shows the real product photo
 * - Otherwise, falls back to a top-down SVG shape
 */
export function FurniturePreview({ item, size = 80, imageUrl }: PreviewProps) {
  if (imageUrl) {
    return (
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-contain"
          draggable={false}
          onError={(e) => {
            // If image fails, hide it and show SVG fallback
            (e.currentTarget as HTMLImageElement).style.display = "none";
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "block";
          }}
        />
        <div style={{ display: "none" }}>
          <SvgPreview item={item} size={size} />
        </div>
      </div>
    );
  }
  return <SvgPreview item={item} size={size} />;
}

function SvgPreview({ item, size = 80 }: { item: FurnitureItem; size?: number }) {
  const aspect = item.width / item.depth;
  let vbW: number, vbH: number;
  if (aspect >= 1) {
    vbW = 100;
    vbH = 100 / aspect;
  } else {
    vbH = 100;
    vbW = 100 * aspect;
  }
  const vpad = Math.max(vbW, vbH) * 0.08;
  const fullVbW = vbW + vpad * 2;
  const fullVbH = vbH + vpad * 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${fullVbW} ${fullVbH}`} className="block">
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

  switch (shape) {
    case "sofa":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={4} fill={c} stroke={dark} strokeWidth={1} />
          <rect x={2} y={2} width={w - 4} height={d * 0.2} rx={2} fill={darken(c, 0.1)} />
          {renderCushions(w, d, c, dark)}
          <rect x={0} y={d * 0.2} width={w * 0.06} height={d * 0.8} fill={darken(c, 0.15)} />
          <rect x={w - w * 0.06} y={d * 0.2} width={w * 0.06} height={d * 0.8} fill={darken(c, 0.15)} />
        </g>
      );
    case "bed":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={3} fill={darken(c, 0.25)} stroke={dark} strokeWidth={1} />
          <rect x={2} y={d * 0.12} width={w - 4} height={d * 0.86} rx={2} fill={c} stroke={darken(c, 0.1)} strokeWidth={0.5} />
          <rect x={w * 0.05} y={d * 0.04} width={w * 0.42} height={d * 0.14} rx={3} fill="#FAFAFA" stroke="#E0E0E0" strokeWidth={0.5} />
          <rect x={w * 0.53} y={d * 0.04} width={w * 0.42} height={d * 0.14} rx={3} fill="#FAFAFA" stroke="#E0E0E0" strokeWidth={0.5} />
          <line x1={2} y1={d * 0.6} x2={w - 2} y2={d * 0.6} stroke={darken(c, 0.2)} strokeWidth={1} strokeDasharray="3 2" />
        </g>
      );
    case "chair":
      return (
        <g>
          <rect x={0} y={d * 0.15} width={w} height={d * 0.7} rx={3} fill={c} stroke={dark} strokeWidth={1} />
          <rect x={0} y={0} width={w} height={d * 0.15} rx={2} fill={darken(c, 0.2)} />
          <circle cx={w * 0.1} cy={d * 0.9} r={1.5} fill="#3E2723" />
          <circle cx={w * 0.9} cy={d * 0.9} r={1.5} fill="#3E2723" />
        </g>
      );
    case "table": {
      const isRound = f.id === "coffee-round" || f.id === "dining-table-round" || f.id === "patio-table-round";
      if (isRound) {
        const r = Math.min(w, d) / 2;
        return (
          <g>
            <circle cx={w / 2} cy={d / 2} r={r} fill={c} stroke={dark} strokeWidth={1} />
            <line x1={w / 2 - r * 0.7} y1={d / 2} x2={w / 2 + r * 0.7} y2={d / 2} stroke={darken(c, 0.15)} strokeWidth={0.5} />
          </g>
        );
      }
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          <line x1={2} y1={d * 0.25} x2={w - 2} y2={d * 0.25} stroke={darken(c, 0.12)} strokeWidth={0.5} />
          <line x1={2} y1={d * 0.5} x2={w - 2} y2={d * 0.5} stroke={darken(c, 0.12)} strokeWidth={0.5} />
          <line x1={2} y1={d * 0.75} x2={w - 2} y2={d * 0.75} stroke={darken(c, 0.12)} strokeWidth={0.5} />
        </g>
      );
    }
    case "rug":
      return <rect x={0} y={0} width={w} height={d} rx={1} fill={c} fillOpacity={0.3} stroke={c} strokeWidth={1.5} strokeDasharray="4 2" />;
    case "plant": {
      const r = Math.min(w, d) / 2;
      return (
        <g>
          <circle cx={w / 2} cy={d / 2} r={r * 0.5} fill="#8B6F47" stroke="#6D4C41" strokeWidth={0.5} />
          <circle cx={w / 2} cy={d / 2} r={r * 0.95} fill={c} fillOpacity={0.8} stroke={darken(c, 0.2)} strokeWidth={0.5} />
        </g>
      );
    }
    case "lamp": {
      const r = Math.min(w, d) / 2;
      return (
        <g>
          <circle cx={w / 2} cy={d / 2} r={r * 1.1} fill={c} fillOpacity={0.15} />
          <circle cx={w / 2} cy={d / 2} r={r * 0.7} fill={c} stroke={dark} strokeWidth={1} />
          <circle cx={w / 2} cy={d / 2} r={r * 0.3} fill={lighten(c, 0.4)} />
        </g>
      );
    }
    case "tv":
      return <rect x={0} y={0} width={w} height={d} rx={1} fill="#1A1A1A" stroke="#333" strokeWidth={0.5} />;
    case "toilet":
      return (
        <g>
          <rect x={w * 0.15} y={0} width={w * 0.7} height={d * 0.3} rx={2} fill={c} stroke={dark} strokeWidth={0.5} />
          <ellipse cx={w / 2} cy={d * 0.6} rx={w * 0.4} ry={d * 0.38} fill={c} stroke={dark} strokeWidth={0.5} />
        </g>
      );
    case "bathtub":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={6} fill={c} stroke={dark} strokeWidth={1} />
          <rect x={4} y={4} width={w - 8} height={d - 8} rx={4} fill="none" stroke={darken(c, 0.15)} strokeWidth={1} />
          <circle cx={w * 0.8} cy={d / 2} r={2} fill={darken(c, 0.3)} />
        </g>
      );
    case "sink":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={darken(c, 0.1)} stroke={dark} strokeWidth={0.5} />
          <ellipse cx={w / 2} cy={d / 2} rx={w * 0.35} ry={d * 0.35} fill="#E5E5E5" stroke="#999" strokeWidth={0.5} />
        </g>
      );
    case "fridge":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          <line x1={0} y1={d * 0.4} x2={w} y2={d * 0.4} stroke={darken(c, 0.2)} strokeWidth={1} />
          <rect x={w - 3} y={d * 0.1} width={1.5} height={d * 0.25} rx={0.5} fill="#37474F" />
          <rect x={w - 3} y={d * 0.5} width={1.5} height={d * 0.3} rx={0.5} fill="#37474F" />
        </g>
      );
    case "stove":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          {[[w*0.25,d*0.25],[w*0.75,d*0.25],[w*0.25,d*0.75],[w*0.75,d*0.75]].map(([bx,by],i)=>(
            <circle key={i} cx={bx} cy={by} r={Math.min(w,d)*0.12} fill="#1A1A1A" />
          ))}
        </g>
      );
    case "washing":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />
          <circle cx={w/2} cy={d/2} r={Math.min(w,d)*0.3} fill="#90A4AE" fillOpacity={0.5} stroke="#555" strokeWidth={1} />
        </g>
      );
    case "shelf":
    case "wardrobe":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={1} fill={c} stroke={dark} strokeWidth={1} />
          {shape === "shelf" ? (
            <>
              <line x1={0} y1={d*0.33} x2={w} y2={d*0.33} stroke={darken(c,0.25)} strokeWidth={0.5} />
              <line x1={0} y1={d*0.66} x2={w} y2={d*0.66} stroke={darken(c,0.25)} strokeWidth={0.5} />
            </>
          ) : (
            <>
              <line x1={w/2} y1={0} x2={w/2} y2={d} stroke={darken(c,0.25)} strokeWidth={1} />
              <circle cx={w/2-2} cy={d/2} r={1} fill="#37474F" />
              <circle cx={w/2+2} cy={d/2} r={1} fill="#37474F" />
            </>
          )}
        </g>
      );
    case "counter":
      return (
        <g>
          <rect x={0} y={0} width={w} height={d} rx={1} fill={c} stroke={dark} strokeWidth={0.5} />
          <rect x={1} y={1} width={w-2} height={d-2} rx={0.5} fill="none" stroke="#37474F" strokeWidth={1} />
          <line x1={w/2} y1={0} x2={w/2} y2={d} stroke={darken(c,0.2)} strokeWidth={0.5} />
        </g>
      );
    case "cylinder": {
      const r = Math.min(w, d) / 2;
      return <circle cx={w/2} cy={d/2} r={r} fill={c} stroke={dark} strokeWidth={1} />;
    }
    case "sphere": {
      const r = Math.min(w, d) / 2;
      return <circle cx={w/2} cy={d/2} r={r} fill={c} stroke={dark} strokeWidth={1} />;
    }
    default:
      return <rect x={0} y={0} width={w} height={d} rx={2} fill={c} stroke={dark} strokeWidth={1} />;
  }
}

function renderCushions(w: number, d: number, c: string, dark: string) {
  const seats = Math.max(2, Math.round(w / 70));
  const cushionW = w / seats;
  const elements = [];
  for (let i = 0; i < seats; i++) {
    elements.push(
      <rect key={i} x={i * cushionW + 2} y={d * 0.3} width={cushionW - 4} height={d * 0.55} rx={2} fill={lighten(c, 0.05)} stroke={darken(c, 0.1)} strokeWidth={0.5} />
    );
  }
  return elements;
}

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
