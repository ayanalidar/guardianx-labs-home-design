import type { UnitSystem } from "@/store/editor-store";

/**
 * Format a measurement in centimeters to the user's chosen unit system.
 */
export function formatMeasurement(cm: number, units: UnitSystem): string {
  if (units === "imperial") {
    return cmToFeetInches(cm);
  }
  if (cm >= 100) {
    return `${(cm / 100).toFixed(2)} m`;
  }
  return `${Math.round(cm)} cm`;
}

export function formatDimension(cm: number, units: UnitSystem): string {
  if (units === "imperial") {
    return cmToFeetInches(cm);
  }
  return `${(cm / 100).toFixed(2)}m`;
}

export function formatArea(sqCm: number, units: UnitSystem): string {
  if (units === "imperial") {
    const sqFt = sqCm / 929.03;
    return `${sqFt.toFixed(1)} ft²`;
  }
  const sqM = sqCm / 10000;
  return `${sqM.toFixed(1)} m²`;
}

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  if (inches === 12) {
    return `${feet + 1}'-0"`;
  }
  const fractionalInches = totalInches % 12;
  const wholeInches = Math.floor(fractionalInches);
  const remainder = fractionalInches - wholeInches;
  let inchStr: string;
  if (remainder < 0.25) {
    inchStr = wholeInches === 0 && feet > 0 ? "" : `${wholeInches}`;
  } else if (remainder < 0.75) {
    inchStr = `${wholeInches}½`;
  } else {
    inchStr = `${wholeInches + 1}`;
  }
  if (feet === 0) return `${inchStr}"`;
  if (inchStr === "" || inchStr === "0") return `${feet}'-0"`;
  return `${feet}'-${inchStr}"`;
}

export function parseMeasurement(input: string, units: UnitSystem): number | null {
  const trimmed = input.trim();
  if (units === "imperial") {
    const feetInchesMatch = trimmed.match(/(\d+)['′]\s*-?\s*(\d+(?:\s*½|\s*1\/2)?)?\s*["″]?/);
    if (feetInchesMatch) {
      const feet = parseInt(feetInchesMatch[1]);
      let inches = 0;
      if (feetInchesMatch[2]) {
        const inchStr = feetInchesMatch[2].replace(/\s/g, "");
        if (inchStr.includes("½") || inchStr.includes("1/2")) {
          inches = parseFloat(inchStr.replace(/[½1\/2]/g, "")) + 0.5;
        } else {
          inches = parseInt(inchStr);
        }
      }
      return (feet * 12 + inches) * 2.54;
    }
    const feetOnlyMatch = trimmed.match(/(\d+(?:\.\d+)?)['′]/);
    if (feetOnlyMatch) return parseFloat(feetOnlyMatch[1]) * 30.48;
    const inchesOnlyMatch = trimmed.match(/(\d+(?:\.\d+)?)["″]/);
    if (inchesOnlyMatch) return parseFloat(inchesOnlyMatch[1]) * 2.54;
  } else {
    const metersMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*m/i);
    if (metersMatch) return parseFloat(metersMatch[1]) * 100;
    const cmMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*cm/i);
    if (cmMatch) return parseFloat(cmMatch[1]);
  }
  const num = parseFloat(trimmed);
  if (!isNaN(num)) return units === "imperial" ? num * 2.54 : num;
  return null;
}

export function getUnitLabel(units: UnitSystem): string {
  return units === "imperial" ? "ft/in" : "m/cm";
}

export function getRoomPresets(units: UnitSystem): Array<{ label: string; width: number; depth: number }> {
  if (units === "imperial") {
    return [
      { label: "Small 10'×10'", width: 305, depth: 305 },
      { label: "Medium 12'×14'", width: 366, depth: 427 },
      { label: "Large 16'×20'", width: 488, depth: 610 },
      { label: "Living 20'×15'", width: 610, depth: 457 },
      { label: "Bedroom 12'×12'", width: 366, depth: 366 },
      { label: "Kitchen 10'×12'", width: 305, depth: 366 },
    ];
  }
  return [
    { label: "Small 3×3m", width: 300, depth: 300 },
    { label: "Medium 4×4m", width: 400, depth: 400 },
    { label: "Large 5×5m", width: 500, depth: 500 },
    { label: "Living 6×4m", width: 600, depth: 400 },
    { label: "Bedroom 4×4m", width: 400, depth: 400 },
    { label: "Kitchen 3×4m", width: 300, depth: 400 },
  ];
}
