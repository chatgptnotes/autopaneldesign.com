/**
 * Dynamic EPLAN Circuit Renderer
 * Renders AI-generated circuits using professional EPLAN-style symbols
 * NO HARD-CODED CIRCUITS - All layouts are dynamically generated
 */

import React from 'react';
import { EPLANDrawingFrame, TitleBlockData } from './EPLANDrawingFrame';
import {
  CircuitBreaker,
  ContactorMainContacts,
  MagnetizingCoil,
  OverloadRelay,
  ThreePhaseMotor,
  PushButtonNO,
  PushButtonNC,
  Wire,
  ConnectionPoint,
  EPLAN_CONSTANTS,
} from './EPLANSymbols';
import { CircuitTemplate, ComponentSpec, ConnectionSpec } from '../ai/CircuitGenerator';
import { ComponentType, WireType } from '../types';

// ============================================================================
// DYNAMIC RENDERER PROPS
// ============================================================================

interface DynamicEPLANRendererProps {
  template: CircuitTemplate;
  config: {
    voltage: string;
    phases: number;
    frequency: string;
    motorPower?: string;
  };
  titleBlock?: Partial<TitleBlockData>;
}

// ============================================================================
// COMPONENT TYPE TO EPLAN SYMBOL MAPPING
// ============================================================================

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================================
// MAIN DYNAMIC RENDERER
// ============================================================================

export const DynamicEPLANRenderer: React.FC<DynamicEPLANRendererProps> = ({
  template,
  config,
  titleBlock = {},
}) => {
  const { GRID_SIZE } = EPLAN_CONSTANTS;

  const defaultTitleBlock: TitleBlockData = {
    projectName: 'AI Generated Circuit',
    projectNumber: 'AI-GEN-001',
    drawingTitle: template.description,
    drawingNumber: 'E-001',
    revision: 'A',
    date: new Date().toLocaleDateString('en-GB'),
    drawnBy: 'AutoPanel AI',
    company: 'AutoPanel Design',
    scale: '1:1',
    sheet: '1/1',
    ...titleBlock,
  };

  // Calculate component positions based on template positions
  const componentPositions = new Map<string, ComponentPosition>();

  template.components.forEach((comp) => {
    const pos = comp.position || { x: 0, y: 0 };
    componentPositions.set(comp.id, {
      x: pos.x,
      y: pos.y,
      width: 40,
      height: 60,
    });
  });

  return (
    <div className="dynamic-eplan-renderer w-full">
      <EPLANDrawingFrame format="A3" titleBlock={defaultTitleBlock} showGrid={true}>
        {/* Circuit Title */}
        <text x="10" y="10" fontSize="16" fontWeight="bold">
          {template.description}
        </text>
        <text x="10" y="20" fontSize="12">
          {config.voltage} / {config.phases} Phase / {config.frequency}
          {config.motorPower && ` / Motor: ${config.motorPower}`}
        </text>

        {/* Render Components Dynamically */}
        {template.components.map((comp) => renderComponent(comp, GRID_SIZE))}

        {/* Render Connections Dynamically */}
        {template.connections.map((conn, idx) =>
          renderConnection(conn, idx, template.components, componentPositions, GRID_SIZE)
        )}

        {/* Component List */}
        <g className="component-list" transform="translate(10, 200)">
          <text x="0" y="0" fontSize="12" fontWeight="bold">Component List:</text>
          {template.components.map((comp, idx) => (
            <text key={comp.id} x="0" y={15 + idx * 13} fontSize="10">
              {comp.label} - {comp.type}
            </text>
          ))}
        </g>
      </EPLANDrawingFrame>
    </div>
  );
};

// ============================================================================
// DYNAMIC COMPONENT RENDERING
// ============================================================================

function renderComponent(comp: ComponentSpec, _gridSize: number): JSX.Element {
  const pos = comp.position || { x: 100, y: 100 };
  const x = pos.x;
  const y = pos.y;

  // Map component type to EPLAN symbol
  switch (comp.type) {
    case ComponentType.MCB:
      return (
        <g key={comp.id}>
          <CircuitBreaker
            x={x}
            y={y}
            designation={comp.label}
            terminals={['1', '2']}
          />
        </g>
      );

    case ComponentType.CONTACTOR:
      return (
        <g key={comp.id}>
          <ContactorMainContacts
            x={x}
            y={y}
            designation={comp.label}
            terminals={['1L1', '2T1', '3L2', '4T2', '5L3', '6T3']}
            poles={3}
          />
        </g>
      );

    case ComponentType.RELAY:
      // Could be overload relay or magnetizing coil
      if (comp.label.includes('OL') || comp.label.includes('Overload')) {
        return (
          <g key={comp.id}>
            <OverloadRelay
              x={x}
              y={y}
              designation={comp.label}
              terminals={['1', '2', '3', '4', '5', '6']}
              poles={3}
            />
          </g>
        );
      } else {
        return (
          <g key={comp.id}>
            <MagnetizingCoil
              x={x}
              y={y}
              designation={comp.label}
              terminals={['A1', 'A2']}
            />
          </g>
        );
      }

    case ComponentType.SENSOR:
      // Could be push button NO or NC
      if (comp.label.toLowerCase().includes('stop')) {
        return (
          <g key={comp.id}>
            <PushButtonNC
              x={x}
              y={y}
              designation={comp.label}
              terminals={['1', '2']}
            />
          </g>
        );
      } else {
        return (
          <g key={comp.id}>
            <PushButtonNO
              x={x}
              y={y}
              designation={comp.label}
              terminals={['3', '4']}
            />
          </g>
        );
      }

    case ComponentType.MOTOR:
      return (
        <g key={comp.id}>
          <ThreePhaseMotor
            x={x}
            y={y}
            designation={comp.label}
            terminals={['U', 'V', 'W']}
          />
        </g>
      );

    default:
      // Generic component placeholder
      return (
        <g key={comp.id} transform={`translate(${x},${y})`}>
          <rect x="-20" y="-20" width="40" height="40" fill="none" stroke="black" strokeWidth="2" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="10">
            {comp.label}
          </text>
          <text x="0" y="30" textAnchor="middle" fontSize="8" fill="gray">
            {comp.type}
          </text>
        </g>
      );
  }
}

// ============================================================================
// DYNAMIC CONNECTION RENDERING
// ============================================================================

function renderConnection(
  conn: ConnectionSpec,
  index: number,
  components: ComponentSpec[],
  positions: Map<string, ComponentPosition>,
  _gridSize: number
): JSX.Element {
  const fromComp = components.find(c => c.id === conn.from.componentId);
  const toComp = components.find(c => c.id === conn.to.componentId);

  if (!fromComp || !toComp) {
    return <g key={`conn-${index}`} />;
  }

  const fromPos = positions.get(fromComp.id);
  const toPos = positions.get(toComp.id);

  if (!fromPos || !toPos) {
    return <g key={`conn-${index}`} />;
  }

  // Calculate connection points (simple: bottom of from -> top of to)
  const x1 = fromPos.x;
  const y1 = fromPos.y + fromPos.height / 2;
  const x2 = toPos.x;
  const y2 = toPos.y - toPos.height / 2;

  // Determine wire color based on type
  const wireColor = getWireColor(conn.wireType);
  const thickness = conn.wireType === WireType.POWER ? 'thick' : 'normal';

  // Generate wire number
  const wireNumber = `W${index + 1}`;

  return (
    <g key={`conn-${index}`}>
      {/* Vertical or L-shaped routing */}
      {x1 === x2 ? (
        // Straight vertical wire
        <Wire
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          wireNumber={conn.label || wireNumber}
          color={wireColor}
          thickness={thickness}
        />
      ) : (
        // L-shaped wire (down then across then down)
        <>
          {/* First vertical segment */}
          <Wire
            x1={x1}
            y1={y1}
            x2={x1}
            y2={(y1 + y2) / 2}
            color={wireColor}
            thickness={thickness}
          />
          {/* Horizontal segment */}
          <Wire
            x1={x1}
            y1={(y1 + y2) / 2}
            x2={x2}
            y2={(y1 + y2) / 2}
            wireNumber={conn.label || wireNumber}
            color={wireColor}
            thickness={thickness}
          />
          {/* Second vertical segment */}
          <Wire
            x1={x2}
            y1={(y1 + y2) / 2}
            x2={x2}
            y2={y2}
            color={wireColor}
            thickness={thickness}
          />
          {/* Junction points */}
          <ConnectionPoint x={x1} y={(y1 + y2) / 2} />
          <ConnectionPoint x={x2} y={(y1 + y2) / 2} />
        </>
      )}
    </g>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getWireColor(wireType: WireType): string {
  switch (wireType) {
    case WireType.POWER:
      return EPLAN_CONSTANTS.COLOR_RED;
    case WireType.SIGNAL:
      return EPLAN_CONSTANTS.COLOR_BLUE;
    case WireType.GROUND:
      return EPLAN_CONSTANTS.COLOR_GREEN;
    default:
      return EPLAN_CONSTANTS.COLOR_BLACK;
  }
}

export default DynamicEPLANRenderer;
