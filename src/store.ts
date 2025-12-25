/**
 * Zustand Store: Digital Twin Synchronization
 * Manages the bidirectional sync between Schematic (Logic) and 3D Panel (Physical)
 *
 * Key Principles:
 * 1. Single source of truth for component instances
 * 2. Automatic sync: Add in schematic -> appears in 3D (unplaced)
 * 3. Wire connections drive 3D wire routing
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  ComponentInstance,
  ComponentDefinition,
  LogicalConnection,
  WireInstance,
  PanelConfig,
  Position3D,
  PhysicalPin,
  ProjectState,
} from './types';

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface StoreState {
  // Project metadata
  projectId: string;
  projectName: string;

  // Component library (templates)
  componentLibrary: ComponentDefinition[];

  // Design state
  components: ComponentInstance[];
  logicalConnections: LogicalConnection[];
  wires: WireInstance[];

  // Panel configuration
  panel: PanelConfig;

  // UI state
  selectedComponentId: string | null;
  selectedConnectionId: string | null;

  // Actions
  // Component management
  addComponent: (definition: ComponentDefinition, schematicPosition: { x: number; y: number }) => string;
  removeComponent: (instanceId: string) => void;
  updateComponentSchematicPosition: (instanceId: string, position: { x: number; y: number }) => void;
  updateComponentPhysicalPosition: (instanceId: string, position: Position3D, dinRailSlot?: number) => void;
  setComponentPhysicallyPlaced: (instanceId: string, placed: boolean) => void;

  // Connection management
  addConnection: (fromPinId: string, toPinId: string) => string;
  removeConnection: (connectionId: string) => void;

  // Wire management
  addWire: (logicalConnectionId: string) => string;
  removeWire: (wireId: string) => void;
  updateWireWaypoints: (wireId: string, waypoints: WireInstance['waypoints']) => void;

  // Selection
  selectComponent: (instanceId: string | null) => void;
  selectConnection: (connectionId: string | null) => void;

  // Component library
  loadComponentLibrary: (library: ComponentDefinition[]) => void;

  // Project management
  loadProject: (project: ProjectState) => void;
  exportProject: () => ProjectState;

  // Helpers
  getComponent: (instanceId: string) => ComponentInstance | undefined;
  getDefinition: (definitionId: string) => ComponentDefinition | undefined;
  getConnection: (connectionId: string) => LogicalConnection | undefined;
  getWireForConnection: (connectionId: string) => WireInstance | undefined;
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useStore = create<StoreState>()(
  immer((set, get) => ({
    // Initial state
    projectId: 'new-project',
    projectName: 'Untitled Panel Design',
    componentLibrary: [],
    components: [],
    logicalConnections: [],
    wires: [],
    panel: {
      id: 'panel-1',
      width: 800,
      height: 600,
      depth: 200,
      dinRails: [
        {
          id: 'dinrail-1',
          position: { x: -350, y: 200, z: -50 },
          length: 700,
          orientation: 'horizontal',
          maxModules: 40,
        },
        {
          id: 'dinrail-2',
          position: { x: -350, y: 100, z: -50 },
          length: 700,
          orientation: 'horizontal',
          maxModules: 40,
        },
        {
          id: 'dinrail-3',
          position: { x: -350, y: 0, z: -50 },
          length: 700,
          orientation: 'horizontal',
          maxModules: 40,
        },
      ],
    },
    selectedComponentId: null,
    selectedConnectionId: null,

    // ========================================================================
    // COMPONENT MANAGEMENT
    // ========================================================================

    addComponent: (definition, schematicPosition) => {
      const instanceId = `${definition.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      set((state) => {
        // Create physical pins based on logical pins
        const physicalPins: PhysicalPin[] = definition.logicalPins.map((logicalPin) => ({
          logicalPinId: logicalPin.id,
          position: {
            x: logicalPin.relativePosition.x * definition.dimensions.width,
            y: logicalPin.relativePosition.y * definition.dimensions.height,
            z: 0,
          },
          connectionPoint: { x: 0, y: 0, z: 0 } as any, // Will be computed when placed
        }));

        const newComponent: ComponentInstance = {
          instanceId,
          definitionId: definition.id,
          label: `${definition.type} ${state.components.filter(c => c.definitionId === definition.id).length + 1}`,
          schematicPosition,
          physicalPosition: { x: 0, y: 0, z: 0 }, // Default position
          isPhysicallyPlaced: false,
          physicalPins,
        };

        state.components.push(newComponent);
      });

      return instanceId;
    },

    removeComponent: (instanceId) => {
      set((state) => {
        // Remove component
        state.components = state.components.filter((c) => c.instanceId !== instanceId);

        // Remove connections involving this component's pins
        const componentDef = get().getDefinition(
          state.components.find((c) => c.instanceId === instanceId)?.definitionId || ''
        );

        if (componentDef) {
          const pinIds = componentDef.logicalPins.map((p) => p.id);
          state.logicalConnections = state.logicalConnections.filter(
            (conn) => !pinIds.includes(conn.fromPinId) && !pinIds.includes(conn.toPinId)
          );
        }

        // Remove associated wires
        const connectionIds = state.logicalConnections.map((c) => c.id);
        state.wires = state.wires.filter((w) => connectionIds.includes(w.logicalConnectionId));
      });
    },

    updateComponentSchematicPosition: (instanceId, position) => {
      set((state) => {
        const component = state.components.find((c) => c.instanceId === instanceId);
        if (component) {
          component.schematicPosition = position;
        }
      });
    },

    updateComponentPhysicalPosition: (instanceId, position, dinRailSlot) => {
      set((state) => {
        const component = state.components.find((c) => c.instanceId === instanceId);
        if (component) {
          component.physicalPosition = position;
          if (dinRailSlot !== undefined) {
            component.dinRailSlot = dinRailSlot;
          }

          // Update physical pin world positions
          const definition = get().getDefinition(component.definitionId);
          if (definition) {
            component.physicalPins.forEach((pin) => {
              pin.connectionPoint = {
                x: position.x + pin.position.x,
                y: position.y + pin.position.y,
                z: position.z + pin.position.z,
              } as any;
            });
          }
        }
      });
    },

    setComponentPhysicallyPlaced: (instanceId, placed) => {
      set((state) => {
        const component = state.components.find((c) => c.instanceId === instanceId);
        if (component) {
          component.isPhysicallyPlaced = placed;
        }
      });
    },

    // ========================================================================
    // CONNECTION MANAGEMENT
    // ========================================================================

    addConnection: (fromPinId, toPinId) => {
      const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      set((state) => {
        const newConnection: LogicalConnection = {
          id: connectionId,
          fromPinId,
          toPinId,
          wireType: 'SIGNAL' as any, // Default, could be determined by pin types
        };

        state.logicalConnections.push(newConnection);
      });

      // Automatically create a wire in 3D space
      get().addWire(connectionId);

      return connectionId;
    },

    removeConnection: (connectionId) => {
      set((state) => {
        state.logicalConnections = state.logicalConnections.filter((c) => c.id !== connectionId);
        state.wires = state.wires.filter((w) => w.logicalConnectionId !== connectionId);
      });
    },

    // ========================================================================
    // WIRE MANAGEMENT
    // ========================================================================

    addWire: (logicalConnectionId) => {
      const wireId = `wire_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      set((state) => {
        const connection = state.logicalConnections.find((c) => c.id === logicalConnectionId);
        if (!connection) return;

        // Find the physical positions of the connected pins
        // This will be computed by the AutoRouter in practice
        const newWire: WireInstance = {
          id: wireId,
          logicalConnectionId,
          waypoints: [], // Will be populated by AutoRouter
          wireType: connection.wireType,
          color: getWireColor(connection.wireType),
          thickness: 2,
          routingMethod: 'manhattan',
        };

        state.wires.push(newWire);
      });

      return wireId;
    },

    removeWire: (wireId) => {
      set((state) => {
        state.wires = state.wires.filter((w) => w.id !== wireId);
      });
    },

    updateWireWaypoints: (wireId, waypoints) => {
      set((state) => {
        const wire = state.wires.find((w) => w.id === wireId);
        if (wire) {
          wire.waypoints = waypoints;

          // Calculate wire length
          let length = 0;
          for (let i = 1; i < waypoints.length; i++) {
            const prev = waypoints[i - 1].position;
            const curr = waypoints[i].position;
            length += Math.sqrt(
              Math.pow(curr.x - prev.x, 2) +
              Math.pow(curr.y - prev.y, 2) +
              Math.pow(curr.z - prev.z, 2)
            );
          }
          wire.length = length;
        }
      });
    },

    // ========================================================================
    // SELECTION
    // ========================================================================

    selectComponent: (instanceId) => {
      set({ selectedComponentId: instanceId });
    },

    selectConnection: (connectionId) => {
      set({ selectedConnectionId: connectionId });
    },

    // ========================================================================
    // COMPONENT LIBRARY
    // ========================================================================

    loadComponentLibrary: (library) => {
      set({ componentLibrary: library });
    },

    // ========================================================================
    // PROJECT MANAGEMENT
    // ========================================================================

    loadProject: (project) => {
      set({
        projectId: project.id,
        projectName: project.name,
        componentLibrary: project.componentLibrary,
        components: project.components,
        logicalConnections: project.logicalConnections,
        wires: project.wires,
        panel: project.panel,
      });
    },

    exportProject: () => {
      const state = get();
      const project: ProjectState = {
        id: state.projectId,
        name: state.projectName,
        version: '1.0',
        created: new Date(),
        modified: new Date(),
        panel: state.panel,
        componentLibrary: state.componentLibrary,
        components: state.components,
        logicalConnections: state.logicalConnections,
        wires: state.wires,
      };
      return project;
    },

    // ========================================================================
    // HELPERS
    // ========================================================================

    getComponent: (instanceId) => {
      return get().components.find((c) => c.instanceId === instanceId);
    },

    getDefinition: (definitionId) => {
      return get().componentLibrary.find((d) => d.id === definitionId);
    },

    getConnection: (connectionId) => {
      return get().logicalConnections.find((c) => c.id === connectionId);
    },

    getWireForConnection: (connectionId) => {
      return get().wires.find((w) => w.logicalConnectionId === connectionId);
    },
  }))
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getWireColor(wireType: WireInstance['wireType']): string {
  switch (wireType) {
    case 'POWER':
      return '#FF0000'; // Red
    case 'SIGNAL':
      return '#0000FF'; // Blue
    case 'GROUND':
      return '#00FF00'; // Green
    default:
      return '#888888'; // Gray
  }
}
