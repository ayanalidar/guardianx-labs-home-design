"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows } from "@react-three/drei";
import { useEditorStore, type Wall, type PlacedItem } from "@/store/editor-store";
import { getFurnitureById } from "@/lib/furniture";
import { useMemo } from "react";
import * as THREE from "three";

// Note: dynamic import inside Editor.tsx so this loads only when 3D is active

const CM_TO_M = 0.01;

function Wall3D({ wall }: { wall: Wall }) {
  const dx = wall.x2 - wall.x1;
  const dy = wall.y2 - wall.y1;
  const length = Math.hypot(dx, dy) * CM_TO_M;
  const angle = Math.atan2(dy, dx);
  const cx = ((wall.x1 + wall.x2) / 2) * CM_TO_M;
  const cz = ((wall.y1 + wall.y2) / 2) * CM_TO_M;
  const thickness = wall.thickness * CM_TO_M;
  const height = wall.height * CM_TO_M;

  if (wall.type === "door") {
    // Door: render as opening — two short wall segments + lintel above
    return (
      <group position={[cx, 0, cz]} rotation={[0, -angle, 0]}>
        {/* Lintel above door */}
        <mesh position={[0, height, 0]} castShadow>
          <boxGeometry args={[length, 0.3, thickness]} />
          <meshStandardMaterial color="#F5E6D3" />
        </mesh>
        {/* Door slab (open) */}
        <mesh position={[-length / 2, height / 4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[0.04, height * 0.75, length * 0.9]} />
          <meshStandardMaterial color="#8B6F47" />
        </mesh>
      </group>
    );
  }

  if (wall.type === "window") {
    // Window: short wall below, glass in middle, short wall above
    const sillH = 1.0;
    const headH = 0.3;
    const winH = height - sillH - headH;
    return (
      <group position={[cx, 0, cz]} rotation={[0, -angle, 0]}>
        {/* Sill */}
        <mesh position={[0, sillH / 2, 0]} castShadow>
          <boxGeometry args={[length, sillH, thickness]} />
          <meshStandardMaterial color="#F5E6D3" />
        </mesh>
        {/* Glass */}
        <mesh position={[0, sillH + winH / 2, 0]}>
          <boxGeometry args={[length, winH, thickness * 0.4]} />
          <meshPhysicalMaterial
            color="#B8E0F5"
            transparent
            opacity={0.4}
            roughness={0.05}
            metalness={0.1}
            transmission={0.7}
          />
        </mesh>
        {/* Head */}
        <mesh position={[0, height - headH / 2, 0]} castShadow>
          <boxGeometry args={[length, headH, thickness]} />
          <meshStandardMaterial color="#F5E6D3" />
        </mesh>
      </group>
    );
  }

  // Solid wall
  return (
    <group position={[cx, 0, cz]} rotation={[0, -angle, 0]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, height, thickness]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Item3D({ item }: { item: PlacedItem }) {
  const f = getFurnitureById(item.furnitureId);
  const w = item.width * CM_TO_M;
  const d = item.depth * CM_TO_M;
  const h = item.height * CM_TO_M;
  const x = item.x * CM_TO_M;
  const z = item.y * CM_TO_M;

  // Special shapes for some items
  const isPlant = f?.tags?.includes("plant");
  const isLamp = f?.tags?.includes("lamp");
  const isRug = f?.tags?.includes("rug");
  const isTV = f?.id === "tv";
  const isToilet = f?.id === "toilet";
  const isBathtub = f?.id === "bathtub";

  return (
    <group position={[x, 0, z]} rotation={[0, (-item.rotation * Math.PI) / 180, 0]}>
      {isRug ? (
        <mesh position={[0, 0.005, 0]} receiveShadow>
          <boxGeometry args={[w, 0.02, d]} />
          <meshStandardMaterial color={item.color} roughness={1} />
        </mesh>
      ) : isPlant ? (
        <>
          {/* Pot */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[w / 3, w / 3.5, 0.3, 12]} />
            <meshStandardMaterial color="#8B6F47" />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, h / 2 + 0.15, 0]} castShadow>
            <sphereGeometry args={[w / 2, 12, 12]} />
            <meshStandardMaterial color={item.color} roughness={1} />
          </mesh>
        </>
      ) : isLamp ? (
        <>
          {/* Base */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[w / 3, w / 3, 0.1, 16]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          {/* Pole */}
          <mesh position={[0, h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, h - 0.2, 8]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          {/* Shade */}
          <mesh position={[0, h - 0.1, 0]} castShadow>
            <coneGeometry args={[w / 2.2, 0.3, 16, 1, true]} />
            <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.3} side={THREE.DoubleSide} />
          </mesh>
          <pointLight position={[0, h - 0.2, 0]} intensity={0.5} distance={5} color={item.color} />
        </>
      ) : isTV ? (
        <mesh position={[0, h / 2 + 0.6, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#0A0A0A" emissive="#1a1a2a" emissiveIntensity={0.2} />
        </mesh>
      ) : isToilet ? (
        <>
          {/* Bowl */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[w, 0.5, d * 0.7]} />
            <meshStandardMaterial color={item.color} roughness={0.3} />
          </mesh>
          {/* Tank */}
          <mesh position={[0, 0.7, -d / 2 + 0.1]} castShadow>
            <boxGeometry args={[w * 0.9, 0.6, 0.2]} />
            <meshStandardMaterial color={item.color} roughness={0.3} />
          </mesh>
        </>
      ) : isBathtub ? (
        <>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.6, d]} />
            <meshStandardMaterial color={item.color} roughness={0.2} />
          </mesh>
          {/* Water surface */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[w - 0.15, 0.05, d - 0.15]} />
            <meshPhysicalMaterial color="#B8E0F5" transparent opacity={0.7} roughness={0.05} />
          </mesh>
        </>
      ) : (
        // Default: box
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={item.color} roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}

function Floor() {
  const project = useEditorStore((s) => s.project);
  // Compute bounding box of all walls
  const box = useMemo(() => {
    const pts = project.walls.flatMap((w) => [[w.x1, w.y1], [w.x2, w.y2]]);
    if (pts.length === 0) return null;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, [project.walls]);

  if (!box) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#E8DFD0" />
      </mesh>
    );
  }

  const cx = ((box.minX + box.maxX) / 2) * CM_TO_M;
  const cz = ((box.minY + box.maxY) / 2) * CM_TO_M;
  const w = Math.max((box.maxX - box.minX) * CM_TO_M + 1, 5);
  const d = Math.max((box.maxY - box.minY) * CM_TO_M + 1, 5);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0, cz]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color="#E8DFD0" roughness={1} />
    </mesh>
  );
}

export function View3D() {
  const project = useEditorStore((s) => s.project);
  const selectedId = useEditorStore((s) => s.selectedId);
  const select = useEditorStore((s) => s.select);

  // Compute camera target as center of project
  const target = useMemo(() => {
    const pts = project.walls.flatMap((w) => [[w.x1, w.y1], [w.x2, w.y2]]);
    const itemPts = project.items.map((i) => [i.x, i.y]);
    const all = [...pts, ...itemPts];
    if (all.length === 0) return [0, 0, 0] as [number, number, number];
    const xs = all.map((p) => p[0]);
    const ys = all.map((p) => p[1]);
    return [
      ((Math.min(...xs) + Math.max(...xs)) / 2) * CM_TO_M,
      1.5,
      ((Math.min(...ys) + Math.max(...ys)) / 2) * CM_TO_M,
    ] as [number, number, number];
  }, [project]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-100 to-sky-50">
      <Canvas
        shadows
        camera={{ position: [target[0] + 8, 6, target[2] + 8], fov: 50 }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.Fog("#E0F2FE", 15, 40);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 8]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <hemisphereLight args={["#FFF8E7", "#8B7355", 0.4]} />

        <Floor />

        {project.walls.map((w) => (
          <Wall3D key={w.id} wall={w} />
        ))}

        {project.items.map((it) => (
          <group
            key={it.id}
            onClick={(e) => {
              e.stopPropagation();
              select(it.id, "item");
            }}
          >
            <Item3D item={it} />
            {selectedId === it.id && (
              <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[Math.max(it.width, it.depth) * CM_TO_M * 0.55, Math.max(it.width, it.depth) * CM_TO_M * 0.65, 32]} />
                <meshBasicMaterial color="#0F766E" transparent opacity={0.8} />
              </mesh>
            )}
          </group>
        ))}

        <ContactShadows position={[target[0], 0.01, target[2]]} opacity={0.4} scale={30} blur={2} far={8} />
        <Grid
          args={[40, 40]}
          position={[0, 0, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#9CA3AF"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor="#4B5563"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid
        />

        <OrbitControls
          target={target}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={2}
          maxDistance={25}
          enablePan
          makeDefault
        />
      </Canvas>

      {/* Help overlay */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground shadow-sm">
        <div className="font-medium text-foreground mb-1">3D Controls</div>
        <div>Drag: Rotate · Right-drag: Pan · Scroll: Zoom</div>
      </div>
    </div>
  );
}
