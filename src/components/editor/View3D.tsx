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
  if (!f) return null;
  const w = item.width * CM_TO_M;
  const d = item.depth * CM_TO_M;
  const h = item.height * CM_TO_M;
  const x = item.x * CM_TO_M;
  const z = item.y * CM_TO_M;
  const shape = f.shape || "box";

  return (
    <group position={[x, 0, z]} rotation={[0, (-item.rotation * Math.PI) / 180, 0]}>
      {shape === "rug" ? (
        <mesh position={[0, 0.005, 0]} receiveShadow>
          <boxGeometry args={[w, 0.02, d]} />
          <meshStandardMaterial color={item.color} roughness={1} />
        </mesh>
      ) : shape === "plant" ? (
        <>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[w / 3, w / 3.5, 0.3, 12]} />
            <meshStandardMaterial color="#8B6F47" />
          </mesh>
          <mesh position={[0, h / 2 + 0.15, 0]} castShadow>
            {f.id === "plant-tree" ? (
              <cylinderGeometry args={[w / 4, w / 3, h - 0.3, 8]} />
            ) : (
              <sphereGeometry args={[w / 2, 12, 12]} />
            )}
            <meshStandardMaterial color={item.color} roughness={1} />
          </mesh>
          {f.id === "plant-tree" && (
            <mesh position={[0, h, 0]} castShadow>
              <coneGeometry args={[w / 2, h * 0.4, 8]} />
              <meshStandardMaterial color="#558B2F" roughness={1} />
            </mesh>
          )}
        </>
      ) : shape === "lamp" ? (
        <>
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[w / 3, w / 3, 0.1, 16]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          <mesh position={[0, h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, h - 0.2, 8]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          <mesh position={[0, h - 0.1, 0]} castShadow>
            <coneGeometry args={[w / 2.2, 0.3, 16, 1, true]} />
            <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.3} side={THREE.DoubleSide} />
          </mesh>
          <pointLight position={[0, h - 0.2, 0]} intensity={0.5} distance={5} color={item.color} />
        </>
      ) : shape === "tv" ? (
        <mesh position={[0, h / 2 + 0.6, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#0A0A0A" emissive="#1a1a2a" emissiveIntensity={0.2} />
        </mesh>
      ) : shape === "toilet" ? (
        <>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[w, 0.5, d * 0.7]} />
            <meshStandardMaterial color={item.color} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.7, -d / 2 + 0.1]} castShadow>
            <boxGeometry args={[w * 0.9, 0.6, 0.2]} />
            <meshStandardMaterial color={item.color} roughness={0.3} />
          </mesh>
        </>
      ) : shape === "bathtub" ? (
        <>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.6, d]} />
            <meshStandardMaterial color={item.color} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[w - 0.15, 0.05, d - 0.15]} />
            <meshPhysicalMaterial color="#B8E0F5" transparent opacity={0.7} roughness={0.05} />
          </mesh>
        </>
      ) : shape === "sink" ? (
        <>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={item.color} roughness={0.3} />
          </mesh>
          <mesh position={[0, h + 0.02, 0]}>
            <boxGeometry args={[w * 0.7, 0.05, d * 0.7]} />
            <meshPhysicalMaterial color="#E5E5E5" roughness={0.05} metalness={0.3} />
          </mesh>
        </>
      ) : shape === "fridge" ? (
        <>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={item.color} roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Handle */}
          <mesh position={[w / 2 - 0.04, h / 2, d / 2 + 0.01]}>
            <boxGeometry args={[0.04, 0.4, 0.03]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} />
          </mesh>
          {/* Split line */}
          <mesh position={[0, h * 0.6, d / 2 + 0.005]}>
            <boxGeometry args={[w * 0.95, 0.01, 0.01]} />
            <meshStandardMaterial color="#9E9E9E" />
          </mesh>
        </>
      ) : shape === "stove" ? (
        <>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={item.color} roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Burners */}
          {[
            [-w / 4, -d / 4],
            [w / 4, -d / 4],
            [-w / 4, d / 4],
            [w / 4, d / 4],
          ].map(([bx, bz], i) => (
            <mesh key={i} position={[bx, h + 0.005, bz]}>
              <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
              <meshStandardMaterial color="#1A1A1A" />
            </mesh>
          ))}
        </>
      ) : shape === "washing" ? (
        <>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={item.color} roughness={0.3} />
          </mesh>
          <mesh position={[0, h * 0.65, d / 2 + 0.005]}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
            <meshPhysicalMaterial color="#90A4AE" transparent opacity={0.4} roughness={0.05} />
          </mesh>
        </>
      ) : shape === "sofa" ? (
        <>
          {/* Base */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.4, d]} />
            <meshStandardMaterial color={item.color} roughness={0.9} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.55, -d / 2 + 0.1]} castShadow>
            <boxGeometry args={[w, 0.5, 0.2]} />
            <meshStandardMaterial color={item.color} roughness={0.9} />
          </mesh>
          {/* Arms */}
          <mesh position={[-w / 2 + 0.08, 0.4, 0]} castShadow>
            <boxGeometry args={[0.16, 0.5, d]} />
            <meshStandardMaterial color={item.color} roughness={0.9} />
          </mesh>
          <mesh position={[w / 2 - 0.08, 0.4, 0]} castShadow>
            <boxGeometry args={[0.16, 0.5, d]} />
            <meshStandardMaterial color={item.color} roughness={0.9} />
          </mesh>
          {/* Cushions */}
          <mesh position={[-w / 4, 0.45, 0.05]} castShadow>
            <boxGeometry args={[w / 3, 0.1, d * 0.7]} />
            <meshStandardMaterial color={item.color} roughness={1} />
          </mesh>
          <mesh position={[w / 4, 0.45, 0.05]} castShadow>
            <boxGeometry args={[w / 3, 0.1, d * 0.7]} />
            <meshStandardMaterial color={item.color} roughness={1} />
          </mesh>
        </>
      ) : shape === "chair" ? (
        <>
          {/* Seat */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.1, d]} />
            <meshStandardMaterial color={item.color} roughness={0.8} />
          </mesh>
          {/* Legs */}
          {[
            [-w / 2 + 0.04, -d / 2 + 0.04],
            [w / 2 - 0.04, -d / 2 + 0.04],
            [-w / 2 + 0.04, d / 2 - 0.04],
            [w / 2 - 0.04, d / 2 - 0.04],
          ].map(([lx, lz], i) => (
            <mesh key={i} position={[lx, 0.22, lz]} castShadow>
              <boxGeometry args={[0.04, 0.45, 0.04]} />
              <meshStandardMaterial color="#3E2723" />
            </mesh>
          ))}
          {/* Backrest */}
          <mesh position={[0, 0.7, -d / 2 + 0.04]} castShadow>
            <boxGeometry args={[w, 0.5, 0.05]} />
            <meshStandardMaterial color={item.color} roughness={0.8} />
          </mesh>
        </>
      ) : shape === "table" ? (
        <>
          {/* Top */}
          <mesh position={[0, h - 0.04, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.05, d]} />
            <meshStandardMaterial color={item.color} roughness={0.5} />
          </mesh>
          {/* Legs */}
          {[
            [-w / 2 + 0.05, -d / 2 + 0.05],
            [w / 2 - 0.05, -d / 2 + 0.05],
            [-w / 2 + 0.05, d / 2 - 0.05],
            [w / 2 - 0.05, d / 2 - 0.05],
          ].map(([lx, lz], i) => (
            <mesh key={i} position={[lx, (h - 0.04) / 2, lz]} castShadow>
              <boxGeometry args={[0.06, h - 0.04, 0.06]} />
              <meshStandardMaterial color={item.color} roughness={0.5} />
            </mesh>
          ))}
        </>
      ) : shape === "bed" ? (
        <>
          {/* Frame */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.3, d]} />
            <meshStandardMaterial color="#6D4C41" roughness={0.7} />
          </mesh>
          {/* Mattress */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[w - 0.05, 0.2, d - 0.05]} />
            <meshStandardMaterial color={item.color} roughness={1} />
          </mesh>
          {/* Headboard */}
          <mesh position={[0, 0.5, -d / 2 + 0.05]} castShadow>
            <boxGeometry args={[w, 0.6, 0.1]} />
            <meshStandardMaterial color="#6D4C41" roughness={0.7} />
          </mesh>
          {/* Pillows */}
          <mesh position={[-w / 4, 0.52, -d / 4]} castShadow>
            <boxGeometry args={[w / 3, 0.08, d / 4]} />
            <meshStandardMaterial color="#FAFAFA" roughness={1} />
          </mesh>
          <mesh position={[w / 4, 0.52, -d / 4]} castShadow>
            <boxGeometry args={[w / 3, 0.08, d / 4]} />
            <meshStandardMaterial color="#FAFAFA" roughness={1} />
          </mesh>
        </>
      ) : shape === "shelf" || shape === "wardrobe" ? (
        <>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={item.color} roughness={0.6} />
          </mesh>
          {/* Shelf lines */}
          {Array.from({ length: Math.floor(h / 0.4) }).map((_, i) => (
            <mesh key={i} position={[0, 0.3 + i * 0.4, d / 2 + 0.005]}>
              <boxGeometry args={[w * 0.9, 0.02, 0.01]} />
              <meshStandardMaterial color="#3E2723" />
            </mesh>
          ))}
          {/* Door handles for wardrobe */}
          {shape === "wardrobe" && (
            <>
              <mesh position={[-0.05, h / 2, d / 2 + 0.005]}>
                <boxGeometry args={[0.02, 0.15, 0.02]} />
                <meshStandardMaterial color="#37474F" metalness={0.8} />
              </mesh>
              <mesh position={[0.05, h / 2, d / 2 + 0.005]}>
                <boxGeometry args={[0.02, 0.15, 0.02]} />
                <meshStandardMaterial color="#37474F" metalness={0.8} />
              </mesh>
            </>
          )}
        </>
      ) : shape === "counter" ? (
        <>
          <mesh position={[0, h / 2 - 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h - 0.05, d]} />
            <meshStandardMaterial color={item.color} roughness={0.5} />
          </mesh>
          {/* Countertop */}
          <mesh position={[0, h - 0.02, 0]} castShadow>
            <boxGeometry args={[w + 0.02, 0.04, d + 0.02]} />
            <meshStandardMaterial color="#37474F" roughness={0.3} metalness={0.3} />
          </mesh>
        </>
      ) : shape === "cylinder" ? (
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[w / 2, w / 2, h, 24]} />
          <meshStandardMaterial color={item.color} roughness={0.6} />
        </mesh>
      ) : shape === "sphere" ? (
        <mesh position={[0, h / 2, 0]} castShadow>
          <sphereGeometry args={[w / 2, 24, 24]} />
          <meshStandardMaterial color={item.color} roughness={0.6} />
        </mesh>
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
  const room = useEditorStore((s) => s.project.rooms.find((r) => r.id === s.project.activeRoomId) || s.project.rooms[0]);
  const walls = room?.walls || [];
  // Compute bounding box of all walls
  const box = useMemo(() => {
    const pts = walls.flatMap((w) => [[w.x1, w.y1], [w.x2, w.y2]]);
    if (pts.length === 0) return null;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, [walls]);

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
  const room = useEditorStore((s) => s.project.rooms.find((r) => r.id === s.project.activeRoomId) || s.project.rooms[0]);
  const walls = room?.walls || [];
  const items = room?.items || [];
  const selectedId = useEditorStore((s) => s.selectedId);
  const select = useEditorStore((s) => s.select);

  // Compute camera target as center of project
  const target = useMemo(() => {
    const pts = walls.flatMap((w) => [[w.x1, w.y1], [w.x2, w.y2]]);
    const itemPts = items.map((i) => [i.x, i.y]);
    const all = [...pts, ...itemPts];
    if (all.length === 0) return [0, 0, 0] as [number, number, number];
    const xs = all.map((p) => p[0]);
    const ys = all.map((p) => p[1]);
    return [
      ((Math.min(...xs) + Math.max(...xs)) / 2) * CM_TO_M,
      1.5,
      ((Math.min(...ys) + Math.max(...ys)) / 2) * CM_TO_M,
    ] as [number, number, number];
  }, [walls, items]);

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

        {walls.map((w) => (
          <Wall3D key={w.id} wall={w} />
        ))}

        {items.map((it) => (
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
