/**
 * EPLAN Professional Schematic Component
 * Demonstrates professional CAD-style electrical diagrams
 *
 * Features:
 * - IEC 60617 standard symbols
 * - Professional layout with proper spacing
 * - Wire numbering and terminal designations
 * - Cross-references
 * - Title block and drawing frame
 * - Grid-based alignment
 */

import React from 'react';
import { EPLANDrawingFrame, TitleBlockData } from './EPLANDrawingFrame';
import {
  CircuitBreaker,
  ContactorMainContacts,
  MagnetizingCoil,
  AuxiliaryContactNO,
  AuxiliaryContactNC,
  OverloadRelay,
  ThreePhaseMotor,
  PushButtonNO,
  PushButtonNC,
  Wire,
  ConnectionPoint,
  EPLAN_CONSTANTS,
} from './EPLANSymbols';

// ============================================================================
// CIRCUIT TYPES
// ============================================================================

export type CircuitType = 'dol' | 'star-delta' | 'reversing' | 'lighting' | 'plc';

interface CircuitConfig {
  voltage: string;
  phases: number;
  frequency: string;
  motorPower?: string;
}

interface EPLANSchematicProps {
  circuitType: CircuitType;
  config: CircuitConfig;
  titleBlock?: Partial<TitleBlockData>;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EPLANSchematic: React.FC<EPLANSchematicProps> = ({
  circuitType,
  config,
  titleBlock = {},
}) => {
  const defaultTitleBlock: TitleBlockData = {
    projectName: 'Industrial Motor Control',
    projectNumber: 'PRJ-2024-001',
    drawingTitle: getCircuitTitle(circuitType),
    drawingNumber: 'E-001',
    revision: 'A',
    date: new Date().toLocaleDateString('en-GB'),
    drawnBy: 'AutoPanel AI',
    company: 'AutoPanel Design',
    scale: '1:1',
    sheet: '1/1',
    ...titleBlock,
  };

  return (
    <div className="eplan-schematic-container w-full">
      <EPLANDrawingFrame format="A3" titleBlock={defaultTitleBlock} showGrid={true}>
        {renderCircuit(circuitType, config)}
      </EPLANDrawingFrame>
    </div>
  );
};

// ============================================================================
// CIRCUIT RENDERING FUNCTIONS
// ============================================================================

/**
 * Render circuit based on type
 */
function renderCircuit(type: CircuitType, config: CircuitConfig): JSX.Element {
  switch (type) {
    case 'dol':
      return renderDOLCircuit(config);
    case 'star-delta':
      return <text x="200" y="100">Star-Delta Circuit Coming Soon</text>;
    case 'reversing':
      return <text x="200" y="100">Reversing Circuit Coming Soon</text>;
    case 'lighting':
      return <text x="200" y="100">Lighting Circuit Coming Soon</text>;
    case 'plc':
      return <text x="200" y="100">PLC Circuit Coming Soon</text>;
    default:
      return <text x="200" y="100">Unknown Circuit Type</text>;
  }
}

/**
 * DOL (Direct On Line) Motor Starter Circuit
 * Professional EPLAN-style layout
 */
function renderDOLCircuit(config: CircuitConfig): JSX.Element {
  const { GRID_SIZE, WIRE_SPACING, COLOR_RED, COLOR_YELLOW, COLOR_BROWN, COLOR_BLUE } = EPLAN_CONSTANTS;

  // Layout constants (all in grid units)
  const POWER_CIRCUIT_X = 30;     // Start X for power circuit
  const CONTROL_CIRCUIT_X = 200;  // Start X for control circuit
  const START_Y = 20;             // Start Y position

  return (
    <g className="dol-circuit">
      {/* ================================================================ */}
      {/* CIRCUIT TITLE AND INFO */}
      {/* ================================================================ */}
      <text x="10" y="10" fontSize="16" fontWeight="bold">
        Direct On Line (DOL) Motor Starter
      </text>
      <text x="10" y="20" fontSize="12">
        {config.voltage} / {config.phases} Phase / {config.frequency}
        {config.motorPower && ` / Motor: ${config.motorPower}`}
      </text>

      {/* ================================================================ */}
      {/* POWER CIRCUIT (LEFT SIDE) */}
      {/* ================================================================ */}
      <g className="power-circuit">
        {/* Section label */}
        <text x={POWER_CIRCUIT_X + 30} y={START_Y} fontSize="14" fontWeight="bold">
          Power Circuit
        </text>

        {/* L1, L2, L3 Phase Supply Lines */}
        {[0, 1, 2].map((phase) => {
          const x = POWER_CIRCUIT_X + phase * WIRE_SPACING;
          const y = START_Y + GRID_SIZE;
          const phaseLabel = ['L1', 'L2', 'L3'][phase];
          const phaseColor = [COLOR_RED, COLOR_YELLOW, COLOR_BROWN][phase];

          return (
            <g key={`phase-${phase}`}>
              {/* Phase label */}
              <text x={x} y={y} fontSize="12" fontWeight="bold" textAnchor="middle">
                {phaseLabel}
              </text>

              {/* Supply wire from top */}
              <Wire
                x1={x}
                y1={y + GRID_SIZE}
                x2={x}
                y2={y + 4 * GRID_SIZE}
                wireNumber={`${phaseLabel}`}
                color={phaseColor}
                thickness="thick"
              />
            </g>
          );
        })}

        {/* Q1 - Main Circuit Breaker (3-pole) */}
        {[0, 1, 2].map((phase) => {
          const x = POWER_CIRCUIT_X + phase * WIRE_SPACING;
          const y = START_Y + 8 * GRID_SIZE;

          return (
            <g key={`cb-${phase}`}>
              <CircuitBreaker
                x={x}
                y={y}
                designation={phase === 1 ? 'Q1' : ''}
                terminals={[`${phase * 2 + 1}`, `${phase * 2 + 2}`]}
              />
            </g>
          );
        })}

        {/* Wires: CB to Contactor */}
        {[0, 1, 2].map((phase) => {
          const x = POWER_CIRCUIT_X + phase * WIRE_SPACING;
          const phaseColor = [COLOR_RED, COLOR_YELLOW, COLOR_BROWN][phase];

          return (
            <Wire
              key={`wire-cb-k1-${phase}`}
              x1={x}
              y1={START_Y + 11 * GRID_SIZE}
              x2={x}
              y2={START_Y + 14 * GRID_SIZE}
              wireNumber={`${100 + phase}`}
              color={phaseColor}
              thickness="thick"
            />
          );
        })}

        {/* K1 - Main Contactor (3-pole) */}
        <ContactorMainContacts
          x={POWER_CIRCUIT_X + WIRE_SPACING}
          y={START_Y + 18 * GRID_SIZE}
          designation="K1"
          terminals={['1L1', '2T1', '3L2', '4T2', '5L3', '6T3']}
          poles={3}
        />

        {/* Wires: Contactor to Overload */}
        {[0, 1, 2].map((phase) => {
          const x = POWER_CIRCUIT_X + phase * WIRE_SPACING;
          const phaseColor = [COLOR_RED, COLOR_YELLOW, COLOR_BROWN][phase];

          return (
            <Wire
              key={`wire-k1-f1-${phase}`}
              x1={x}
              y1={START_Y + 21 * GRID_SIZE}
              x2={x}
              y2={START_Y + 24 * GRID_SIZE}
              wireNumber={`${200 + phase}`}
              color={phaseColor}
              thickness="thick"
            />
          );
        })}

        {/* F1 - Overload Relay (3-pole) */}
        <OverloadRelay
          x={POWER_CIRCUIT_X + WIRE_SPACING}
          y={START_Y + 28 * GRID_SIZE}
          designation="F1"
          terminals={['1', '2', '3', '4', '5', '6']}
          poles={3}
        />

        {/* Wires: Overload to Motor */}
        {[0, 1, 2].map((phase) => {
          const x = POWER_CIRCUIT_X + phase * WIRE_SPACING;
          const phaseColor = [COLOR_RED, COLOR_YELLOW, COLOR_BROWN][phase];

          return (
            <Wire
              key={`wire-f1-m1-${phase}`}
              x1={x}
              y1={START_Y + 31 * GRID_SIZE}
              x2={x}
              y2={START_Y + 34 * GRID_SIZE}
              wireNumber={`${300 + phase}`}
              color={phaseColor}
              thickness="thick"
            />
          );
        })}

        {/* M1 - Three Phase Motor */}
        <ThreePhaseMotor
          x={POWER_CIRCUIT_X + WIRE_SPACING}
          y={START_Y + 44 * GRID_SIZE}
          designation="M1"
          terminals={['U', 'V', 'W']}
        />
      </g>

      {/* ================================================================ */}
      {/* CONTROL CIRCUIT (RIGHT SIDE) */}
      {/* ================================================================ */}
      <g className="control-circuit">
        {/* Section label */}
        <text x={CONTROL_CIRCUIT_X} y={START_Y} fontSize="14" fontWeight="bold">
          Control Circuit
        </text>

        {/* Control power supply - L1 */}
        <text x={CONTROL_CIRCUIT_X} y={START_Y + 2 * GRID_SIZE} fontSize="12" fontWeight="bold">
          L1
        </text>
        <Wire
          x1={CONTROL_CIRCUIT_X}
          y1={START_Y + 3 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X}
          y2={START_Y + 6 * GRID_SIZE}
          wireNumber="500"
          color={COLOR_BLUE}
        />

        {/* S0 - Emergency Stop (NC) */}
        <PushButtonNC
          x={CONTROL_CIRCUIT_X}
          y={START_Y + 9 * GRID_SIZE}
          designation="S0-STOP"
          terminals={['1', '2']}
        />

        <Wire
          x1={CONTROL_CIRCUIT_X}
          y1={START_Y + 6 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X}
          y2={START_Y + 7 * GRID_SIZE}
          color={COLOR_BLUE}
        />
        <Wire
          x1={CONTROL_CIRCUIT_X}
          y1={START_Y + 11 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X}
          y2={START_Y + 14 * GRID_SIZE}
          wireNumber="501"
          color={COLOR_BLUE}
        />

        {/* F1 - Overload NC contact */}
        <AuxiliaryContactNC
          x={CONTROL_CIRCUIT_X}
          y={START_Y + 16 * GRID_SIZE}
          designation="F1"
          terminals={['95', '96']}
        />

        <Wire
          x1={CONTROL_CIRCUIT_X}
          y1={START_Y + 18 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X}
          y2={START_Y + 21 * GRID_SIZE}
          wireNumber="502"
          color={COLOR_BLUE}
        />

        {/* Parallel branch for START button and holding contact */}
        {/* S1 - Start Button (NO) */}
        <PushButtonNO
          x={CONTROL_CIRCUIT_X}
          y={START_Y + 24 * GRID_SIZE}
          designation="S1-START"
          terminals={['3', '4']}
        />

        <Wire
          x1={CONTROL_CIRCUIT_X}
          y1={START_Y + 21 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X}
          y2={START_Y + 22 * GRID_SIZE}
          color={COLOR_BLUE}
        />

        {/* Parallel branch wire to holding contact */}
        <Wire
          x1={CONTROL_CIRCUIT_X}
          y1={START_Y + 21 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X + 3 * GRID_SIZE}
          y2={START_Y + 21 * GRID_SIZE}
          color={COLOR_BLUE}
        />
        <ConnectionPoint x={CONTROL_CIRCUIT_X} y={START_Y + 21 * GRID_SIZE} />

        {/* K1 - Holding Contact (NO) */}
        <AuxiliaryContactNO
          x={CONTROL_CIRCUIT_X + 3 * GRID_SIZE}
          y={START_Y + 24 * GRID_SIZE}
          designation="K1"
          terminals={['13', '14']}
        />

        <Wire
          x1={CONTROL_CIRCUIT_X + 3 * GRID_SIZE}
          y1={START_Y + 21 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X + 3 * GRID_SIZE}
          y2={START_Y + 22 * GRID_SIZE}
          color={COLOR_BLUE}
        />

        {/* Merge after parallel contacts */}
        <Wire
          x1={CONTROL_CIRCUIT_X}
          y1={START_Y + 26 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X}
          y2={START_Y + 28 * GRID_SIZE}
          color={COLOR_BLUE}
        />
        <Wire
          x1={CONTROL_CIRCUIT_X + 3 * GRID_SIZE}
          y1={START_Y + 26 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X + 3 * GRID_SIZE}
          y2={START_Y + 28 * GRID_SIZE}
          color={COLOR_BLUE}
        />
        <Wire
          x1={CONTROL_CIRCUIT_X}
          y1={START_Y + 28 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X + 3 * GRID_SIZE}
          y2={START_Y + 28 * GRID_SIZE}
          wireNumber="503"
          color={COLOR_BLUE}
        />
        <ConnectionPoint x={CONTROL_CIRCUIT_X + 1.5 * GRID_SIZE} y={START_Y + 28 * GRID_SIZE} />

        {/* K1 - Magnetizing Coil */}
        <MagnetizingCoil
          x={CONTROL_CIRCUIT_X + 1.5 * GRID_SIZE}
          y={START_Y + 32 * GRID_SIZE}
          designation="K1"
          terminals={['A1', 'A2']}
        />

        <Wire
          x1={CONTROL_CIRCUIT_X + 1.5 * GRID_SIZE}
          y1={START_Y + 28 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X + 1.5 * GRID_SIZE}
          y2={START_Y + 29 * GRID_SIZE}
          color={COLOR_BLUE}
        />

        {/* Neutral connection */}
        <Wire
          x1={CONTROL_CIRCUIT_X + 1.5 * GRID_SIZE}
          y1={START_Y + 35 * GRID_SIZE}
          x2={CONTROL_CIRCUIT_X + 1.5 * GRID_SIZE}
          y2={START_Y + 37 * GRID_SIZE}
          wireNumber="N"
          color={COLOR_BLUE}
        />
        <text x={CONTROL_CIRCUIT_X + 1.5 * GRID_SIZE} y={START_Y + 39 * GRID_SIZE}
              fontSize="12" fontWeight="bold" textAnchor="middle">
          N
        </text>
      </g>

      {/* ================================================================ */}
      {/* LEGEND AND NOTES */}
      {/* ================================================================ */}
      <g className="legend" transform="translate(10, 200)">
        <text x="0" y="0" fontSize="12" fontWeight="bold">Component List:</text>
        <text x="0" y="15" fontSize="10">Q1 - Main Circuit Breaker (3-pole)</text>
        <text x="0" y="28" fontSize="10">K1 - Main Contactor (3-pole)</text>
        <text x="0" y="41" fontSize="10">F1 - Motor Overload Relay</text>
        <text x="0" y="54" fontSize="10">M1 - Three Phase Induction Motor</text>
        <text x="0" y="67" fontSize="10">S0 - Emergency Stop Button (NC)</text>
        <text x="0" y="80" fontSize="10">S1 - Start Button (NO)</text>

        <text x="0" y="100" fontSize="12" fontWeight="bold">Notes:</text>
        <text x="0" y="113" fontSize="9">1. All wiring per IEC 60364 standards</text>
        <text x="0" y="124" fontSize="9">2. Wire numbers shown for reference</text>
        <text x="0" y="135" fontSize="9">3. Overload relay must be sized for motor current</text>
        <text x="0" y="146" fontSize="9">4. Emergency stop provides immediate disconnect</text>
      </g>
    </g>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCircuitTitle(type: CircuitType): string {
  const titles: Record<CircuitType, string> = {
    'dol': 'Direct On Line (DOL) Motor Starter',
    'star-delta': 'Star-Delta Motor Starter',
    'reversing': 'Reversing Motor Starter',
    'lighting': 'Lighting Control Circuit',
    'plc': 'PLC Control System',
  };
  return titles[type];
}

export default EPLANSchematic;
