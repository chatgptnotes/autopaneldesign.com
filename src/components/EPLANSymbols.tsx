/**
 * EPLAN-Style Professional Electrical Symbols Library
 * Based on IEC 60617 International Standard for Graphical Symbols
 *
 * Key Features:
 * - IEC 60617 compliant symbols
 * - Professional grid alignment (10mm grid standard)
 * - Proper line weights (0.35mm, 0.5mm, 0.7mm)
 * - Cross-references and terminal designations
 * - Wire numbering standards
 */

import React from 'react';

// ============================================================================
// EPLAN CONSTANTS (based on professional CAD standards)
// ============================================================================

export const EPLAN_CONSTANTS = {
  // Grid system (10mm = 1 grid unit)
  GRID_SIZE: 10,

  // Line weights (in pixels for SVG)
  LINE_THIN: 0.5,      // 0.35mm - for construction lines
  LINE_NORMAL: 1.5,    // 0.5mm - for symbols
  LINE_THICK: 2.5,     // 0.7mm - for power lines

  // Standard spacing
  SYMBOL_HEIGHT: 60,   // 6 grid units
  SYMBOL_WIDTH: 40,    // 4 grid units
  WIRE_SPACING: 30,    // 3 grid units between wires

  // Text sizes
  TEXT_LARGE: 14,      // Component designations
  TEXT_NORMAL: 12,     // Labels
  TEXT_SMALL: 10,      // Terminal numbers
  TEXT_TINY: 8,        // Notes

  // Colors (EPLAN standard)
  COLOR_BLACK: '#000000',
  COLOR_BLUE: '#0000FF',     // Signal/Control
  COLOR_RED: '#FF0000',      // L1 Phase
  COLOR_YELLOW: '#FFD700',   // L2 Phase
  COLOR_BROWN: '#8B4513',    // L3 Phase
  COLOR_LIGHTBLUE: '#87CEEB', // Neutral
  COLOR_GREEN: '#00FF00',     // Protective Earth
  COLOR_GRAY: '#808080',      // Inactive
};

// ============================================================================
// IEC 60617 STANDARD SYMBOLS
// ============================================================================

interface SymbolProps {
  x: number;
  y: number;
  designation: string;  // Component reference (e.g., K1, F1, Q1)
  terminals?: string[]; // Terminal designations
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Circuit Breaker (IEC 60617-2-5-02)
 */
export const CircuitBreaker: React.FC<SymbolProps> = ({
  x,
  y,
  designation,
  terminals = ['1', '2'],
  orientation = 'vertical'
}) => {
  const { GRID_SIZE, LINE_NORMAL, TEXT_NORMAL, TEXT_SMALL } = EPLAN_CONSTANTS;

  if (orientation === 'vertical') {
    return (
      <g transform={`translate(${x},${y})`} className="eplan-symbol circuit-breaker">
        {/* Connection lines */}
        <line x1="0" y1={-3 * GRID_SIZE} x2="0" y2={-2 * GRID_SIZE}
              stroke="black" strokeWidth={LINE_NORMAL} />
        <line x1="0" y1={2 * GRID_SIZE} x2="0" y2={3 * GRID_SIZE}
              stroke="black" strokeWidth={LINE_NORMAL} />

        {/* Symbol body - square with diagonal */}
        <rect x={-GRID_SIZE} y={-2 * GRID_SIZE}
              width={2 * GRID_SIZE} height={4 * GRID_SIZE}
              fill="none" stroke="black" strokeWidth={LINE_NORMAL} />
        <line x1={-GRID_SIZE} y1={-2 * GRID_SIZE}
              x2={GRID_SIZE} y2={2 * GRID_SIZE}
              stroke="black" strokeWidth={LINE_NORMAL} />

        {/* Terminal designations */}
        <text x={-GRID_SIZE * 1.8} y={-2.5 * GRID_SIZE}
              fontSize={TEXT_SMALL} fill="black" textAnchor="end">
          {terminals[0]}
        </text>
        <text x={-GRID_SIZE * 1.8} y={2.5 * GRID_SIZE}
              fontSize={TEXT_SMALL} fill="black" textAnchor="end">
          {terminals[1]}
        </text>

        {/* Component designation */}
        <text x={GRID_SIZE * 2} y="0"
              fontSize={TEXT_NORMAL} fontWeight="bold" fill="black"
              dominantBaseline="middle">
          {designation}
        </text>
      </g>
    );
  }

  return null;
};

/**
 * Contactor Main Contacts (IEC 60617-7-5-01)
 * Three-pole contactor for motor control
 */
export const ContactorMainContacts: React.FC<SymbolProps & { poles?: number }> = ({
  x,
  y,
  designation,
  terminals = ['1L1', '2T1', '3L2', '4T2', '5L3', '6T3'],
  poles = 3
}) => {
  const { GRID_SIZE, LINE_THICK, TEXT_NORMAL, TEXT_SMALL, WIRE_SPACING } = EPLAN_CONSTANTS;

  return (
    <g transform={`translate(${x},${y})`} className="eplan-symbol contactor-main">
      {/* Three poles side by side */}
      {Array.from({ length: poles }).map((_, i) => {
        const poleX = (i - 1) * WIRE_SPACING;
        return (
          <g key={i} transform={`translate(${poleX},0)`}>
            {/* Input connection */}
            <line x1="0" y1={-3 * GRID_SIZE} x2="0" y2={-1.5 * GRID_SIZE}
                  stroke="black" strokeWidth={LINE_THICK} />

            {/* Fixed contact */}
            <circle cx="0" cy={-GRID_SIZE} r={GRID_SIZE * 0.4}
                    fill="none" stroke="black" strokeWidth={LINE_THICK} />

            {/* Moving contact (normally open) */}
            <circle cx="0" cy={GRID_SIZE} r={GRID_SIZE * 0.4}
                    fill="none" stroke="black" strokeWidth={LINE_THICK} />
            <line x1="0" y1={-GRID_SIZE * 0.6} x2={GRID_SIZE * 0.8} y2={-GRID_SIZE * 1.8}
                  stroke="black" strokeWidth={LINE_THICK} />

            {/* Output connection */}
            <line x1="0" y1={1.5 * GRID_SIZE} x2="0" y2={3 * GRID_SIZE}
                  stroke="black" strokeWidth={LINE_THICK} />

            {/* Terminal designations */}
            <text x={-GRID_SIZE * 1.2} y={-3.2 * GRID_SIZE}
                  fontSize={TEXT_SMALL} fill="black" textAnchor="end">
              {terminals[i * 2]}
            </text>
            <text x={-GRID_SIZE * 1.2} y={3.2 * GRID_SIZE}
                  fontSize={TEXT_SMALL} fill="black" textAnchor="end">
              {terminals[i * 2 + 1]}
            </text>
          </g>
        );
      })}

      {/* Mechanical coupling (dashed line) */}
      <line x1={-WIRE_SPACING - GRID_SIZE} y1="0"
            x2={WIRE_SPACING + GRID_SIZE} y2="0"
            stroke="black" strokeWidth={LINE_THICK * 0.5}
            strokeDasharray="5,5" />

      {/* Component designation */}
      <text x={WIRE_SPACING + GRID_SIZE * 2} y="0"
            fontSize={TEXT_NORMAL} fontWeight="bold" fill="black"
            dominantBaseline="middle">
        {designation}
      </text>
    </g>
  );
};

/**
 * Magnetizing Coil (IEC 60617-7-5-02)
 */
export const MagnetizingCoil: React.FC<SymbolProps> = ({
  x,
  y,
  designation,
  terminals = ['A1', 'A2']
}) => {
  const { GRID_SIZE, LINE_NORMAL, TEXT_NORMAL, TEXT_SMALL } = EPLAN_CONSTANTS;

  return (
    <g transform={`translate(${x},${y})`} className="eplan-symbol coil">
      {/* Connection lines */}
      <line x1="0" y1={-3 * GRID_SIZE} x2="0" y2={-1.5 * GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1={1.5 * GRID_SIZE} x2="0" y2={3 * GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Coil rectangle */}
      <rect x={-1.5 * GRID_SIZE} y={-1.5 * GRID_SIZE}
            width={3 * GRID_SIZE} height={3 * GRID_SIZE}
            fill="none" stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Diagonal line inside (indicates electromagnet) */}
      <line x1={-GRID_SIZE} y1={-GRID_SIZE} x2={GRID_SIZE} y2={GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Terminal designations */}
      <text x={-GRID_SIZE * 2.2} y={-2.5 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[0]}
      </text>
      <text x={-GRID_SIZE * 2.2} y={2.5 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[1]}
      </text>

      {/* Component designation */}
      <text x={GRID_SIZE * 2.2} y="0"
            fontSize={TEXT_NORMAL} fontWeight="bold" fill="black"
            dominantBaseline="middle">
        {designation}
      </text>
    </g>
  );
};

/**
 * Auxiliary Contact - Normally Open (IEC 60617-7-5-01)
 */
export const AuxiliaryContactNO: React.FC<SymbolProps> = ({
  x,
  y,
  designation,
  terminals = ['13', '14']
}) => {
  const { GRID_SIZE, LINE_NORMAL, TEXT_SMALL } = EPLAN_CONSTANTS;

  return (
    <g transform={`translate(${x},${y})`} className="eplan-symbol aux-contact-no">
      {/* Connection lines */}
      <line x1="0" y1={-2 * GRID_SIZE} x2="0" y2={-GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1={GRID_SIZE} x2="0" y2={2 * GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Fixed contact */}
      <circle cx="0" cy={-GRID_SIZE * 0.6} r={GRID_SIZE * 0.3}
              fill="black" />

      {/* Moving contact (normally open - angled line) */}
      <circle cx="0" cy={GRID_SIZE * 0.6} r={GRID_SIZE * 0.3}
              fill="black" />
      <line x1="0" y1={-GRID_SIZE * 0.3} x2={GRID_SIZE * 0.7} y2={-GRID_SIZE * 0.9}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Terminal designations */}
      <text x={-GRID_SIZE * 1.5} y={-2.2 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[0]}
      </text>
      <text x={-GRID_SIZE * 1.5} y={2.2 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[1]}
      </text>

      {/* Cross-reference to coil */}
      <text x={GRID_SIZE * 1.5} y="0"
            fontSize={TEXT_SMALL} fill="black">
        {designation}
      </text>
    </g>
  );
};

/**
 * Auxiliary Contact - Normally Closed (IEC 60617-7-5-01)
 */
export const AuxiliaryContactNC: React.FC<SymbolProps> = ({
  x,
  y,
  designation,
  terminals = ['21', '22']
}) => {
  const { GRID_SIZE, LINE_NORMAL, TEXT_SMALL } = EPLAN_CONSTANTS;

  return (
    <g transform={`translate(${x},${y})`} className="eplan-symbol aux-contact-nc">
      {/* Connection lines */}
      <line x1="0" y1={-2 * GRID_SIZE} x2="0" y2={-GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1={GRID_SIZE} x2="0" y2={2 * GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Fixed contact */}
      <circle cx="0" cy={-GRID_SIZE * 0.6} r={GRID_SIZE * 0.3}
              fill="black" />

      {/* Moving contact (normally closed - straight line with diagonal break) */}
      <circle cx="0" cy={GRID_SIZE * 0.6} r={GRID_SIZE * 0.3}
              fill="black" />
      <line x1="0" y1={-GRID_SIZE * 0.3} x2="0" y2={GRID_SIZE * 0.3}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1={-GRID_SIZE * 0.1} x2={GRID_SIZE * 0.7} y2={-GRID_SIZE * 0.7}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Terminal designations */}
      <text x={-GRID_SIZE * 1.5} y={-2.2 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[0]}
      </text>
      <text x={-GRID_SIZE * 1.5} y={2.2 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[1]}
      </text>

      {/* Cross-reference to coil */}
      <text x={GRID_SIZE * 1.5} y="0"
            fontSize={TEXT_SMALL} fill="black">
        {designation}
      </text>
    </g>
  );
};

/**
 * Overload Relay (IEC 60617-7-2-01)
 */
export const OverloadRelay: React.FC<SymbolProps & { poles?: number }> = ({
  x,
  y,
  designation,
  terminals = ['1', '2', '3', '4', '5', '6'],
  poles = 3
}) => {
  const { GRID_SIZE, LINE_THICK, LINE_NORMAL, TEXT_NORMAL, TEXT_SMALL, WIRE_SPACING } = EPLAN_CONSTANTS;

  return (
    <g transform={`translate(${x},${y})`} className="eplan-symbol overload-relay">
      {/* Three thermal elements side by side */}
      {Array.from({ length: poles }).map((_, i) => {
        const poleX = (i - 1) * WIRE_SPACING;
        return (
          <g key={i} transform={`translate(${poleX},0)`}>
            {/* Input connection */}
            <line x1="0" y1={-3 * GRID_SIZE} x2="0" y2={-2 * GRID_SIZE}
                  stroke="black" strokeWidth={LINE_THICK} />

            {/* Thermal element (heating symbol) */}
            <rect x={-GRID_SIZE * 0.6} y={-2 * GRID_SIZE}
                  width={GRID_SIZE * 1.2} height={4 * GRID_SIZE}
                  fill="none" stroke="black" strokeWidth={LINE_THICK} />
            {/* Heating element zigzag */}
            <path d={`M 0,${-1.5 * GRID_SIZE} l ${GRID_SIZE * 0.3},${GRID_SIZE * 0.5} l ${-GRID_SIZE * 0.6},${GRID_SIZE * 0.5} l ${GRID_SIZE * 0.6},${GRID_SIZE * 0.5} l ${-GRID_SIZE * 0.6},${GRID_SIZE * 0.5} l ${GRID_SIZE * 0.6},${GRID_SIZE * 0.5} l ${-GRID_SIZE * 0.3},${GRID_SIZE * 0.5}`}
                  fill="none" stroke="black" strokeWidth={LINE_NORMAL} />

            {/* Output connection */}
            <line x1="0" y1={2 * GRID_SIZE} x2="0" y2={3 * GRID_SIZE}
                  stroke="black" strokeWidth={LINE_THICK} />

            {/* Terminal designations */}
            <text x={-GRID_SIZE * 1.2} y={-3.2 * GRID_SIZE}
                  fontSize={TEXT_SMALL} fill="black" textAnchor="end">
              {terminals[i]}
            </text>
            <text x={-GRID_SIZE * 1.2} y={3.2 * GRID_SIZE}
                  fontSize={TEXT_SMALL} fill="black" textAnchor="end">
              {terminals[i + 3]}
            </text>
          </g>
        );
      })}

      {/* Mechanical coupling */}
      <line x1={-WIRE_SPACING - GRID_SIZE} y1="0"
            x2={WIRE_SPACING + GRID_SIZE} y2="0"
            stroke="black" strokeWidth={LINE_THICK * 0.5}
            strokeDasharray="5,5" />

      {/* Component designation */}
      <text x={WIRE_SPACING + GRID_SIZE * 2} y="0"
            fontSize={TEXT_NORMAL} fontWeight="bold" fill="black"
            dominantBaseline="middle">
        {designation}
      </text>
    </g>
  );
};

/**
 * Three-Phase Motor (IEC 60617-7-1-01)
 */
export const ThreePhaseMotor: React.FC<SymbolProps> = ({
  x,
  y,
  designation,
  terminals = ['U', 'V', 'W']
}) => {
  const { GRID_SIZE, LINE_THICK, TEXT_NORMAL, TEXT_SMALL } = EPLAN_CONSTANTS;

  return (
    <g transform={`translate(${x},${y})`} className="eplan-symbol motor">
      {/* Motor circle */}
      <circle cx="0" cy="0" r={4 * GRID_SIZE}
              fill="none" stroke="black" strokeWidth={LINE_THICK} />

      {/* "M" symbol inside */}
      <text x="0" y={GRID_SIZE * 0.5}
            fontSize={TEXT_NORMAL * 2} fontWeight="bold" fill="black"
            textAnchor="middle" dominantBaseline="middle">
        M
      </text>

      {/* "3~" symbol (three-phase indicator) */}
      <text x="0" y={-GRID_SIZE * 1.5}
            fontSize={TEXT_NORMAL} fill="black"
            textAnchor="middle">
        3~
      </text>

      {/* Three connection points at top */}
      {terminals.map((terminal, i) => {
        const angle = (-Math.PI / 2) + ((i - 1) * Math.PI / 6);
        const connectionX = Math.cos(angle) * 4 * GRID_SIZE;
        const connectionY = Math.sin(angle) * 4 * GRID_SIZE;
        const wireEndY = -6 * GRID_SIZE;

        return (
          <g key={i}>
            {/* Connection line */}
            <line x1={connectionX} y1={connectionY}
                  x2={connectionX} y2={wireEndY}
                  stroke="black" strokeWidth={LINE_THICK} />

            {/* Terminal designation */}
            <text x={connectionX} y={wireEndY - GRID_SIZE * 0.5}
                  fontSize={TEXT_SMALL} fill="black"
                  textAnchor="middle">
              {terminal}
            </text>
          </g>
        );
      })}

      {/* Component designation below motor */}
      <text x="0" y={6 * GRID_SIZE}
            fontSize={TEXT_NORMAL} fontWeight="bold" fill="black"
            textAnchor="middle">
        {designation}
      </text>
    </g>
  );
};

/**
 * Push Button - Normally Open (IEC 60617-7-6-01)
 */
export const PushButtonNO: React.FC<SymbolProps> = ({
  x,
  y,
  designation,
  terminals = ['1', '2']
}) => {
  const { GRID_SIZE, LINE_NORMAL, TEXT_SMALL } = EPLAN_CONSTANTS;

  return (
    <g transform={`translate(${x},${y})`} className="eplan-symbol pushbutton-no">
      {/* Connection lines */}
      <line x1="0" y1={-2 * GRID_SIZE} x2="0" y2={-GRID_SIZE * 0.6}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1={GRID_SIZE * 0.6} x2="0" y2={2 * GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Contacts */}
      <circle cx="0" cy={-GRID_SIZE * 0.6} r={GRID_SIZE * 0.3}
              fill="black" />
      <circle cx="0" cy={GRID_SIZE * 0.6} r={GRID_SIZE * 0.3}
              fill="black" />

      {/* Moving contact (angled line) */}
      <line x1="0" y1={-GRID_SIZE * 0.3} x2={GRID_SIZE * 0.8} y2={-GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Push arrow */}
      <line x1={GRID_SIZE * 0.8} y1={-GRID_SIZE} x2={GRID_SIZE * 0.8} y2={-GRID_SIZE * 1.8}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <polygon points={`${GRID_SIZE * 0.8},-${GRID_SIZE * 1.8} ${GRID_SIZE * 0.5},-${GRID_SIZE * 1.5} ${GRID_SIZE * 1.1},-${GRID_SIZE * 1.5}`}
               fill="black" />

      {/* Terminal designations */}
      <text x={-GRID_SIZE * 1.5} y={-2.2 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[0]}
      </text>
      <text x={-GRID_SIZE * 1.5} y={2.2 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[1]}
      </text>

      {/* Button label */}
      <text x={GRID_SIZE * 2} y="0"
            fontSize={TEXT_SMALL} fill="black">
        {designation}
      </text>
    </g>
  );
};

/**
 * Push Button - Normally Closed (IEC 60617-7-6-01)
 */
export const PushButtonNC: React.FC<SymbolProps> = ({
  x,
  y,
  designation,
  terminals = ['1', '2']
}) => {
  const { GRID_SIZE, LINE_NORMAL, TEXT_SMALL } = EPLAN_CONSTANTS;

  return (
    <g transform={`translate(${x},${y})`} className="eplan-symbol pushbutton-nc">
      {/* Connection lines */}
      <line x1="0" y1={-2 * GRID_SIZE} x2="0" y2={-GRID_SIZE * 0.6}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1={GRID_SIZE * 0.6} x2="0" y2={2 * GRID_SIZE}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Contacts */}
      <circle cx="0" cy={-GRID_SIZE * 0.6} r={GRID_SIZE * 0.3}
              fill="black" />
      <circle cx="0" cy={GRID_SIZE * 0.6} r={GRID_SIZE * 0.3}
              fill="black" />

      {/* Moving contact (straight line with break) */}
      <line x1="0" y1={-GRID_SIZE * 0.3} x2="0" y2={GRID_SIZE * 0.3}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1="0" x2={GRID_SIZE * 0.8} y2={-GRID_SIZE * 0.6}
            stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Push arrow */}
      <line x1={GRID_SIZE * 0.8} y1={-GRID_SIZE * 0.6} x2={GRID_SIZE * 0.8} y2={-GRID_SIZE * 1.4}
            stroke="black" strokeWidth={LINE_NORMAL} />
      <polygon points={`${GRID_SIZE * 0.8},-${GRID_SIZE * 1.4} ${GRID_SIZE * 0.5},-${GRID_SIZE * 1.1} ${GRID_SIZE * 1.1},-${GRID_SIZE * 1.1}`}
               fill="black" />

      {/* Terminal designations */}
      <text x={-GRID_SIZE * 1.5} y={-2.2 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[0]}
      </text>
      <text x={-GRID_SIZE * 1.5} y={2.2 * GRID_SIZE}
            fontSize={TEXT_SMALL} fill="black" textAnchor="end">
        {terminals[1]}
      </text>

      {/* Button label */}
      <text x={GRID_SIZE * 2} y="0"
            fontSize={TEXT_SMALL} fill="black">
        {designation}
      </text>
    </g>
  );
};

/**
 * Wire with numbering (EPLAN style)
 */
interface WireProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  wireNumber?: string;
  color?: string;
  thickness?: 'thin' | 'normal' | 'thick';
}

export const Wire: React.FC<WireProps> = ({
  x1,
  y1,
  x2,
  y2,
  wireNumber,
  color = EPLAN_CONSTANTS.COLOR_BLACK,
  thickness = 'normal'
}) => {
  const { LINE_THIN, LINE_NORMAL, LINE_THICK, TEXT_TINY } = EPLAN_CONSTANTS;

  const strokeWidth = thickness === 'thin' ? LINE_THIN :
                      thickness === 'thick' ? LINE_THICK : LINE_NORMAL;

  // Calculate midpoint for wire number
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g className="eplan-wire">
      <line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={strokeWidth} />

      {wireNumber && (
        <g>
          {/* White background for wire number */}
          <rect x={midX - 15} y={midY - 8}
                width="30" height="16"
                fill="white" />
          {/* Wire number */}
          <text x={midX} y={midY}
                fontSize={TEXT_TINY} fill="black"
                textAnchor="middle" dominantBaseline="middle">
            {wireNumber}
          </text>
        </g>
      )}
    </g>
  );
};

/**
 * Connection Point (junction dot)
 */
export const ConnectionPoint: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { GRID_SIZE } = EPLAN_CONSTANTS;

  return (
    <circle cx={x} cy={y} r={GRID_SIZE * 0.4}
            fill="black" className="eplan-connection-point" />
  );
};

export default {
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
};
