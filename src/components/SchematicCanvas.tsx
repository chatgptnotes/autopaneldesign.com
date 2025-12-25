/**
 * SchematicCanvas: 2D Logical Schematic View using React Flow
 * Handles the circuit logic representation with drag-drop components and connections
 */

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../store';
import { ComponentType } from '../types';
import ComponentNode from './ComponentNode';

const nodeTypes = {
  component: ComponentNode,
};

const SchematicCanvas: React.FC = () => {
  const {
    components,
    logicalConnections,
    componentLibrary,
    addComponent,
    addConnection,
    removeConnection,
    updateComponentSchematicPosition,
  } = useStore();

  // Convert store components to React Flow nodes
  const nodes = useMemo<Node[]>(() => {
    return components.map((comp) => {
      const definition = componentLibrary.find((d) => d.id === comp.definitionId);

      return {
        id: comp.instanceId,
        type: 'component',
        position: comp.schematicPosition,
        data: {
          component: comp,
          definition: definition,
        },
      };
    });
  }, [components, componentLibrary]);

  // Convert store connections to React Flow edges
  const edges = useMemo<Edge[]>(() => {
    return logicalConnections.map((conn) => ({
      id: conn.id,
      source: conn.fromPinId.split('_')[0], // Extract component ID from pin ID
      target: conn.toPinId.split('_')[0],
      sourceHandle: conn.fromPinId,
      targetHandle: conn.toPinId,
      type: 'smoothstep',
      animated: true,
      label: conn.label,
      style: { stroke: getEdgeColor(conn.wireType), strokeWidth: 2 },
    }));
  }, [logicalConnections]);

  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

  // Sync local state with global store
  React.useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  React.useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  // Handle node drag end - update store
  const handleNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      updateComponentSchematicPosition(node.id, node.position);
    },
    [updateComponentSchematicPosition]
  );

  // Handle connection creation
  const handleConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target && params.sourceHandle && params.targetHandle) {
        addConnection(params.sourceHandle, params.targetHandle);
      }
    },
    [addConnection]
  );

  // Handle edge deletion
  const handleEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach((edge) => {
        removeConnection(edge.id);
      });
    },
    [removeConnection]
  );

  // Drag and drop from component palette
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const definitionId = event.dataTransfer.getData('application/reactflow');

      if (definitionId) {
        const definition = componentLibrary.find((d) => d.id === definitionId);

        if (definition) {
          const position = {
            x: event.clientX - reactFlowBounds.left - 50,
            y: event.clientY - reactFlowBounds.top - 25,
          };

          addComponent(definition, position);
        }
      }
    },
    [componentLibrary, addComponent]
  );

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeDragStop={handleNodeDragStop}
        onEdgesDelete={handleEdgesDelete}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#ddd" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const comp = components.find((c) => c.instanceId === node.id);
            return comp?.isPhysicallyPlaced ? '#10b981' : '#ef4444';
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />

        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold mb-2">Component Palette</h3>
          <ComponentPalette />
        </Panel>

        <Panel position="top-right" className="bg-white p-3 rounded-lg shadow-lg">
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Placed in 3D</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Not placed</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Component Palette for dragging components
const ComponentPalette: React.FC = () => {
  const { componentLibrary } = useStore();

  const handleDragStart = (event: React.DragEvent, definitionId: string) => {
    event.dataTransfer.setData('application/reactflow', definitionId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {componentLibrary.map((definition) => (
        <div
          key={definition.id}
          draggable
          onDragStart={(e) => handleDragStart(e, definition.id)}
          className="p-2 border border-gray-300 rounded cursor-move hover:bg-gray-100 transition-colors"
        >
          <div className="text-xs font-medium">{definition.displayName}</div>
          <div className="text-xs text-gray-500">{definition.type}</div>
          <div className="text-xs text-gray-400">{definition.manufacturer}</div>
        </div>
      ))}
    </div>
  );
};

// Helper function
function getEdgeColor(wireType: string): string {
  switch (wireType) {
    case 'POWER':
      return '#FF0000';
    case 'SIGNAL':
      return '#0000FF';
    case 'GROUND':
      return '#00FF00';
    default:
      return '#888888';
  }
}

export default SchematicCanvas;
