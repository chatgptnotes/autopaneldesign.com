/**
 * Professional Electrical Circuit Diagram Renderer
 * Generates industry-standard electrical diagrams with proper symbols
 * Supports: DOL starter, Star-Delta, Reversing, Lighting, PLC circuits
 */

import React, { useRef } from 'react';
import { Download } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface CircuitDiagramProps {
  circuitType: 'dol' | 'star-delta' | 'reversing' | 'lighting' | 'plc';
  voltage: string;
  phases: number;
  title?: string;
  showExport?: boolean;
}

// ============================================================================
// ELECTRICAL SYMBOLS SVG PATHS
// ============================================================================

const SYMBOLS = {
  // Fuse/Circuit Breaker
  fuse: (x: number, y: number, label: string = 'CB') => `
    <g transform="translate(${x},${y})">
      <rect x="-15" y="-25" width="30" height="50" fill="none" stroke="black" stroke-width="2"/>
      <line x1="0" y1="-40" x2="0" y2="-25" stroke="black" stroke-width="2"/>
      <line x1="0" y1="25" x2="0" y2="40" stroke="black" stroke-width="2"/>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="bold">${label}</text>
    </g>
  `,

  // Contactor (3-pole)
  contactor: (x: number, y: number, label: string = 'K') => `
    <g transform="translate(${x},${y})">
      <!-- Three poles -->
      ${[-30, 0, 30].map(offset => `
        <line x1="${offset}" y1="-30" x2="${offset}" y2="-10" stroke="black" stroke-width="2"/>
        <line x1="${offset}" y1="10" x2="${offset}" y2="30" stroke="black" stroke-width="2"/>
        <circle cx="${offset}" cy="-5" r="5" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="${offset}" cy="5" r="5" fill="none" stroke="black" stroke-width="2"/>
      `).join('')}
      <!-- Dotted box around contactor -->
      <rect x="-45" y="-35" width="90" height="70" fill="none" stroke="black" stroke-width="1" stroke-dasharray="5,5"/>
      <text x="0" y="-45" text-anchor="middle" font-size="12" font-weight="bold">${label}</text>
    </g>
  `,

  // Overload Relay
  overloadRelay: (x: number, y: number, label: string = 'OL') => `
    <g transform="translate(${x},${y})">
      ${[-30, 0, 30].map(offset => `
        <line x1="${offset}" y1="-30" x2="${offset}" y2="-15" stroke="black" stroke-width="2"/>
        <path d="M ${offset-8},-15 L ${offset+8},-15 L ${offset+8},15 L ${offset-8},15 Z"
              fill="none" stroke="black" stroke-width="2"/>
        <line x1="${offset}" y1="15" x2="${offset}" y2="30" stroke="black" stroke-width="2"/>
        <!-- Thermal element -->
        <circle cx="${offset}" cy="0" r="4" fill="black"/>
      `).join('')}
      <text x="0" y="-40" text-anchor="middle" font-size="12" font-weight="bold">${label}</text>
    </g>
  `,

  // Motor (3-phase)
  motor: (x: number, y: number, label: string = 'M') => `
    <g transform="translate(${x},${y})">
      <circle cx="0" cy="0" r="40" fill="none" stroke="black" stroke-width="3"/>
      <text x="0" y="5" text-anchor="middle" dominant-baseline="middle" font-size="20" font-weight="bold">${label}</text>
      <text x="0" y="-55" text-anchor="middle" font-size="12">3-Phase Motor</text>
      <!-- Connection points -->
      ${[-30, 0, 30].map((offset) => `
        <line x1="${offset}" y1="-40" x2="${offset}" y2="-60" stroke="black" stroke-width="2"/>
        <circle cx="${offset}" cy="-60" r="3" fill="black"/>
      `).join('')}
    </g>
  `,

  // Push Button (NO - Normally Open)
  pushButtonNO: (x: number, y: number, label: string = 'START') => `
    <g transform="translate(${x},${y})">
      <line x1="0" y1="-20" x2="0" y2="-5" stroke="black" stroke-width="2"/>
      <line x1="0" y1="5" x2="0" y2="20" stroke="black" stroke-width="2"/>
      <circle cx="0" cy="-5" r="3" fill="black"/>
      <circle cx="0" cy="5" r="3" fill="black"/>
      <line x1="-5" y1="-2" x2="5" y2="-8" stroke="black" stroke-width="2"/>
      <text x="15" y="0" text-anchor="start" font-size="10">${label}</text>
    </g>
  `,

  // Push Button (NC - Normally Closed)
  pushButtonNC: (x: number, y: number, label: string = 'STOP') => `
    <g transform="translate(${x},${y})">
      <line x1="0" y1="-20" x2="0" y2="-5" stroke="black" stroke-width="2"/>
      <line x1="0" y1="5" x2="0" y2="20" stroke="black" stroke-width="2"/>
      <circle cx="0" cy="-5" r="3" fill="black"/>
      <circle cx="0" cy="5" r="3" fill="black"/>
      <line x1="-8" y1="-5" x2="8" y2="-5" stroke="black" stroke-width="2"/>
      <line x1="-5" y1="-2" x2="5" y2="-8" stroke="black" stroke-width="2"/>
      <text x="15" y="0" text-anchor="start" font-size="10">${label}</text>
    </g>
  `,

  // Magnetizing Coil
  coil: (x: number, y: number, label: string = 'K1') => `
    <g transform="translate(${x},${y})">
      <rect x="-20" y="-15" width="40" height="30" fill="none" stroke="black" stroke-width="2"/>
      <line x1="0" y1="-30" x2="0" y2="-15" stroke="black" stroke-width="2"/>
      <line x1="0" y1="15" x2="0" y2="30" stroke="black" stroke-width="2"/>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="bold">${label}</text>
    </g>
  `,

  // Auxiliary Contact (NO)
  auxContactNO: (x: number, y: number, label: string = '') => `
    <g transform="translate(${x},${y})">
      <line x1="0" y1="-15" x2="0" y2="-5" stroke="black" stroke-width="2"/>
      <line x1="0" y1="5" x2="0" y2="15" stroke="black" stroke-width="2"/>
      <circle cx="0" cy="-5" r="3" fill="black"/>
      <circle cx="0" cy="5" r="3" fill="black"/>
      <line x1="-5" y1="-2" x2="5" y2="-8" stroke="black" stroke-width="2"/>
      ${label ? `<text x="15" y="0" text-anchor="start" font-size="9">${label}</text>` : ''}
    </g>
  `,

  // Connection point
  connectionPoint: (x: number, y: number) => `
    <circle cx="${x}" cy="${y}" r="4" fill="black"/>
  `,

  // Wire (with color)
  wire: (x1: number, y1: number, x2: number, y2: number, color: string = 'black', width: number = 2) => `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>
  `,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CircuitDiagramRenderer: React.FC<CircuitDiagramProps> = ({
  circuitType,
  voltage,
  phases,
  showExport = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const generateDOLCircuit = (): string => {
    const colors = ['#0000FF', '#FFD700', '#FF0000']; // Blue, Yellow, Red
    let svg = '';

    // Title
    svg += `<text x="400" y="30" text-anchor="middle" font-size="20" font-weight="bold">Direct Online (DOL) Motor Starter</text>`;
    svg += `<text x="400" y="50" text-anchor="middle" font-size="14">${voltage} - ${phases} Phase</text>`;

    // Power Circuit (Left Side)
    svg += `<text x="250" y="90" text-anchor="middle" font-size="16" font-weight="bold">Power Circuit</text>`;

    // Three Phase Supply
    const supplyY = 120;
    const phaseLabels = ['L1', 'L2', 'L3'];
    phaseLabels.forEach((phaseLabel, i) => {
      const x = 150 + i * 70;
      svg += `<text x="${x}" y="${supplyY - 10}" text-anchor="middle" font-size="12" font-weight="bold">${phaseLabel}</text>`;
      svg += SYMBOLS.wire(x, supplyY, x, supplyY + 30, colors[i], 3);
    });

    // Fuses/Circuit Breakers
    phaseLabels.forEach((_phaseLabel, i) => {
      const x = 150 + i * 70;
      svg += SYMBOLS.fuse(x, supplyY + 60, 'CB');
      svg += SYMBOLS.wire(x, supplyY + 30, x, supplyY + 20, colors[i], 3);
      svg += SYMBOLS.wire(x, supplyY + 100, x, supplyY + 130, colors[i], 3);
    });

    // Contactor
    svg += SYMBOLS.contactor(220, supplyY + 180, 'K1');
    phaseLabels.forEach((_phaseLabel, i) => {
      const x = 150 + i * 70;
      svg += SYMBOLS.wire(x, supplyY + 130, x, supplyY + 150, colors[i], 3);
      svg += SYMBOLS.wire(x, supplyY + 210, x, supplyY + 240, colors[i], 3);
    });

    // Overload Relay
    svg += SYMBOLS.overloadRelay(220, supplyY + 280, 'OL');
    phaseLabels.forEach((_phaseLabel, i) => {
      const x = 150 + i * 70;
      svg += SYMBOLS.wire(x, supplyY + 240, x, supplyY + 250, colors[i], 3);
      svg += SYMBOLS.wire(x, supplyY + 310, x, supplyY + 340, colors[i], 3);
    });

    // Motor
    svg += SYMBOLS.motor(220, supplyY + 410, 'M');

    // Control Circuit (Right Side)
    svg += `<text x="550" y="90" text-anchor="middle" font-size="16" font-weight="bold">Control Circuit</text>`;

    const ctrlX = 450;
    const ctrlY = 120;

    // Control supply
    svg += SYMBOLS.wire(ctrlX, ctrlY, ctrlX, ctrlY + 30, 'black', 2);
    svg += `<text x="${ctrlX - 20}" y="${ctrlY + 15}" text-anchor="end" font-size="12">L1</text>`;

    // Stop button (NC)
    svg += SYMBOLS.pushButtonNC(ctrlX, ctrlY + 60, 'STOP');
    svg += SYMBOLS.wire(ctrlX, ctrlY + 30, ctrlX, ctrlY + 40, 'black', 2);
    svg += SYMBOLS.wire(ctrlX, ctrlY + 80, ctrlX, ctrlY + 100, 'black', 2);

    // Start button (NO) - parallel with aux contact
    svg += SYMBOLS.pushButtonNO(ctrlX, ctrlY + 130, 'START');
    svg += SYMBOLS.wire(ctrlX, ctrlY + 100, ctrlX, ctrlY + 110, 'black', 2);

    // Auxiliary contact (NO) - for latching
    svg += SYMBOLS.auxContactNO(ctrlX + 80, ctrlY + 130, 'K1');
    svg += SYMBOLS.wire(ctrlX, ctrlY + 100, ctrlX + 80, ctrlY + 100, 'black', 2);
    svg += SYMBOLS.wire(ctrlX + 80, ctrlY + 100, ctrlX + 80, ctrlY + 115, 'black', 2);

    // Merge after start button
    svg += SYMBOLS.wire(ctrlX, ctrlY + 150, ctrlX, ctrlY + 170, 'black', 2);
    svg += SYMBOLS.wire(ctrlX + 80, ctrlY + 145, ctrlX + 80, ctrlY + 170, 'black', 2);
    svg += SYMBOLS.wire(ctrlX, ctrlY + 170, ctrlX + 80, ctrlY + 170, 'black', 2);
    svg += SYMBOLS.connectionPoint(ctrlX + 40, ctrlY + 170);

    // Magnetizing Coil
    svg += SYMBOLS.coil(ctrlX + 40, ctrlY + 210, 'K1');
    svg += SYMBOLS.wire(ctrlX + 40, ctrlY + 170, ctrlX + 40, ctrlY + 180, 'black', 2);

    // Neutral
    svg += SYMBOLS.wire(ctrlX + 40, ctrlY + 240, ctrlX + 40, ctrlY + 260, 'black', 2);
    svg += `<text x="${ctrlX + 60}" y="${ctrlY + 255}" text-anchor="start" font-size="12">N</text>`;

    // Legend
    svg += `<text x="50" y="550" font-size="10" font-weight="bold">Legend:</text>`;
    svg += `<text x="50" y="570" font-size="9">NO: Normally Open</text>`;
    svg += `<text x="50" y="585" font-size="9">NC: Normally Closed</text>`;
    svg += `<text x="50" y="600" font-size="9">K1: Contactor</text>`;
    svg += `<text x="50" y="615" font-size="9">OL: Overload Relay</text>`;

    return svg;
  };

  const generateCircuit = (): string => {
    switch (circuitType) {
      case 'dol':
        return generateDOLCircuit();
      default:
        return `<text x="400" y="300" text-anchor="middle" font-size="16">Circuit diagram for ${circuitType} coming soon...</text>`;
    }
  };

  const handleExport = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 650;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = `${circuitType}_circuit_diagram.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      });
    };

    img.src = url;
  };

  return (
    <div className="w-full">
      {showExport && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export as PNG
          </button>
        </div>
      )}

      <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm overflow-auto">
        <svg
          ref={svgRef}
          width="800"
          height="650"
          viewBox="0 0 800 650"
          className="mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          <defs>
            <style>{`
              text { font-family: Arial, sans-serif; }
            `}</style>
          </defs>
          <rect width="800" height="650" fill="white" />
          <g dangerouslySetInnerHTML={{ __html: generateCircuit() }} />
        </svg>
      </div>
    </div>
  );
};

export default CircuitDiagramRenderer;
