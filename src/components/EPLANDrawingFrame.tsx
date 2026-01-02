/**
 * EPLAN Professional Drawing Frame and Title Block
 * Standards: ISO 5457, ISO 7200
 *
 * Features:
 * - A3/A4 format support (landscape orientation)
 * - Standard title block with project information
 * - Grid reference system (columns: A-Z, rows: 1-20)
 * - Border and frame lines
 * - Revision table
 */

import React from 'react';
import { EPLAN_CONSTANTS } from './EPLANSymbols';

// ============================================================================
// DRAWING FORMATS (ISO 5457)
// ============================================================================

export type DrawingFormat = 'A4' | 'A3' | 'A2' | 'A1' | 'A0';

interface DrawingSize {
  width: number;   // in mm
  height: number;  // in mm
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
}

const DRAWING_SIZES: Record<DrawingFormat, DrawingSize> = {
  'A4': {
    width: 297,
    height: 210,
    marginLeft: 25,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  'A3': {
    width: 420,
    height: 297,
    marginLeft: 25,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  'A2': {
    width: 594,
    height: 420,
    marginLeft: 25,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  'A1': {
    width: 841,
    height: 594,
    marginLeft: 25,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  'A0': {
    width: 1189,
    height: 841,
    marginLeft: 25,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
};

// ============================================================================
// TITLE BLOCK DATA
// ============================================================================

export interface TitleBlockData {
  projectName: string;
  projectNumber: string;
  drawingTitle: string;
  drawingNumber: string;
  revision: string;
  date: string;
  drawnBy: string;
  checkedBy?: string;
  approvedBy?: string;
  company: string;
  scale?: string;
  sheet?: string;
}

interface DrawingFrameProps {
  format: DrawingFormat;
  titleBlock: TitleBlockData;
  showGrid?: boolean;
  children?: React.ReactNode;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EPLANDrawingFrame: React.FC<DrawingFrameProps> = ({
  format,
  titleBlock,
  showGrid = true,
  children,
}) => {
  const size = DRAWING_SIZES[format];
  const { LINE_NORMAL } = EPLAN_CONSTANTS;

  // Calculate drawing area
  const drawingWidth = size.width - size.marginLeft - size.marginRight;
  const drawingHeight = size.height - size.marginTop - size.marginBottom;

  // Title block dimensions (ISO 7200)
  const titleBlockHeight = 55;
  const titleBlockWidth = 180;

  return (
    <svg
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      className="eplan-drawing-frame"
      style={{ maxWidth: '100%', height: 'auto', backgroundColor: 'white' }}
    >
      <defs>
        <style>{`
          text { font-family: 'Arial', 'Helvetica', sans-serif; }
          .eplan-frame { fill: none; }
          .eplan-grid-line { stroke: #e0e0e0; stroke-width: 0.25; }
          .eplan-border { stroke: black; }
        `}</style>
      </defs>

      {/* Outer border (thick line) */}
      <rect
        x="0"
        y="0"
        width={size.width}
        height={size.height}
        className="eplan-frame eplan-border"
        strokeWidth={LINE_NORMAL * 2}
      />

      {/* Inner frame (defines drawing area) */}
      <rect
        x={size.marginLeft}
        y={size.marginTop}
        width={drawingWidth}
        height={drawingHeight}
        className="eplan-frame eplan-border"
        strokeWidth={LINE_NORMAL}
      />

      {/* Grid reference system */}
      {showGrid && renderGridReference(size, drawingWidth, drawingHeight)}

      {/* Title block */}
      {renderTitleBlock(
        size.width - titleBlockWidth - size.marginRight,
        size.height - titleBlockHeight - size.marginBottom,
        titleBlockWidth,
        titleBlockHeight,
        titleBlock
      )}

      {/* Drawing content area */}
      <g
        transform={`translate(${size.marginLeft}, ${size.marginTop})`}
        clipPath="url(#drawing-clip)"
      >
        <defs>
          <clipPath id="drawing-clip">
            <rect
              x="0"
              y="0"
              width={drawingWidth}
              height={drawingHeight - titleBlockHeight - 5}
            />
          </clipPath>
        </defs>

        {/* Grid pattern for alignment */}
        {showGrid && (
          <pattern
            id="grid-pattern"
            width={EPLAN_CONSTANTS.GRID_SIZE}
            height={EPLAN_CONSTANTS.GRID_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={EPLAN_CONSTANTS.GRID_SIZE / 2}
              cy={EPLAN_CONSTANTS.GRID_SIZE / 2}
              r="0.5"
              fill="#d0d0d0"
            />
          </pattern>
        )}
        {showGrid && (
          <rect
            x="0"
            y="0"
            width={drawingWidth}
            height={drawingHeight - titleBlockHeight - 5}
            fill="url(#grid-pattern)"
          />
        )}

        {/* User content goes here */}
        {children}
      </g>
    </svg>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Render grid reference system (columns A-Z, rows 1-20)
 */
function renderGridReference(
  size: DrawingSize,
  drawingWidth: number,
  drawingHeight: number
): JSX.Element {
  const { TEXT_SMALL } = EPLAN_CONSTANTS;
  const referenceMargin = 5;

  // Number of columns and rows
  const gridSpacing = 50; // mm
  const numColumns = Math.floor(drawingWidth / gridSpacing);
  const numRows = Math.floor(drawingHeight / gridSpacing);

  const columns: JSX.Element[] = [];
  const rows: JSX.Element[] = [];

  // Column letters (A, B, C, ...)
  for (let i = 0; i < numColumns; i++) {
    const x = size.marginLeft + i * gridSpacing;
    const letter = String.fromCharCode(65 + i); // A=65

    // Top label
    columns.push(
      <text
        key={`col-top-${i}`}
        x={x + gridSpacing / 2}
        y={referenceMargin + TEXT_SMALL}
        fontSize={TEXT_SMALL}
        textAnchor="middle"
      >
        {letter}
      </text>
    );

    // Bottom label
    columns.push(
      <text
        key={`col-bottom-${i}`}
        x={x + gridSpacing / 2}
        y={size.height - referenceMargin}
        fontSize={TEXT_SMALL}
        textAnchor="middle"
      >
        {letter}
      </text>
    );

    // Vertical grid line
    if (i > 0) {
      columns.push(
        <line
          key={`grid-v-${i}`}
          x1={x}
          y1={size.marginTop}
          x2={x}
          y2={size.height - size.marginBottom}
          className="eplan-grid-line"
        />
      );
    }
  }

  // Row numbers (1, 2, 3, ...)
  for (let i = 0; i < numRows; i++) {
    const y = size.marginTop + i * gridSpacing;
    const number = i + 1;

    // Left label
    rows.push(
      <text
        key={`row-left-${i}`}
        x={size.marginLeft - referenceMargin}
        y={y + gridSpacing / 2}
        fontSize={TEXT_SMALL}
        textAnchor="end"
        dominantBaseline="middle"
      >
        {number}
      </text>
    );

    // Right label
    rows.push(
      <text
        key={`row-right-${i}`}
        x={size.width - size.marginRight + referenceMargin}
        y={y + gridSpacing / 2}
        fontSize={TEXT_SMALL}
        textAnchor="start"
        dominantBaseline="middle"
      >
        {number}
      </text>
    );

    // Horizontal grid line
    if (i > 0) {
      rows.push(
        <line
          key={`grid-h-${i}`}
          x1={size.marginLeft}
          y1={y}
          x2={size.width - size.marginRight}
          y2={y}
          className="eplan-grid-line"
        />
      );
    }
  }

  return (
    <g className="eplan-grid-reference">
      {columns}
      {rows}
    </g>
  );
}

/**
 * Render professional title block (ISO 7200 standard)
 */
function renderTitleBlock(
  x: number,
  y: number,
  width: number,
  height: number,
  data: TitleBlockData
): JSX.Element {
  const { LINE_NORMAL, TEXT_SMALL, TEXT_NORMAL } = EPLAN_CONSTANTS;

  return (
    <g className="eplan-title-block" transform={`translate(${x}, ${y})`}>
      {/* Outer frame */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="none"
        stroke="black"
        strokeWidth={LINE_NORMAL}
      />

      {/* Company name (top section) */}
      <rect x="0" y="0" width={width} height="12" fill="#f5f5f5" stroke="black" strokeWidth={LINE_NORMAL} />
      <text x={width / 2} y="8" fontSize={TEXT_NORMAL} fontWeight="bold" textAnchor="middle">
        {data.company}
      </text>

      {/* Horizontal dividers */}
      <line x1="0" y1="12" x2={width} y2="12" stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1="27" x2={width} y2="27" stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1="0" y1="42" x2={width} y2="42" stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Vertical dividers */}
      <line x1={width * 0.5} y1="12" x2={width * 0.5} y2={height} stroke="black" strokeWidth={LINE_NORMAL} />
      <line x1={width * 0.75} y1="27" x2={width * 0.75} y2="42" stroke="black" strokeWidth={LINE_NORMAL} />

      {/* Project name */}
      <text x="3" y="20" fontSize={TEXT_SMALL} fill="gray">Project:</text>
      <text x="3" y="24" fontSize={TEXT_NORMAL} fontWeight="bold">{data.projectName}</text>

      {/* Project number */}
      <text x={width * 0.5 + 3} y="20" fontSize={TEXT_SMALL} fill="gray">Project No:</text>
      <text x={width * 0.5 + 3} y="24" fontSize={TEXT_NORMAL} fontWeight="bold">{data.projectNumber}</text>

      {/* Drawing title */}
      <text x="3" y="35" fontSize={TEXT_SMALL} fill="gray">Drawing Title:</text>
      <text x="3" y="39" fontSize={TEXT_NORMAL} fontWeight="bold">{data.drawingTitle}</text>

      {/* Drawing number */}
      <text x={width * 0.5 + 3} y="35" fontSize={TEXT_SMALL} fill="gray">Drawing No:</text>
      <text x={width * 0.5 + 3} y="39" fontSize={TEXT_NORMAL} fontWeight="bold">{data.drawingNumber}</text>

      {/* Bottom row */}
      <text x="3" y="48" fontSize={TEXT_SMALL} fill="gray">Drawn:</text>
      <text x="3" y="52" fontSize={TEXT_SMALL}>{data.drawnBy}</text>

      <text x={width * 0.25} y="48" fontSize={TEXT_SMALL} fill="gray">Date:</text>
      <text x={width * 0.25} y="52" fontSize={TEXT_SMALL}>{data.date}</text>

      <text x={width * 0.5 + 3} y="48" fontSize={TEXT_SMALL} fill="gray">Scale:</text>
      <text x={width * 0.5 + 3} y="52" fontSize={TEXT_SMALL}>{data.scale || 'N/A'}</text>

      <text x={width * 0.75 + 3} y="48" fontSize={TEXT_SMALL} fill="gray">Rev:</text>
      <text x={width * 0.75 + 3} y="52" fontSize={TEXT_NORMAL} fontWeight="bold">{data.revision}</text>
    </g>
  );
}

export default EPLANDrawingFrame;
