"use client";

import { useState } from "react";
import { LandingPage } from "@/components/landing/LandingPage";
import { Editor } from "@/components/editor/Editor";
import { useEditorStore, type Project } from "@/store/editor-store";
import { Toaster } from "sonner";

export default function Home() {
  const [editorOpen, setEditorOpen] = useState(false);
  const loadProject = useEditorStore((s) => s.loadProject);

  const openEditor = () => {
    setEditorOpen(true);
    if (typeof window !== "undefined") window.location.hash = "editor";
  };

  const closeEditor = () => {
    setEditorOpen(false);
    if (typeof window !== "undefined") window.location.hash = "";
  };

  const openProject = (p: Project) => {
    loadProject(p);
    setEditorOpen(true);
    if (typeof window !== "undefined") window.location.hash = "editor";
  };

  return (
    <>
      <LandingPage onStart={openEditor} onOpenProject={openProject} />
      {editorOpen && <Editor onExit={closeEditor} />}
      <Toaster richColors position="bottom-right" />
    </>
  );
}
