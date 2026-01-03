/**
 * Core type definitions for the Electrical Panel Design Tool
 * Defines both logical (schematic) and physical (3D) properties
 */

import { Vector3 } from 'three';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum ComponentType {
  MCB = 'MCB',              // Miniature Circuit Breaker
  RELAY = 'RELAY',
  CONTACTOR = 'CONTACTOR',
  PLC = 'PLC',              // Programmable Logic Controller
  TIMER = 'TIMER',
  SENSOR = 'SENSOR',
  TERMINAL = 'TERMINAL',
  POWER_SUPPLY = 'POWER_SUPPLY',
  MOTOR = 'MOTOR',          // Electric Motor
}

export enum PinType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  POWER = 'POWER',
  GROUND = 'GROUND',
  NEUTRAL = 'NEUTRAL',
}

export enum WireType {
  POWER = 'POWER',
  SIGNAL = 'SIGNAL',
  GROUND = 'GROUND',
}

// ============================================================================
// LOGICAL LAYER (Schematic/Circuit Logic)
// ============================================================================

/**
 * Represents a logical pin/terminal on a component
 * Used in schematic view for connections
 */
export interface LogicalPin {
  id: string;               // Unique pin identifier (e.g., "MCB1_L1")
  label: string;            // Display name (e.g., "L1", "A1", "COM")
  type: PinType;
  componentId: string;      // Parent component ID
  // Position relative to component in schematic (normalized 0-1)
  relativePosition: { x: number; y: number };
}

/**
 * Logical connection between two pins in the schematic
 */
export interface LogicalConnection {
  id: string;
  fromPinId: string;
  toPinId: string;
  wireType: WireType;
  label?: string;           // Optional wire label (e.g., "L1", "24VDC")
}

// ============================================================================
// PHYSICAL LAYER (3D Panel Layout)
// ============================================================================

/**
 * Physical dimensions and mounting properties
 */
export interface PhysicalDimensions {
  width: number;            // Width in millimeters
  height: number;           // Height in millimeters
  depth: number;            // Depth in millimeters
  dinRailModules: number;   // Number of DIN rail modules (1 module = 17.5mm)
  weight?: number;          // Weight in grams (optional)
}

/**
 * Physical position in 3D space
 */
export interface Position3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Physical pin location in 3D space (relative to component origin)
 */
export interface PhysicalPin {
  logicalPinId: string;     // Links to LogicalPin
  position: Position3D;     // Position relative to component's origin
  connectionPoint: Vector3; // Actual 3D world coordinates (computed)
}

/**
 * Mounting configuration for DIN rail
 */
export interface MountingConfig {
  isDinRailMountable: boolean;
  dinRailPosition?: number; // Position along DIN rail (in modules)
  orientation?: 'horizontal' | 'vertical';
}

// ============================================================================
// COMPONENT DEFINITION (Digital Twin)
// ============================================================================

/**
 * Complete component definition combining logical and physical properties
 * This is the "master template" from the component library
 */
export interface ComponentDefinition {
  id: string;               // Template ID (e.g., "siemens_3rv2011-1ha10")
  type: ComponentType;
  manufacturer: string;
  modelNumber: string;
  displayName: string;
  description?: string;

  // Logical properties
  logicalPins: LogicalPin[];

  // Physical properties
  dimensions: PhysicalDimensions;
  mounting: MountingConfig;

  // 3D model reference (could be a path to GLTF/GLB or procedural generation)
  modelPath?: string;
  color?: string;           // Default color for procedural rendering

  // Electrical ratings (for validation)
  ratings?: {
    voltage?: number;
    current?: number;
    frequency?: number;
  };
}

// ============================================================================
// INSTANCE (Placed Component in the Design)
// ============================================================================

/**
 * An instance of a component placed in both schematic and 3D view
 * This is the actual component in the user's design
 */
export interface ComponentInstance {
  instanceId: string;       // Unique instance ID (e.g., "MCB_001")
  definitionId: string;     // Reference to ComponentDefinition
  label: string;            // User-defined label (e.g., "Motor Protection")

  // Schematic position (2D canvas coordinates)
  schematicPosition: { x: number; y: number };

  // Physical 3D position
  physicalPosition: Position3D;
  isPhysicallyPlaced: boolean; // False until user places it in 3D view

  // Physical pins with computed world positions
  physicalPins: PhysicalPin[];

  // Mounting info
  dinRailSlot?: number;     // Which slot on the DIN rail
}

// ============================================================================
// WIRE/CABLE ROUTING
// ============================================================================

/**
 * Waypoint in 3D space for wire routing
 */
export interface Waypoint {
  position: Position3D;
  isControlPoint: boolean;  // True if user manually added this point
}

/**
 * Physical wire instance in 3D space
 */
export interface WireInstance {
  id: string;
  logicalConnectionId: string; // Links to LogicalConnection

  // 3D path
  waypoints: Waypoint[];

  // Visual properties
  wireType: WireType;
  color: string;
  thickness: number;        // Diameter in mm

  // Routing metadata
  routingMethod: 'manhattan' | 'bezier' | 'manual';
  length?: number;          // Computed wire length in mm
}

// ============================================================================
// PANEL CONFIGURATION
// ============================================================================

/**
 * Physical panel/enclosure properties
 */
export interface PanelConfig {
  id: string;
  width: number;            // Internal width in mm
  height: number;           // Internal height in mm
  depth: number;            // Internal depth in mm

  // DIN rail configuration
  dinRails: DinRailConfig[];

  // Cable ducts/wireways
  cableDucts?: CableDuct[];
}

export interface DinRailConfig {
  id: string;
  position: Position3D;     // Position of the rail's start point
  length: number;           // Length in mm
  orientation: 'horizontal' | 'vertical';
  maxModules: number;       // Maximum number of modules that fit
}

export interface CableDuct {
  id: string;
  path: Position3D[];       // Path of the duct in 3D space
  width: number;
  height: number;
}

// ============================================================================
// PROJECT/DESIGN STATE
// ============================================================================

/**
 * Complete project state (saved/loaded)
 */
export interface ProjectState {
  id: string;
  name: string;
  version: string;
  created: Date;
  modified: Date;

  // Panel configuration
  panel: PanelConfig;

  // Component library (available templates)
  componentLibrary: ComponentDefinition[];

  // Design data
  components: ComponentInstance[];
  logicalConnections: LogicalConnection[];
  wires: WireInstance[];

  // Metadata
  metadata?: {
    author?: string;
    client?: string;
    projectNumber?: string;
  };
}

// ============================================================================
// COLLISION & VALIDATION
// ============================================================================

/**
 * Bounding box for collision detection
 */
export interface BoundingBox {
  min: Position3D;
  max: Position3D;
}

/**
 * Collision detection result
 */
export interface CollisionResult {
  hasCollision: boolean;
  collidingWith?: string[]; // Array of component instance IDs
}

// ============================================================================
// ROUTING ALGORITHM DATA STRUCTURES
// ============================================================================

/**
 * Grid cell for A* pathfinding
 */
export interface GridCell {
  x: number;
  y: number;
  z: number;
  isObstacle: boolean;
  cost: number;             // G cost (distance from start)
  heuristic: number;        // H cost (estimated distance to goal)
  totalCost: number;        // F cost (g + h)
  parent?: GridCell;
}

/**
 * 3D grid for pathfinding
 */
export interface RoutingGrid {
  width: number;
  height: number;
  depth: number;
  cellSize: number;         // Size of each grid cell in mm
  cells: GridCell[][][];
}

// ============================================================================
// GEMINI AI INTEGRATION TYPES
// ============================================================================

/**
 * Error types for Gemini API responses
 */
export type GeminiAPIErrorType =
  | 'API_KEY_INVALID'
  | 'RATE_LIMIT'
  | 'NETWORK_ERROR'
  | 'PARSE_ERROR'
  | 'UNKNOWN';

/**
 * Structured error from Gemini API
 */
export interface GeminiAPIError {
  type: GeminiAPIErrorType;
  message: string;
  details?: string;
}

/**
 * Pin definition for AI-generated new components
 */
export interface NewPinDefinition {
  label: string;
  type: PinType;
  relativePosition: { x: number; y: number };
}

/**
 * Specification for a new component created by AI (not in library)
 */
export interface NewComponentSpec {
  id: string;
  type: ComponentType;
  label: string;
  suggestedManufacturer?: string;
  suggestedModelNumber?: string;
  ratings?: {
    voltage?: number;
    current?: number;
    frequency?: number;
  };
  pinDefinitions: NewPinDefinition[];
}

/**
 * Component as returned by Gemini AI
 */
export interface GeminiComponentSpec {
  id: string;
  type: string;
  label: string;
  libraryId: string | null;  // null if AI-created new component
  position: { x: number; y: number };
}

/**
 * Connection as returned by Gemini AI
 */
export interface GeminiConnectionSpec {
  from: { componentId: string; pin: string };
  to: { componentId: string; pin: string };
  wireType: string;
  label?: string;
}

/**
 * Complete response structure from Gemini AI
 */
export interface GeminiCircuitResponse {
  description: string;
  reasoning?: string;
  components: GeminiComponentSpec[];
  connections: GeminiConnectionSpec[];
  newComponents?: NewComponentSpec[];
}
