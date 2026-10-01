"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Box,
  Ruler,
  Sofa,
  Layers,
  Eye,
  Save,
  Sparkles,
  ArrowRight,
  Check,
  MousePointer2,
  DoorOpen,
  Square,
  Smartphone,
  Github,
  Twitter,
  Mail,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import { getAllSavedProjects, type Project } from "@/store/editor-store";

// Subscribe to localStorage changes for saved projects
const emptyProjects: Project[] = [];
let cachedProjects: Project[] = emptyProjects;
let cachedRaw: string | null = null;

function subscribeProjects(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  // Also poll every 2s since localStorage doesn't fire same-tab events
  const id = setInterval(callback, 2000);
  return () => {
    window.removeEventListener("storage", callback);
    clearInterval(id);
  };
}
function getProjectsSnapshot(): Project[] {
  if (typeof window === "undefined") return emptyProjects;
  const raw = localStorage.getItem("planner_projects");
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedProjects = getAllSavedProjects();
  }
  return cachedProjects;
}
function getServerSnapshot(): Project[] {
  return emptyProjects;
}
function useSavedProjects() {
  const all = useSyncExternalStore(subscribeProjects, getProjectsSnapshot, getServerSnapshot);
  return [...all].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
}

interface LandingPageProps {
  onStart: () => void;
  onOpenProject?: (p: Project) => void;
}

export function LandingPage({ onStart, onOpenProject }: LandingPageProps) {
  const savedProjects = useSavedProjects();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-sm">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg leading-none">PlanCraft</div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">Home Design Studio</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#gallery" className="text-muted-foreground hover:text-foreground transition-colors">Gallery</a>
          </nav>
          <Button onClick={onStart} className="bg-emerald-700 hover:bg-emerald-800 gap-1.5">
            Start Designing
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50" />
        <div className="absolute top-20 -right-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 gap-1">
                <Sparkles className="h-3 w-3" />
                Free · No signup required
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Design your dream home in{" "}
                <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  2D & 3D
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Draw floor plans, drag-and-drop furniture, then walk through your space in immersive 3D.
                PlanCraft brings professional home design tools to your browser — no downloads, no
                subscriptions, no learning curve.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={onStart} className="bg-emerald-700 hover:bg-emerald-800 gap-2 h-12 px-6">
                  <Home className="h-5 w-5" />
                  Open the Editor
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-6">
                  <a href="#features">Explore features</a>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  40+ furniture items
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Real-time 3D
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Auto-save
                </div>
              </div>
            </div>

            {/* Hero visual: animated mini floor plan */}
            <div className="relative">
              <HeroFloorPlan />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Furniture catalog", value: "40+", icon: Sofa },
            { label: "Design categories", value: "7", icon: Layers },
            { label: "2D + 3D modes", value: "2", icon: Box },
            { label: "Cost to start", value: "Free", icon: Sparkles },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="h-6 w-6 mx-auto mb-2 text-emerald-700" />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-3">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to plan a space
            </h2>
            <p className="mt-4 text-muted-foreground">
              From quick sketches to detailed layouts, PlanCraft gives you the tools interior designers
              use — minus the complexity and price tag.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MousePointer2,
                title: "Smart 2D Editor",
                desc: "Click-and-drag wall drawing with snap-to-grid. Place doors, windows, and openings with precision. Real-time measurements in centimeters.",
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                icon: Box,
                title: "Instant 3D Walkthrough",
                desc: "Toggle to 3D and orbit around your design. Walls extrude automatically, furniture renders with shadows and lighting. Walk through your future home.",
                color: "bg-amber-100 text-amber-700",
              },
              {
                icon: Sofa,
                title: "40+ Furniture Items",
                desc: "Curated library spanning living room, bedroom, kitchen, bathroom, office, outdoor, and decor. Each item comes with realistic dimensions and customizable colors.",
                color: "bg-rose-100 text-rose-700",
              },
              {
                icon: Ruler,
                title: "Precise Measurements",
                desc: "Every wall and item reports its real-world size. Adjust dimensions to the centimeter. Length labels appear on selected walls for quick reference.",
                color: "bg-sky-100 text-sky-700",
              },
              {
                icon: Save,
                title: "Auto-save & Projects",
                desc: "Your work is automatically saved to your browser. Manage multiple projects, load them anytime, and never lose a design. No account needed.",
                color: "bg-violet-100 text-violet-700",
              },
              {
                icon: Eye,
                title: "Properties Panel",
                desc: "Fine-tune any element: position, rotation, dimensions, and color. Duplicate, rotate, or delete with one click. Keyboard shortcuts for power users.",
                color: "bg-teal-100 text-teal-700",
              },
            ].map((f) => (
              <Card key={f.title} className="border-stone-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 lg:py-28 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-3">Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">From blank canvas to dream home</h2>
            <p className="mt-4 text-muted-foreground">Three simple steps. No tutorials required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Square,
                title: "Draw walls",
                desc: "Pick the Wall tool and click corner-to-corner. Add doors and windows where you need them. Snap-to-grid keeps everything aligned.",
              },
              {
                step: "02",
                icon: Sofa,
                title: "Place furniture",
                desc: "Drag items from the library onto your floor plan. Resize, rotate, and recolor to match your style. Build out every room.",
              },
              {
                step: "03",
                icon: Box,
                title: "View in 3D",
                desc: "Hit the 3D button to walk through your design. Orbit, zoom, and inspect from any angle. Save and revisit anytime.",
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-6xl font-bold text-emerald-100 absolute -top-4 -left-2">{s.step}</div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-4">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={onStart} className="bg-emerald-700 hover:bg-emerald-800 gap-2 h-12 px-8">
              Try it now — it&apos;s free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery / Recent projects */}
      <section id="gallery" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-3">Your projects</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Pick up where you left off</h2>
            <p className="mt-4 text-muted-foreground">
              Your designs are saved automatically in your browser. Open one to keep editing.
            </p>
          </div>

          {savedProjects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-1">No saved projects yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Start your first design and it&apos;ll appear here for quick access.
                </p>
                <Button onClick={onStart} className="bg-emerald-700 hover:bg-emerald-800 gap-2">
                  <Home className="h-4 w-4" />
                  Create your first project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProjects.map((p) => (
                <Card
                  key={p.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => onOpenProject?.(p)}
                >
                  <div className="aspect-video bg-gradient-to-br from-stone-100 to-stone-200 relative overflow-hidden">
                    <MiniPreview project={p} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-foreground hover:bg-white/90 gap-1">
                        <ArrowRight className="h-3 w-3" /> Open
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {p.walls.length} walls · {p.items.length} items · {new Date(p.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card
                className="border-dashed flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors min-h-[200px]"
                onClick={onStart}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                    <Home className="h-5 w-5" />
                  </div>
                  <div className="font-medium text-sm">New project</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Tools showcase */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: MousePointer2, label: "Select", desc: "Click to pick, drag to move" },
              { icon: Square, label: "Wall", desc: "Click two points to draw a wall" },
              { icon: DoorOpen, label: "Door", desc: "Place door openings in walls" },
              { icon: Box, label: "Window", desc: "Add window openings with glass" },
            ].map((t) => (
              <div key={t.label} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <t.icon className="h-7 w-7" />
                </div>
                <div className="font-semibold mb-1">{t.label}</div>
                <div className="text-sm text-emerald-100">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to design your space?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            No signup. No download. No cost. Just open the editor and start building.
          </p>
          <Button size="lg" onClick={onStart} className="bg-emerald-700 hover:bg-emerald-800 gap-2 h-12 px-8 text-base">
            <Home className="h-5 w-5" />
            Launch PlanCraft Editor
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white">PlanCraft</span>
              </div>
              <p className="text-sm text-stone-400">
                A free, browser-based home design studio. Draw, decorate, and walk through your space in 3D.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how" className="hover:text-white transition-colors">How it works</a></li>
                <li><button onClick={onStart} className="hover:text-white transition-colors">Open editor</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Design guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Furniture catalog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Keyboard shortcuts</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                  <Github className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} PlanCraft. Built with Next.js, Three.js & shadcn/ui.</p>
            <p className="flex items-center gap-1.5">
              <Smartphone className="h-3 w-3" />
              Works on desktop, tablet, and mobile
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Animated mini floor plan for the hero section
function HeroFloorPlan() {
  return (
    <div className="relative aspect-square max-w-lg mx-auto">
      <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E7E5E4" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="#FAFAF7" />
          <rect width="400" height="400" fill="url(#grid)" />

          {/* Walls */}
          <g stroke="#3F3F46" strokeWidth="6" fill="none" strokeLinecap="round">
            <rect x="60" y="60" width="280" height="220" />
            {/* Interior wall */}
            <line x1="200" y1="60" x2="200" y2="180" />
            <line x1="200" y1="180" x2="280" y2="180" />
          </g>

          {/* Door arc */}
          <path d="M 60 200 A 30 30 0 0 1 90 230" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="60" y1="200" x2="60" y2="230" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 3" />

          {/* Windows */}
          <line x1="120" y1="60" x2="170" y2="60" stroke="#06B6D4" strokeWidth="3" />
          <line x1="120" y1="56" x2="170" y2="56" stroke="#06B6D4" strokeWidth="1.5" />
          <line x1="120" y1="64" x2="170" y2="64" stroke="#06B6D4" strokeWidth="1.5" />

          <line x1="280" y1="280" x2="320" y2="280" stroke="#06B6D4" strokeWidth="3" />
          <line x1="280" y1="276" x2="320" y2="276" stroke="#06B6D4" strokeWidth="1.5" />
          <line x1="280" y1="284" x2="320" y2="284" stroke="#06B6D4" strokeWidth="1.5" />

          {/* Furniture - Living Room (left) */}
          {/* Sofa */}
          <g>
            <rect x="80" y="220" width="100" height="40" fill="#6B7FD7" stroke="rgba(0,0,0,0.3)" />
            <text x="130" y="245" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text>
          </g>
          {/* Coffee table */}
          <rect x="100" y="170" width="60" height="30" fill="#A0744E" stroke="rgba(0,0,0,0.3)" />
          {/* Armchair */}
          <rect x="80" y="120" width="40" height="40" fill="#8B9E5B" stroke="rgba(0,0,0,0.3)" />

          {/* Furniture - Bedroom (right) */}
          {/* Bed */}
          <rect x="220" y="80" width="100" height="80" fill="#D4A5A5" stroke="rgba(0,0,0,0.3)" />
          <text x="270" y="125" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">QB</text>
          {/* Nightstand */}
          <rect x="220" y="80" width="20" height="20" fill="#A0744E" stroke="rgba(0,0,0,0.3)" />
          {/* Wardrobe */}
          <rect x="320" y="80" width="20" height="60" fill="#8B6F47" stroke="rgba(0,0,0,0.3)" />

          {/* Plant */}
          <circle cx="330" cy="250" r="12" fill="#5B8C5A" />

          {/* Door label */}
          <text x="40" y="220" fontSize="9" fill="#8B5CF6">door</text>
        </svg>

        {/* Floating labels */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-medium shadow-sm">
          2D Floor Plan
        </div>
        <div className="absolute bottom-3 right-3 bg-emerald-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
          42 m²
        </div>
      </div>

      {/* Floating 3D badge */}
      <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border p-3 flex items-center gap-2 max-w-[180px]">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Box className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-xs font-semibold">Toggle to 3D</div>
          <div className="text-[10px] text-muted-foreground">Walk through your design</div>
        </div>
      </div>
    </div>
  );
}

// Tiny SVG preview of a saved project
function MiniPreview({ project }: { project: Project }) {
  if (project.walls.length === 0 && project.items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
        Empty project
      </div>
    );
  }
  // Compute bounds
  const pts = project.walls.flatMap((w) => [[w.x1, w.y1], [w.x2, w.y2]]);
  const itemPts = project.items.map((i) => [i.x, i.y]);
  const all = [...pts, ...itemPts];
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 100);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 100);
  const w = maxX - minX || 100;
  const h = maxY - minY || 100;
  const pad = 20;
  const scale = Math.min((200 - pad * 2) / w, (120 - pad * 2) / h);
  const ox = pad - minX * scale + ((200 - pad * 2 - w * scale) / 2);
  const oy = pad - minY * scale + ((120 - pad * 2 - h * scale) / 2);

  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <rect width="200" height="120" fill="#FAFAF7" />
      {/* Walls */}
      {project.walls.map((wall, i) => (
        <line
          key={i}
          x1={wall.x1 * scale + ox}
          y1={wall.y1 * scale + oy}
          x2={wall.x2 * scale + ox}
          y2={wall.y2 * scale + oy}
          stroke={wall.type === "door" ? "#8B5CF6" : wall.type === "window" ? "#06B6D4" : "#3F3F46"}
          strokeWidth={wall.type === "wall" ? 2.5 : 1.5}
        />
      ))}
      {/* Items */}
      {project.items.map((it, i) => (
        <rect
          key={i}
          x={(it.x - it.width / 2) * scale + ox}
          y={(it.y - it.depth / 2) * scale + oy}
          width={it.width * scale}
          height={it.depth * scale}
          fill={it.color}
          opacity={0.8}
        />
      ))}
    </svg>
  );
}
