/**
 * AutoRouter: A* Pathfinding Algorithm for 3D Wire Routing
 * Implements Manhattan-style routing (90-degree turns) for electrical wiring
 *
 * Key Features:
 * - 3D A* pathfinding with obstacle avoidance
 * - Manhattan routing (orthogonal paths only)
 * - Cable duct preference
 * - Collision detection with components
 */

import { Position3D, ComponentInstance, PanelConfig, Waypoint } from '../types';
import * as THREE from 'three';

// ============================================================================
// GRID-BASED A* PATHFINDING
// ============================================================================

interface GridNode {
  x: number;
  y: number;
  z: number;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // Total cost (g + h)
  parent: GridNode | null;
  isObstacle: boolean;
}

interface RoutingContext {
  panel: PanelConfig;
  components: ComponentInstance[];
  gridResolution: number; // Grid cell size in mm
}

/**
 * Main auto-routing function
 * Routes a wire from start to end position avoiding obstacles
 */
export function routeWire(
  startPos: Position3D,
  endPos: Position3D,
  context: RoutingContext
): Waypoint[] {
  const { panel, components, gridResolution } = context;

  // Create 3D grid
  const grid = createGrid(panel, components, gridResolution);

  // Convert world positions to grid coordinates
  const startGrid = worldToGrid(startPos, gridResolution, panel);
  const endGrid = worldToGrid(endPos, gridResolution, panel);

  // Run A* algorithm
  const path = aStar(grid, startGrid, endGrid, gridResolution);

  // Convert grid path back to world coordinates
  const waypoints = pathToWaypoints(path, gridResolution, panel);

  // Optimize path (remove redundant points)
  const optimizedWaypoints = optimizePath(waypoints);

  return optimizedWaypoints;
}

/**
 * Creates a 3D grid representing the panel space
 * Marks occupied cells as obstacles
 */
function createGrid(
  panel: PanelConfig,
  components: ComponentInstance[],
  _resolution: number
): GridNode[][][] {
  const resolution = _resolution;
  const width = Math.ceil(panel.width / resolution);
  const height = Math.ceil(panel.height / resolution);
  const depth = Math.ceil(panel.depth / resolution);

  // Initialize grid
  const grid: GridNode[][][] = [];

  for (let x = 0; x < width; x++) {
    grid[x] = [];
    for (let y = 0; y < height; y++) {
      grid[x][y] = [];
      for (let z = 0; z < depth; z++) {
        grid[x][y][z] = {
          x,
          y,
          z,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null,
          isObstacle: false,
        };
      }
    }
  }

  // Mark obstacles (components)
  components.forEach((comp) => {
    if (!comp.isPhysicallyPlaced) return;

    // Get component bounding box
    const minX = Math.floor((comp.physicalPosition.x - panel.width / 2) / resolution);
    const maxX = Math.ceil((comp.physicalPosition.x + panel.width / 2) / resolution);
    const minY = Math.floor(comp.physicalPosition.y / resolution);
    const maxY = Math.ceil((comp.physicalPosition.y + 100) / resolution); // Assume 100mm height
    const minZ = Math.floor((comp.physicalPosition.z + panel.depth / 2) / resolution);
    const maxZ = Math.ceil((comp.physicalPosition.z + panel.depth / 2 + 50) / resolution);

    for (let x = Math.max(0, minX); x < Math.min(width, maxX); x++) {
      for (let y = Math.max(0, minY); y < Math.min(height, maxY); y++) {
        for (let z = Math.max(0, minZ); z < Math.min(depth, maxZ); z++) {
          if (grid[x] && grid[x][y] && grid[x][y][z]) {
            grid[x][y][z].isObstacle = true;
          }
        }
      }
    }
  });

  return grid;
}

/**
 * A* pathfinding algorithm in 3D
 */
function aStar(
  grid: GridNode[][][],
  start: { x: number; y: number; z: number },
  end: { x: number; y: number; z: number },
  _resolution: number
): GridNode[] {
  const openSet: GridNode[] = [];
  const closedSet = new Set<string>();

  const startNode = grid[start.x]?.[start.y]?.[start.z];
  const endNode = grid[end.x]?.[end.y]?.[end.z];

  if (!startNode || !endNode) {
    console.error('Start or end node not found in grid');
    return [];
  }

  startNode.g = 0;
  startNode.h = heuristic(startNode, endNode);
  startNode.f = startNode.h;
  openSet.push(startNode);

  while (openSet.length > 0) {
    // Find node with lowest f score
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[currentIndex].f) {
        currentIndex = i;
      }
    }

    const current = openSet[currentIndex];

    // Check if we reached the goal
    if (current.x === end.x && current.y === end.y && current.z === end.z) {
      return reconstructPath(current);
    }

    // Move current from open to closed
    openSet.splice(currentIndex, 1);
    closedSet.add(`${current.x},${current.y},${current.z}`);

    // Check neighbors (Manhattan: only orthogonal moves)
    const neighbors = getManhattanNeighbors(grid, current);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y},${neighbor.z}`;

      if (closedSet.has(neighborKey) || neighbor.isObstacle) {
        continue;
      }

      const tentativeG = current.g + 1; // Cost is 1 for each step

      const neighborInOpen = openSet.find(
        (n) => n.x === neighbor.x && n.y === neighbor.y && n.z === neighbor.z
      );

      if (!neighborInOpen) {
        openSet.push(neighbor);
      } else if (tentativeG >= neighbor.g) {
        continue;
      }

      // This path is the best so far
      neighbor.parent = current;
      neighbor.g = tentativeG;
      neighbor.h = heuristic(neighbor, endNode);
      neighbor.f = neighbor.g + neighbor.h;
    }
  }

  // No path found
  console.warn('No path found');
  return [];
}

/**
 * Manhattan distance heuristic (orthogonal only)
 */
function heuristic(a: GridNode, b: GridNode): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

/**
 * Get neighbors in Manhattan style (6 directions: ±x, ±y, ±z)
 */
function getManhattanNeighbors(grid: GridNode[][][], node: GridNode): GridNode[] {
  const neighbors: GridNode[] = [];
  const directions = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ];

  for (const dir of directions) {
    const nx = node.x + dir.x;
    const ny = node.y + dir.y;
    const nz = node.z + dir.z;

    if (
      nx >= 0 &&
      nx < grid.length &&
      ny >= 0 &&
      ny < grid[0].length &&
      nz >= 0 &&
      nz < grid[0][0].length
    ) {
      neighbors.push(grid[nx][ny][nz]);
    }
  }

  return neighbors;
}

/**
 * Reconstruct path from goal to start
 */
function reconstructPath(endNode: GridNode): GridNode[] {
  const path: GridNode[] = [];
  let current: GridNode | null = endNode;

  while (current) {
    path.unshift(current);
    current = current.parent;
  }

  return path;
}

/**
 * Convert world coordinates to grid coordinates
 */
function worldToGrid(
  pos: Position3D,
  resolution: number,
  panel: PanelConfig
): { x: number; y: number; z: number } {
  return {
    x: Math.floor((pos.x + panel.width / 2) / resolution),
    y: Math.floor(pos.y / resolution),
    z: Math.floor((pos.z + panel.depth / 2) / resolution),
  };
}

/**
 * Convert grid path to world coordinate waypoints
 */
function pathToWaypoints(path: GridNode[], resolution: number, panel: PanelConfig): Waypoint[] {
  return path.map((node) => ({
    position: {
      x: node.x * resolution - panel.width / 2,
      y: node.y * resolution,
      z: node.z * resolution - panel.depth / 2,
    },
    isControlPoint: false,
  }));
}

/**
 * Optimize path by removing redundant waypoints
 * Keeps only points where direction changes
 */
function optimizePath(waypoints: Waypoint[]): Waypoint[] {
  if (waypoints.length <= 2) return waypoints;

  const optimized: Waypoint[] = [waypoints[0]];

  for (let i = 1; i < waypoints.length - 1; i++) {
    const prev = waypoints[i - 1].position;
    const curr = waypoints[i].position;
    const next = waypoints[i + 1].position;

    // Calculate direction vectors
    const dir1 = {
      x: curr.x - prev.x,
      y: curr.y - prev.y,
      z: curr.z - prev.z,
    };

    const dir2 = {
      x: next.x - curr.x,
      y: next.y - curr.y,
      z: next.z - curr.z,
    };

    // Keep waypoint if direction changes
    if (dir1.x !== dir2.x || dir1.y !== dir2.y || dir1.z !== dir2.z) {
      optimized.push(waypoints[i]);
    }
  }

  optimized.push(waypoints[waypoints.length - 1]);

  return optimized;
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

/**
 * Check if a component collides with existing components
 */
export function checkCollision(
  component: ComponentInstance,
  existingComponents: ComponentInstance[]
): boolean {
  if (!component.isPhysicallyPlaced) return false;

  const box1 = new THREE.Box3(
    new THREE.Vector3(
      component.physicalPosition.x - 25, // Assume 50mm width
      component.physicalPosition.y,
      component.physicalPosition.z - 25
    ),
    new THREE.Vector3(
      component.physicalPosition.x + 25,
      component.physicalPosition.y + 100, // Assume 100mm height
      component.physicalPosition.z + 25
    )
  );

  for (const other of existingComponents) {
    if (other.instanceId === component.instanceId || !other.isPhysicallyPlaced) continue;

    const box2 = new THREE.Box3(
      new THREE.Vector3(
        other.physicalPosition.x - 25,
        other.physicalPosition.y,
        other.physicalPosition.z - 25
      ),
      new THREE.Vector3(
        other.physicalPosition.x + 25,
        other.physicalPosition.y + 100,
        other.physicalPosition.z + 25
      )
    );

    if (box1.intersectsBox(box2)) {
      return true;
    }
  }

  return false;
}

/**
 * Snap component to nearest DIN rail position
 */
export function snapToDinRail(
  position: Position3D,
  panel: PanelConfig
): { position: Position3D; railId: string; slot: number } | null {
  const snapDistance = 30; // Max distance to snap (mm)

  for (const rail of panel.dinRails) {
    const railY = rail.position.y;
    const railZ = rail.position.z;

    // Check if close to this rail
    if (Math.abs(position.y - railY) < snapDistance && Math.abs(position.z - railZ) < snapDistance) {
      // Snap to rail
      const moduleWidth = 17.5; // Standard DIN rail module width
      const slot = Math.round((position.x - rail.position.x) / moduleWidth);

      return {
        position: {
          x: rail.position.x + slot * moduleWidth,
          y: railY,
          z: railZ,
        },
        railId: rail.id,
        slot,
      };
    }
  }

  return null;
}
