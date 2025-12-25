/**
 * Panel3DViewer: 3D Physical Panel Layout using React Three Fiber
 * Handles the physical component placement, DIN rail snapping, and wire visualization
 */

import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { ComponentInstance, Position3D } from '../types';

const Panel3DViewer: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-900 relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[500, 400, 800]} fov={50} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={100}
          maxDistance={2000}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[100, 200, 100]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-100, 200, -100]} intensity={0.5} />

        {/* Scene */}
        <Scene3D />

        {/* Grid */}
        <Grid
          args={[1000, 1000]}
          cellSize={50}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={100}
          sectionThickness={1}
          sectionColor="#4b5563"
          fadeDistance={2000}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      </Canvas>

      {/* 2D Overlay UI */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-sm font-semibold mb-2">3D Panel View</h3>
        <ComponentList3D />
      </div>
    </div>
  );
};

// Main 3D Scene
const Scene3D: React.FC = () => {
  const { panel, components, wires } = useStore();

  return (
    <group>
      {/* Panel Enclosure */}
      <PanelEnclosure config={panel} />

      {/* DIN Rails */}
      {panel.dinRails.map((rail) => (
        <DinRail key={rail.id} rail={rail} />
      ))}

      {/* Components */}
      {components.map((component) => (
        <Component3D key={component.instanceId} component={component} />
      ))}

      {/* Wires */}
      {wires.map((wire) => (
        <Wire3D key={wire.id} wire={wire} />
      ))}
    </group>
  );
};

// Panel Enclosure
const PanelEnclosure: React.FC<{ config: any }> = ({ config }) => {
  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, config.height / 2, -config.depth / 2]} receiveShadow>
        <boxGeometry args={[config.width, config.height, 2]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* Side panels */}
      <mesh position={[-config.width / 2, config.height / 2, 0]} receiveShadow>
        <boxGeometry args={[2, config.height, config.depth]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh position={[config.width / 2, config.height / 2, 0]} receiveShadow>
        <boxGeometry args={[2, config.height, config.depth]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
    </group>
  );
};

// DIN Rail
const DinRail: React.FC<{ rail: any }> = ({ rail }) => {
  return (
    <mesh position={[rail.position.x + rail.length / 2, rail.position.y, rail.position.z]} castShadow>
      <boxGeometry args={[rail.length, 5, 35]} />
      <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

// 3D Component
const Component3D: React.FC<{ component: ComponentInstance }> = ({ component }) => {
  const { getDefinition, updateComponentPhysicalPosition, setComponentPhysicallyPlaced } = useStore();
  const definition = getDefinition(component.definitionId);
  const meshRef = useRef<THREE.Mesh>(null);

  const [isDragging, setIsDragging] = useState(false);

  if (!definition) return null;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    if (isDragging && meshRef.current) {
      const position: Position3D = {
        x: meshRef.current.position.x,
        y: meshRef.current.position.y,
        z: meshRef.current.position.z,
      };
      updateComponentPhysicalPosition(component.instanceId, position);
      setComponentPhysicallyPlaced(component.instanceId, true);
      setIsDragging(false);
    }
  };

  const handlePointerMove = (e: any) => {
    if (isDragging && meshRef.current) {
      meshRef.current.position.x = e.point.x;
      meshRef.current.position.y = e.point.y;
    }
  };

  const color = component.isPhysicallyPlaced ? '#3b82f6' : '#ef4444';

  return (
    <group position={[component.physicalPosition.x, component.physicalPosition.y, component.physicalPosition.z]}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        <boxGeometry
          args={[
            definition.dimensions.width,
            definition.dimensions.height,
            definition.dimensions.depth,
          ]}
        />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Label */}
      <Html position={[0, definition.dimensions.height / 2 + 20, 0]} center>
        <div className="bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
          {component.label}
        </div>
      </Html>

      {/* Pin markers */}
      {component.physicalPins.map((pin) => (
        <mesh key={pin.logicalPinId} position={[pin.position.x, pin.position.y, pin.position.z]}>
          <sphereGeometry args={[2, 8, 8]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      ))}
    </group>
  );
};

// 3D Wire
const Wire3D: React.FC<{ wire: any }> = ({ wire }) => {
  if (wire.waypoints.length < 2) return null;

  const points = wire.waypoints.map(
    (wp: any) => new THREE.Vector3(wp.position.x, wp.position.y, wp.position.z)
  );

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 64, wire.thickness, 8, false);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial color={wire.color} />
    </mesh>
  );
};

// Component list sidebar
const ComponentList3D: React.FC = () => {
  const { components, getDefinition } = useStore();

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      <div className="text-xs font-semibold text-gray-700">Components</div>
      {components.length === 0 ? (
        <div className="text-xs text-gray-500">No components yet</div>
      ) : (
        components.map((comp) => {
          const def = getDefinition(comp.definitionId);
          return (
            <div
              key={comp.instanceId}
              className={`p-2 rounded text-xs ${
                comp.isPhysicallyPlaced ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <div className="font-medium">{comp.label}</div>
              <div className="text-gray-600">{def?.displayName}</div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Panel3DViewer;
