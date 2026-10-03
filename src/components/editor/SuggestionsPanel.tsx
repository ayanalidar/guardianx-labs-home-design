"use client";
import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { Lightbulb, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const SUGGESTIONS: Record<string, Array<{ title: string; description: string; items: string[]; placement: string }>> = {
  bedroom: [
    { title: "Reading Nook by Window", description: "Add a comfortable armchair and side table near the window for natural light reading.", items: ["armchair", "side-table", "floor-lamp"], placement: "near the window wall" },
    { title: "Wardrobe Organization", description: "Position wardrobe along the longest wall for maximum storage.", items: ["wardrobe", "dresser"], placement: "along the longest wall" },
    { title: "Bedside Symmetry", description: "Flank the bed with matching nightstands and lamps.", items: ["nightstand", "table-lamp"], placement: "both sides of bed" },
  ],
  kitchen: [
    { title: "Kitchen Work Triangle", description: "Position fridge, stove, and sink in a triangle for efficient workflow.", items: ["fridge", "stove", "sink"], placement: "in triangle formation" },
    { title: "Breakfast Bar", description: "Add bar stools at the counter for casual dining.", items: ["bar-stool", "bar-stool"], placement: "along the kitchen counter" },
    { title: "Pantry Storage", description: "Add a pantry cabinet near the entrance.", items: ["pantry"], placement: "near the kitchen entrance" },
  ],
  living: [
    { title: "Conversation Area", description: "Arrange sofa and chairs in an L-shape for easy conversation.", items: ["sofa-3", "armchair", "coffee-table"], placement: "center of room" },
    { title: "Media Wall", description: "Place TV stand and bookshelf along the longest wall.", items: ["tv-stand", "tv", "bookshelf"], placement: "on the longest wall" },
    { title: "Reading Corner", description: "Add a floor lamp and accent chair in a quiet corner.", items: ["armchair-accent", "floor-lamp", "side-table"], placement: "in a corner away from TV" },
  ],
  bathroom: [
    { title: "Wet Zone Separation", description: "Keep shower and toilet on one side, vanity on the other.", items: ["shower", "bath-vanity", "mirror"], placement: "shower at far end" },
    { title: "Storage Solutions", description: "Add a wall cabinet above the toilet.", items: ["bath-cabinet", "towel-rack"], placement: "above toilet" },
    { title: "Double Vanity", description: "Upgrade to a double vanity for shared bathrooms.", items: ["bath-vanity-120", "mirror"], placement: "along the entrance wall" },
  ],
  office: [
    { title: "Ergonomic Setup", description: "Position desk near natural light with monitor at eye level.", items: ["desk", "office-chair-ergo", "monitor"], placement: "near window, facing door" },
    { title: "Storage Wall", description: "Line one wall with bookcase and filing cabinet.", items: ["bookcase-tall", "filing-cabinet"], placement: "behind desk" },
    { title: "Meeting Area", description: "Add a small chair for client meetings.", items: ["armchair", "side-table"], placement: "opposite the desk" },
  ],
};

export function SuggestionsPanel() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const room = useEditorStore((s) => s.project.rooms.find((r) => r.id === s.project.activeRoomId) || s.project.rooms[0]);
  const items = room?.items || [];

  const roomType = room?.name?.toLowerCase()?.includes("bed") ? "bedroom" :
    room?.name?.toLowerCase()?.includes("kitchen") ? "kitchen" :
    room?.name?.toLowerCase()?.includes("bath") ? "bathroom" :
    room?.name?.toLowerCase()?.includes("office") ? "office" : "living";

  const fetchSuggestions = () => {
    setLoading(true);
    setTimeout(() => {
      setSuggestions(SUGGESTIONS[roomType] || SUGGESTIONS.living);
      setOpen(true);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <button onClick={fetchSuggestions} disabled={loading} className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50" title="Get AI design suggestions">
        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Lightbulb className="h-6 w-6" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-h-[60vh] bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /><h3 className="font-bold text-sm">AI Design Suggestions</h3></div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="rounded-lg border p-3 hover:border-purple-400">
                <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{s.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">{s.items?.map((item: string, j: number) => (<span key={j} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{item}</span>))}</div>
                <p className="text-[10px] text-muted-foreground italic">📍 {s.placement}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
