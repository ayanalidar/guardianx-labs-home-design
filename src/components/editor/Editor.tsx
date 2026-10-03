"use client";

import { useEditorStore } from "@/store/editor-store";
import { Canvas2D } from "./Canvas2D";
import { FurniturePanel } from "./FurniturePanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { Toolbar } from "./Toolbar";
import { RoomTabs } from "./RoomTabs";
import { AddRoomButton } from "./AddRoomButton";
import { EmptyState } from "./EmptyState";
import { AutoCADOverlay } from "./AutoCADOverlay";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";

const View3D = dynamic(() => import("./View3D").then((m) => m.View3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-sky-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading 3D view...</p>
      </div>
    </div>
  ),
});

interface EditorProps {
  onExit: () => void;
}

export function Editor({ onExit }: EditorProps) {
  const viewMode = useEditorStore((s) => s.viewMode);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      <Toolbar onExit={onExit} />

      {/* Room tabs row */}
      <div className="flex items-center gap-2 border-b bg-card px-3 py-1.5">
        <RoomTabs />
        <div className="ml-auto flex-shrink-0">
          <AddRoomButton />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left panel */}
        {showLeft && (
          <aside className="w-72 lg:w-80 border-r flex-shrink-0 hidden md:block min-h-0 overflow-hidden">
            <FurniturePanel />
          </aside>
        )}

        {/* Canvas area */}
        <main className="flex-1 relative overflow-hidden">
          {viewMode === "2d" ? <Canvas2D /> : <View3D />}
          {viewMode === "2d" && <EmptyState />}
          {viewMode === "2d" && <AutoCADOverlay />}

          {/* Toggle buttons */}
          <div className="absolute top-3 left-3 flex gap-1">
            {!showLeft && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-background/90 backdrop-blur shadow-sm"
                onClick={() => setShowLeft(true)}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="absolute top-3 right-3 flex gap-1">
            {!showRight && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-background/90 backdrop-blur shadow-sm"
                onClick={() => setShowRight(true)}
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            )}
          </div>
          {showLeft && (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-3 left-3 h-8 w-8 p-0 bg-background/90 backdrop-blur shadow-sm hidden md:flex"
              onClick={() => setShowLeft(false)}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
          {showRight && (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-3 right-3 h-8 w-8 p-0 bg-background/90 backdrop-blur shadow-sm hidden md:flex"
              onClick={() => setShowRight(false)}
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          )}
        </main>

        {/* Right panel */}
        {showRight && (
          <aside className="w-64 lg:w-72 border-l flex-shrink-0 hidden md:block min-h-0 overflow-hidden">
            <PropertiesPanel />
          </aside>
        )}
      </div>

      {/* Mobile furniture drawer */}
      <MobileFurnitureBar />
    </div>
  );
}

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sofa } from "lucide-react";

function MobileFurnitureBar() {
  return (
    <div className="md:hidden border-t bg-card">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full h-12 gap-2">
            <Sofa className="h-4 w-4" />
            Browse Furniture
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh] p-0">
          <FurniturePanel />
        </SheetContent>
      </Sheet>
    </div>
  );
}
