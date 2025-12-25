# Electrical Panel Designer - MVP

An AI-Powered electrical panel design tool that enables users to create logical schematics and automatically generate 3D physical layouts with intelligent wire routing.

## Features

- **Digital Twin Architecture**: Bidirectional sync between logical schematic and physical 3D layout
- **Component Library**: Pre-loaded with real components from Siemens, Schneider, ABB, Phoenix Contact, and more
- **Schematic Editor**: Node-based logical circuit design using React Flow
- **3D Panel Viewer**: Interactive 3D panel layout with React Three Fiber
- **DIN Rail Snapping**: Automatic component alignment to DIN rails
- **Auto Wire Routing**: A* pathfinding algorithm for Manhattan-style wire routing
- **Collision Detection**: Prevents component overlap in 3D space

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI**: Tailwind CSS
- **2D Schematic**: React Flow (xyflow)
- **3D Graphics**: React Three Fiber + Drei
- **State Management**: Zustand with Immer
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
autopaneldesign.com/
├── src/
│   ├── components/
│   │   ├── SchematicCanvas.tsx    # 2D schematic view (React Flow)
│   │   ├── ComponentNode.tsx      # Custom node component
│   │   └── Panel3DViewer.tsx      # 3D panel view (R3F)
│   ├── data/
│   │   └── componentLibrary.ts    # Pre-defined electrical components
│   ├── hooks/
│   │   └── useInitializeApp.ts    # App initialization
│   ├── utils/
│   │   └── AutoRouter.ts          # A* wire routing algorithm
│   ├── types.ts                   # TypeScript type definitions
│   ├── store.ts                   # Zustand state management
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Usage Guide

### Adding Components

1. Drag components from the palette on the left schematic view
2. Components automatically appear in the 3D view (unplaced state - red)
3. Position components in the 3D view by dragging them onto DIN rails

### Creating Connections

1. In the schematic view, drag from an output pin to an input pin
2. Wire automatically appears in 3D view connecting the components
3. Auto-routing calculates the optimal path avoiding obstacles

### Component States

- **Red**: Component added but not physically placed in 3D
- **Green**: Component placed and positioned on DIN rail
- **Blue**: Connections/wires between components

## Component Library

The system includes components from:

- **Siemens**: MCBs, PLCs (S7-1200)
- **Schneider Electric**: Multi-pole MCBs
- **ABB**: Contactors
- **Finder**: Relays
- **Phoenix Contact**: Power supplies
- **WAGO**: Terminal blocks

## Algorithms

### A* Wire Routing

The auto-routing engine uses:
- 3D grid-based A* pathfinding
- Manhattan distance heuristic
- Obstacle avoidance (components)
- Path optimization (removes redundant waypoints)

### Collision Detection

Uses Three.js bounding boxes to prevent component overlap in 3D space.

## Roadmap

Phase 2 Features:
- Advanced wire bundling
- Cable duct routing
- Bill of Materials (BOM) export
- PDF schematic export
- DXF/STEP 3D export
- Component rotation
- Multi-panel support
- Real-time collaboration

## License

MIT

## Repository

https://github.com/chatgptnotes/autopaneldesign.com

## Version

1.0 - Initial MVP Release

---

Version 1.0 | Last updated: ${new Date().toLocaleDateString()} | autopaneldesign.com
