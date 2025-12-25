/**
 * Component Library: Pre-defined electrical components
 * Real-world components from major manufacturers
 */

import { ComponentDefinition, ComponentType, PinType } from '../types';

export const componentLibrary: ComponentDefinition[] = [
  // ========================================================================
  // MINIATURE CIRCUIT BREAKERS (MCBs)
  // ========================================================================
  {
    id: 'siemens-5sy6-116-7',
    type: ComponentType.MCB,
    manufacturer: 'Siemens',
    modelNumber: '5SY6 116-7',
    displayName: 'MCB 16A 1P',
    description: 'Single-pole miniature circuit breaker, 16A, C-curve',
    logicalPins: [
      {
        id: 'siemens-5sy6-116-7_L1',
        label: 'L1',
        type: PinType.POWER,
        componentId: 'siemens-5sy6-116-7',
        relativePosition: { x: 0, y: 0.2 },
      },
      {
        id: 'siemens-5sy6-116-7_OUT',
        label: 'OUT',
        type: PinType.OUTPUT,
        componentId: 'siemens-5sy6-116-7',
        relativePosition: { x: 1, y: 0.2 },
      },
    ],
    dimensions: {
      width: 17.5,
      height: 85,
      depth: 70,
      dinRailModules: 1,
      weight: 120,
    },
    mounting: {
      isDinRailMountable: true,
      orientation: 'vertical',
    },
    color: '#2563eb',
    ratings: {
      voltage: 230,
      current: 16,
      frequency: 50,
    },
  },

  {
    id: 'schneider-a9f74332',
    type: ComponentType.MCB,
    manufacturer: 'Schneider Electric',
    modelNumber: 'A9F74332',
    displayName: 'MCB 32A 3P',
    description: 'Three-pole miniature circuit breaker, 32A, C-curve',
    logicalPins: [
      {
        id: 'schneider-a9f74332_L1',
        label: 'L1',
        type: PinType.POWER,
        componentId: 'schneider-a9f74332',
        relativePosition: { x: 0, y: 0.2 },
      },
      {
        id: 'schneider-a9f74332_L2',
        label: 'L2',
        type: PinType.POWER,
        componentId: 'schneider-a9f74332',
        relativePosition: { x: 0, y: 0.4 },
      },
      {
        id: 'schneider-a9f74332_L3',
        label: 'L3',
        type: PinType.POWER,
        componentId: 'schneider-a9f74332',
        relativePosition: { x: 0, y: 0.6 },
      },
      {
        id: 'schneider-a9f74332_OUT1',
        label: 'OUT1',
        type: PinType.OUTPUT,
        componentId: 'schneider-a9f74332',
        relativePosition: { x: 1, y: 0.2 },
      },
      {
        id: 'schneider-a9f74332_OUT2',
        label: 'OUT2',
        type: PinType.OUTPUT,
        componentId: 'schneider-a9f74332',
        relativePosition: { x: 1, y: 0.4 },
      },
      {
        id: 'schneider-a9f74332_OUT3',
        label: 'OUT3',
        type: PinType.OUTPUT,
        componentId: 'schneider-a9f74332',
        relativePosition: { x: 1, y: 0.6 },
      },
    ],
    dimensions: {
      width: 52.5, // 3 modules
      height: 85,
      depth: 70,
      dinRailModules: 3,
      weight: 280,
    },
    mounting: {
      isDinRailMountable: true,
      orientation: 'vertical',
    },
    color: '#059669',
    ratings: {
      voltage: 400,
      current: 32,
      frequency: 50,
    },
  },

  // ========================================================================
  // CONTACTORS
  // ========================================================================
  {
    id: 'abb-a9-30-10',
    type: ComponentType.CONTACTOR,
    manufacturer: 'ABB',
    modelNumber: 'A9-30-10',
    displayName: 'Contactor 25A',
    description: '3-pole contactor with 1NO auxiliary contact, 25A, 230V AC coil',
    logicalPins: [
      {
        id: 'abb-a9-30-10_A1',
        label: 'A1',
        type: PinType.INPUT,
        componentId: 'abb-a9-30-10',
        relativePosition: { x: 0, y: 0.15 },
      },
      {
        id: 'abb-a9-30-10_A2',
        label: 'A2',
        type: PinType.INPUT,
        componentId: 'abb-a9-30-10',
        relativePosition: { x: 0, y: 0.25 },
      },
      {
        id: 'abb-a9-30-10_L1',
        label: 'L1',
        type: PinType.POWER,
        componentId: 'abb-a9-30-10',
        relativePosition: { x: 0, y: 0.5 },
      },
      {
        id: 'abb-a9-30-10_L2',
        label: 'L2',
        type: PinType.POWER,
        componentId: 'abb-a9-30-10',
        relativePosition: { x: 0, y: 0.6 },
      },
      {
        id: 'abb-a9-30-10_L3',
        label: 'L3',
        type: PinType.POWER,
        componentId: 'abb-a9-30-10',
        relativePosition: { x: 0, y: 0.7 },
      },
      {
        id: 'abb-a9-30-10_T1',
        label: 'T1',
        type: PinType.OUTPUT,
        componentId: 'abb-a9-30-10',
        relativePosition: { x: 1, y: 0.5 },
      },
      {
        id: 'abb-a9-30-10_T2',
        label: 'T2',
        type: PinType.OUTPUT,
        componentId: 'abb-a9-30-10',
        relativePosition: { x: 1, y: 0.6 },
      },
      {
        id: 'abb-a9-30-10_T3',
        label: 'T3',
        type: PinType.OUTPUT,
        componentId: 'abb-a9-30-10',
        relativePosition: { x: 1, y: 0.7 },
      },
    ],
    dimensions: {
      width: 45,
      height: 78,
      depth: 85,
      dinRailModules: 2.5,
      weight: 250,
    },
    mounting: {
      isDinRailMountable: true,
      orientation: 'vertical',
    },
    color: '#dc2626',
    ratings: {
      voltage: 400,
      current: 25,
      frequency: 50,
    },
  },

  // ========================================================================
  // RELAYS
  // ========================================================================
  {
    id: 'finder-55-34-8-230',
    type: ComponentType.RELAY,
    manufacturer: 'Finder',
    modelNumber: '55.34.8.230.0040',
    displayName: 'Relay 7A 4PDT',
    description: 'Power relay, 4 changeover contacts, 7A, 230V AC coil',
    logicalPins: [
      {
        id: 'finder-55-34-8-230_A1',
        label: 'A1',
        type: PinType.INPUT,
        componentId: 'finder-55-34-8-230',
        relativePosition: { x: 0, y: 0.3 },
      },
      {
        id: 'finder-55-34-8-230_A2',
        label: 'A2',
        type: PinType.INPUT,
        componentId: 'finder-55-34-8-230',
        relativePosition: { x: 0, y: 0.4 },
      },
      {
        id: 'finder-55-34-8-230_11',
        label: '11',
        type: PinType.INPUT,
        componentId: 'finder-55-34-8-230',
        relativePosition: { x: 0, y: 0.6 },
      },
      {
        id: 'finder-55-34-8-230_12',
        label: '12',
        type: PinType.OUTPUT,
        componentId: 'finder-55-34-8-230',
        relativePosition: { x: 1, y: 0.6 },
      },
      {
        id: 'finder-55-34-8-230_14',
        label: '14',
        type: PinType.OUTPUT,
        componentId: 'finder-55-34-8-230',
        relativePosition: { x: 1, y: 0.7 },
      },
    ],
    dimensions: {
      width: 17.5,
      height: 90,
      depth: 64,
      dinRailModules: 1,
      weight: 85,
    },
    mounting: {
      isDinRailMountable: true,
      orientation: 'vertical',
    },
    color: '#7c3aed',
    ratings: {
      voltage: 230,
      current: 7,
      frequency: 50,
    },
  },

  // ========================================================================
  // PLCs
  // ========================================================================
  {
    id: 'siemens-s7-1200-cpu1211c',
    type: ComponentType.PLC,
    manufacturer: 'Siemens',
    modelNumber: 'S7-1200 CPU1211C',
    displayName: 'PLC S7-1200',
    description: 'Compact CPU, 6 DI, 4 DO, 2 AI',
    logicalPins: [
      {
        id: 'siemens-s7-1200-cpu1211c_DI0',
        label: 'DI0',
        type: PinType.INPUT,
        componentId: 'siemens-s7-1200-cpu1211c',
        relativePosition: { x: 0, y: 0.2 },
      },
      {
        id: 'siemens-s7-1200-cpu1211c_DI1',
        label: 'DI1',
        type: PinType.INPUT,
        componentId: 'siemens-s7-1200-cpu1211c',
        relativePosition: { x: 0, y: 0.3 },
      },
      {
        id: 'siemens-s7-1200-cpu1211c_DO0',
        label: 'DO0',
        type: PinType.OUTPUT,
        componentId: 'siemens-s7-1200-cpu1211c',
        relativePosition: { x: 1, y: 0.2 },
      },
      {
        id: 'siemens-s7-1200-cpu1211c_DO1',
        label: 'DO1',
        type: PinType.OUTPUT,
        componentId: 'siemens-s7-1200-cpu1211c',
        relativePosition: { x: 1, y: 0.3 },
      },
      {
        id: 'siemens-s7-1200-cpu1211c_24V',
        label: '24V',
        type: PinType.POWER,
        componentId: 'siemens-s7-1200-cpu1211c',
        relativePosition: { x: 0, y: 0.6 },
      },
      {
        id: 'siemens-s7-1200-cpu1211c_GND',
        label: 'GND',
        type: PinType.GROUND,
        componentId: 'siemens-s7-1200-cpu1211c',
        relativePosition: { x: 0, y: 0.7 },
      },
    ],
    dimensions: {
      width: 90,
      height: 100,
      depth: 75,
      dinRailModules: 5,
      weight: 340,
    },
    mounting: {
      isDinRailMountable: true,
      orientation: 'vertical',
    },
    color: '#0891b2',
    ratings: {
      voltage: 24,
      current: 10,
    },
  },

  // ========================================================================
  // POWER SUPPLIES
  // ========================================================================
  {
    id: 'phoenix-quint-ps-100-240ac-24dc-10',
    type: ComponentType.POWER_SUPPLY,
    manufacturer: 'Phoenix Contact',
    modelNumber: 'QUINT-PS/1AC/24DC/10',
    displayName: 'Power Supply 24VDC 10A',
    description: 'DIN rail power supply, 100-240V AC input, 24V DC 10A output',
    logicalPins: [
      {
        id: 'phoenix-quint-ps-100-240ac-24dc-10_L',
        label: 'L',
        type: PinType.POWER,
        componentId: 'phoenix-quint-ps-100-240ac-24dc-10',
        relativePosition: { x: 0, y: 0.3 },
      },
      {
        id: 'phoenix-quint-ps-100-240ac-24dc-10_N',
        label: 'N',
        type: PinType.NEUTRAL,
        componentId: 'phoenix-quint-ps-100-240ac-24dc-10',
        relativePosition: { x: 0, y: 0.4 },
      },
      {
        id: 'phoenix-quint-ps-100-240ac-24dc-10_PE',
        label: 'PE',
        type: PinType.GROUND,
        componentId: 'phoenix-quint-ps-100-240ac-24dc-10',
        relativePosition: { x: 0, y: 0.5 },
      },
      {
        id: 'phoenix-quint-ps-100-240ac-24dc-10_PLUS',
        label: '+24V',
        type: PinType.OUTPUT,
        componentId: 'phoenix-quint-ps-100-240ac-24dc-10',
        relativePosition: { x: 1, y: 0.3 },
      },
      {
        id: 'phoenix-quint-ps-100-240ac-24dc-10_MINUS',
        label: '0V',
        type: PinType.OUTPUT,
        componentId: 'phoenix-quint-ps-100-240ac-24dc-10',
        relativePosition: { x: 1, y: 0.4 },
      },
    ],
    dimensions: {
      width: 70,
      height: 125,
      depth: 125,
      dinRailModules: 4,
      weight: 680,
    },
    mounting: {
      isDinRailMountable: true,
      orientation: 'vertical',
    },
    color: '#ea580c',
    ratings: {
      voltage: 24,
      current: 10,
    },
  },

  // ========================================================================
  // TERMINALS
  // ========================================================================
  {
    id: 'wago-280-901',
    type: ComponentType.TERMINAL,
    manufacturer: 'WAGO',
    modelNumber: '280-901',
    displayName: 'Terminal Block 4mm²',
    description: 'Feed-through terminal block, 4mm², gray',
    logicalPins: [
      {
        id: 'wago-280-901_IN',
        label: 'IN',
        type: PinType.INPUT,
        componentId: 'wago-280-901',
        relativePosition: { x: 0, y: 0.5 },
      },
      {
        id: 'wago-280-901_OUT',
        label: 'OUT',
        type: PinType.OUTPUT,
        componentId: 'wago-280-901',
        relativePosition: { x: 1, y: 0.5 },
      },
    ],
    dimensions: {
      width: 6,
      height: 60,
      depth: 45,
      dinRailModules: 0.34,
      weight: 15,
    },
    mounting: {
      isDinRailMountable: true,
      orientation: 'vertical',
    },
    color: '#6b7280',
    ratings: {
      voltage: 400,
      current: 24,
    },
  },
];
