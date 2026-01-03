/**
 * PDF Exporter: Generate professional electrical circuit diagrams
 * Creates industry-standard schematics with symbols, BOM, and specifications
 * Supports AI-generated circuit diagrams from Gemini
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CircuitTemplate } from '../ai/CircuitGenerator';

// ============================================================================
// DOL STARTER CIRCUIT TEMPLATE
// ============================================================================

export interface CircuitComponent {
  ref: string;
  type: string;
  description: string;
  manufacturer: string;
  partNumber: string;
  quantity: number;
  position: { x: number; y: number };
}

export interface Connection {
  from: string;
  to: string;
  wireLabel: string;
  wireType: string;
}

export interface CircuitDiagram {
  title: string;
  projectName: string;
  projectNumber: string;
  designer: string;
  date: string;
  revision: string;
  components: CircuitComponent[];
  connections: Connection[];
  powerRatings: {
    voltage: string;
    current: string;
    phases: number;
    frequency: string;
  };
  notes: string[];
}

// ============================================================================
// DOL STARTER TEMPLATE DATA
// ============================================================================

export const DOL_STARTER_CIRCUIT: CircuitDiagram = {
  title: 'DOL (Direct On-Line) Motor Starter Circuit',
  projectName: 'Sample Industrial Motor Control',
  projectNumber: 'PRJ-2025-001',
  designer: 'AutoPanel Design System',
  date: new Date().toLocaleDateString(),
  revision: 'Rev 1.0',
  powerRatings: {
    voltage: '400V AC',
    current: '25A',
    phases: 3,
    frequency: '50Hz',
  },
  components: [
    {
      ref: 'QF1',
      type: 'Main Circuit Breaker',
      description: '3-Pole MCB, 32A, C-Curve',
      manufacturer: 'Schneider Electric',
      partNumber: 'A9F74332',
      quantity: 1,
      position: { x: 50, y: 60 },
    },
    {
      ref: 'KM1',
      type: 'Contactor',
      description: '3-Pole Contactor, 25A, 230V AC Coil',
      manufacturer: 'ABB',
      partNumber: 'A9-30-10',
      quantity: 1,
      position: { x: 50, y: 100 },
    },
    {
      ref: 'F1',
      type: 'Overload Relay',
      description: 'Thermal Overload, 20-25A',
      manufacturer: 'Siemens',
      partNumber: '3RU2126-4AB0',
      quantity: 1,
      position: { x: 50, y: 140 },
    },
    {
      ref: 'M1',
      type: 'Motor',
      description: '3-Phase Induction Motor, 7.5kW',
      manufacturer: 'WEG',
      partNumber: 'W22-IE3-7.5kW',
      quantity: 1,
      position: { x: 50, y: 180 },
    },
    {
      ref: 'SB1',
      type: 'Start Button',
      description: 'Push Button NO (Green)',
      manufacturer: 'Schneider Electric',
      partNumber: 'XB4BA31',
      quantity: 1,
      position: { x: 150, y: 100 },
    },
    {
      ref: 'SB2',
      type: 'Stop Button',
      description: 'Push Button NC (Red)',
      manufacturer: 'Schneider Electric',
      partNumber: 'XB4BA42',
      quantity: 1,
      position: { x: 150, y: 80 },
    },
    {
      ref: 'HL1',
      type: 'Indicator Lamp',
      description: 'Green LED Indicator',
      manufacturer: 'IDEC',
      partNumber: 'YW1L-M2E10G',
      quantity: 1,
      position: { x: 150, y: 120 },
    },
    {
      ref: 'FU1',
      type: 'Control Fuse',
      description: '2A Glass Fuse',
      manufacturer: 'Littelfuse',
      partNumber: '0217002.MXP',
      quantity: 2,
      position: { x: 150, y: 60 },
    },
  ],
  connections: [
    { from: 'L1', to: 'QF1', wireLabel: 'L1', wireType: 'Power - Red' },
    { from: 'L2', to: 'QF1', wireLabel: 'L2', wireType: 'Power - Yellow' },
    { from: 'L3', to: 'QF1', wireLabel: 'L3', wireType: 'Power - Blue' },
    { from: 'QF1', to: 'KM1', wireLabel: '1-2-3', wireType: 'Power' },
    { from: 'KM1', to: 'F1', wireLabel: '4-5-6', wireType: 'Power' },
    { from: 'F1', to: 'M1', wireLabel: 'U-V-W', wireType: 'Power' },
    { from: 'SB2', to: 'SB1', wireLabel: 'Control 1', wireType: 'Control - 1mm²' },
    { from: 'SB1', to: 'KM1-A1', wireLabel: 'Control 2', wireType: 'Control - 1mm²' },
  ],
  notes: [
    'All wiring must comply with IEC 60204-1 standards',
    'Main power cables: 4mm² copper, 90°C rated',
    'Control wiring: 1mm² copper, flexible',
    'Install emergency stop in series with stop button',
    'Verify motor rotation direction before connection',
    'Ensure proper earthing of motor frame and panel',
    'Overload relay setting: 0.9 × Motor FLC',
    'Maximum cable length from panel to motor: 50m',
  ],
};

// ============================================================================
// PDF GENERATION
// ============================================================================

export class PDFExporter {
  /**
   * Generate comprehensive DOL starter circuit PDF
   */
  static generateDOLStarterPDF(circuit: CircuitDiagram = DOL_STARTER_CIRCUIT): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Page 1: Title and Circuit Diagram
    this.addTitleBlock(doc, circuit);

    // Start after title block (which ends at y=50)
    let yPos = 55;

    this.addProjectInfo(doc, circuit, yPos);
    // Get the actual ending Y position from the table
    yPos = (doc as any).lastAutoTable?.finalY || yPos + 50;
    yPos += 10; // Add padding

    this.addPowerRatings(doc, circuit, yPos);
    // Get the actual ending Y position from the table
    yPos = (doc as any).lastAutoTable?.finalY || yPos + 35;
    yPos += 10; // Add padding

    this.addCircuitDiagram(doc, circuit, yPos);

    // Page 2: Bill of Materials and Notes
    doc.addPage();
    yPos = 20;

    this.addBOM(doc, circuit, yPos);
    // Get the actual ending Y position from the BOM table
    yPos = (doc as any).lastAutoTable?.finalY || yPos + 120;
    yPos += 15; // Add padding

    this.addWiringTable(doc, circuit, yPos);

    // Page 3: Technical Notes and Specifications
    doc.addPage();
    yPos = 20;

    this.addTechnicalNotes(doc, circuit, yPos);
    this.addFooter(doc);

    return doc;
  }

  /**
   * Add professional title block
   */
  private static addTitleBlock(doc: jsPDF, circuit: CircuitDiagram) {
    // Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 40);

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(circuit.title, 105, 25, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Electrical Circuit Diagram', 105, 32, { align: 'center' });

    // Company logo placeholder
    doc.setFontSize(10);
    doc.text('AutoPanel Design', 15, 45);

    // Revision info
    doc.text(`Rev: ${circuit.revision}`, 170, 45);
  }

  /**
   * Add project information table
   */
  private static addProjectInfo(doc: jsPDF, circuit: CircuitDiagram, yPos: number) {
    const data = [
      ['Project Name:', circuit.projectName],
      ['Project Number:', circuit.projectNumber],
      ['Designer:', circuit.designer],
      ['Date:', circuit.date],
      ['Status:', 'APPROVED FOR CONSTRUCTION'],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Field', 'Value']],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 120 },
      },
    });
  }

  /**
   * Add power ratings table
   */
  private static addPowerRatings(doc: jsPDF, circuit: CircuitDiagram, yPos: number) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ELECTRICAL SPECIFICATIONS', 15, yPos);

    const data = [
      ['Voltage:', circuit.powerRatings.voltage],
      ['Current:', circuit.powerRatings.current],
      ['Phases:', circuit.powerRatings.phases.toString()],
      ['Frequency:', circuit.powerRatings.frequency],
    ];

    autoTable(doc, {
      startY: yPos + 5,
      body: data,
      theme: 'striped',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold', fillColor: [240, 240, 240] },
        1: { cellWidth: 120 },
      },
    });
  }

  /**
   * Add circuit diagram with professional IEC 60617 electrical symbols
   */
  private static addCircuitDiagram(doc: jsPDF, _circuit: CircuitDiagram, yPos: number) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CIRCUIT DIAGRAM', 15, yPos);

    const diagramY = yPos + 8;

    // ============================================
    // POWER CIRCUIT (Left side)
    // ============================================
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('POWER CIRCUIT', 25, diagramY);

    // Power supply lines L1, L2, L3 with proper colors
    const powerX = 30;
    const lineSpacing = 20;

    // Phase labels at top
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('L1', powerX - 2, diagramY + 8);
    doc.text('L2', powerX + lineSpacing - 2, diagramY + 8);
    doc.text('L3', powerX + lineSpacing * 2 - 2, diagramY + 8);

    // Vertical power lines from top
    doc.setLineWidth(0.4);
    doc.setDrawColor(0, 0, 0);
    doc.line(powerX, diagramY + 10, powerX, diagramY + 18); // L1
    doc.line(powerX + lineSpacing, diagramY + 10, powerX + lineSpacing, diagramY + 18); // L2
    doc.line(powerX + lineSpacing * 2, diagramY + 10, powerX + lineSpacing * 2, diagramY + 18); // L3

    // QF1 - MCB Symbol (Circuit Breaker with diagonal break)
    const mcbY = diagramY + 18;
    this.drawMCBSymbol(doc, powerX, mcbY, lineSpacing);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('QF1', powerX + lineSpacing * 2 + 5, mcbY + 6);
    doc.text('MCB 32A', powerX + lineSpacing * 2 + 5, mcbY + 10);

    // Lines between MCB and Contactor
    doc.setDrawColor(0, 0, 0);
    doc.line(powerX, mcbY + 12, powerX, mcbY + 20);
    doc.line(powerX + lineSpacing, mcbY + 12, powerX + lineSpacing, mcbY + 20);
    doc.line(powerX + lineSpacing * 2, mcbY + 12, powerX + lineSpacing * 2, mcbY + 20);

    // KM1 - Contactor Main Contacts Symbol
    const contactorY = mcbY + 20;
    this.drawContactorSymbol(doc, powerX, contactorY, lineSpacing);
    doc.setFontSize(7);
    doc.text('KM1', powerX + lineSpacing * 2 + 5, contactorY + 6);
    doc.text('Contactor', powerX + lineSpacing * 2 + 5, contactorY + 10);

    // Lines between Contactor and OLR
    doc.line(powerX, contactorY + 12, powerX, contactorY + 20);
    doc.line(powerX + lineSpacing, contactorY + 12, powerX + lineSpacing, contactorY + 20);
    doc.line(powerX + lineSpacing * 2, contactorY + 12, powerX + lineSpacing * 2, contactorY + 20);

    // F1 - Overload Relay Symbol
    const olrY = contactorY + 20;
    this.drawOLRSymbol(doc, powerX, olrY, lineSpacing);
    doc.setFontSize(7);
    doc.text('F1', powerX + lineSpacing * 2 + 5, olrY + 6);
    doc.text('OLR 20-25A', powerX + lineSpacing * 2 + 5, olrY + 10);

    // Lines from OLR to Motor
    doc.line(powerX, olrY + 12, powerX, olrY + 22);
    doc.line(powerX + lineSpacing, olrY + 12, powerX + lineSpacing, olrY + 22);
    doc.line(powerX + lineSpacing * 2, olrY + 12, powerX + lineSpacing * 2, olrY + 22);

    // Motor terminal labels
    doc.setFontSize(6);
    doc.text('U', powerX - 1, olrY + 25);
    doc.text('V', powerX + lineSpacing - 1, olrY + 25);
    doc.text('W', powerX + lineSpacing * 2 - 1, olrY + 25);

    // Converging lines to motor
    const motorCenterX = powerX + lineSpacing;
    const motorY = olrY + 35;
    doc.line(powerX, olrY + 26, motorCenterX, motorY - 8);
    doc.line(powerX + lineSpacing, olrY + 26, motorCenterX, motorY - 8);
    doc.line(powerX + lineSpacing * 2, olrY + 26, motorCenterX, motorY - 8);
    doc.line(motorCenterX, motorY - 8, motorCenterX, motorY - 5);

    // M1 - Motor Symbol (Circle with M)
    this.drawMotorSymbol(doc, motorCenterX, motorY);
    doc.setFontSize(7);
    doc.text('M1', motorCenterX + 12, motorY);
    doc.text('7.5kW', motorCenterX + 12, motorY + 4);

    // ============================================
    // CONTROL CIRCUIT (Right side)
    // ============================================
    const controlX = 115;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTROL CIRCUIT', controlX, diagramY);

    // Control power labels
    doc.setFontSize(8);
    doc.text('L', controlX, diagramY + 8);
    doc.text('N', controlX + 55, diagramY + 8);

    // Control circuit horizontal line at top
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    const ctrlY = diagramY + 12;
    doc.line(controlX, ctrlY, controlX, ctrlY + 8);

    // FU1 - Control Fuse Symbol
    this.drawFuseSymbol(doc, controlX, ctrlY + 8);
    doc.setFontSize(6);
    doc.text('FU1', controlX + 5, ctrlY + 12);

    doc.line(controlX, ctrlY + 18, controlX, ctrlY + 26);

    // SB2 - STOP Button (NC - Normally Closed)
    const stopY = ctrlY + 26;
    this.drawNCButtonSymbol(doc, controlX, stopY);
    doc.setFontSize(7);
    doc.text('SB2', controlX + 8, stopY + 3);
    doc.setFontSize(6);
    doc.text('STOP', controlX + 8, stopY + 7);

    doc.line(controlX, stopY + 8, controlX, stopY + 16);

    // SB1 - START Button (NO - Normally Open)
    const startY = stopY + 16;
    this.drawNOButtonSymbol(doc, controlX, startY);
    doc.setFontSize(7);
    doc.text('SB1', controlX + 8, startY + 3);
    doc.setFontSize(6);
    doc.text('START', controlX + 8, startY + 7);

    // Holding contact (parallel to START)
    doc.line(controlX, startY, controlX - 8, startY);
    doc.line(controlX - 8, startY, controlX - 8, startY + 12);
    this.drawNOContactSymbol(doc, controlX - 8, startY + 12);
    doc.setFontSize(6);
    doc.text('KM1', controlX - 15, startY + 16);
    doc.line(controlX - 8, startY + 18, controlX - 8, startY + 24);
    doc.line(controlX - 8, startY + 24, controlX, startY + 24);

    doc.line(controlX, startY + 8, controlX, startY + 24);

    // F1 OLR NC contact in series
    const olrContactY = startY + 24;
    doc.line(controlX, olrContactY, controlX, olrContactY + 8);
    this.drawNCContactSymbol(doc, controlX, olrContactY + 8);
    doc.setFontSize(6);
    doc.text('F1', controlX + 8, olrContactY + 12);
    doc.text('95-96', controlX + 8, olrContactY + 16);

    // KM1 Contactor Coil
    const coilY = olrContactY + 20;
    doc.line(controlX, olrContactY + 14, controlX, coilY);
    this.drawCoilSymbol(doc, controlX, coilY);
    doc.setFontSize(7);
    doc.text('KM1', controlX + 10, coilY + 5);
    doc.setFontSize(6);
    doc.text('A1', controlX - 8, coilY + 2);
    doc.text('A2', controlX - 8, coilY + 10);

    // Neutral line
    doc.line(controlX, coilY + 12, controlX, coilY + 18);
    doc.line(controlX, coilY + 18, controlX + 55, coilY + 18);
    doc.line(controlX + 55, ctrlY, controlX + 55, coilY + 18);

    // ============================================
    // STATUS INDICATORS (Bottom right)
    // ============================================
    const indicatorX = 160;
    const indicatorY = diagramY + 60;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('STATUS INDICATORS', indicatorX, indicatorY);

    // RUN indicator (Green)
    doc.setFillColor(34, 197, 94); // Green
    doc.circle(indicatorX + 8, indicatorY + 12, 5, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.circle(indicatorX + 8, indicatorY + 12, 5, 'S');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('HL1', indicatorX + 16, indicatorY + 10);
    doc.text('RUN', indicatorX + 16, indicatorY + 14);

    // TRIP indicator (Red)
    doc.setFillColor(239, 68, 68); // Red
    doc.circle(indicatorX + 8, indicatorY + 26, 5, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.circle(indicatorX + 8, indicatorY + 26, 5, 'S');
    doc.setFontSize(7);
    doc.text('HL2', indicatorX + 16, indicatorY + 24);
    doc.text('TRIP', indicatorX + 16, indicatorY + 28);

    // ============================================
    // DIAGRAM LEGEND
    // ============================================
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('IEC 60617 Standard Symbols | Power Circuit (Left) | Control Circuit (Right)', 105, yPos + 105, { align: 'center' });
  }

  // ============================================
  // IEC SYMBOL DRAWING HELPERS
  // ============================================

  /**
   * Draw MCB (Circuit Breaker) symbol - Rectangle with diagonal break line
   */
  private static drawMCBSymbol(doc: jsPDF, x: number, y: number, spacing: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    for (let i = 0; i < 3; i++) {
      const posX = x + i * spacing;
      // Input line
      doc.line(posX, y, posX, y + 2);
      // Break symbol (diagonal line with gap)
      doc.line(posX, y + 2, posX + 3, y + 5);
      doc.line(posX, y + 5, posX - 1, y + 8);
      // Small rectangle for thermal/magnetic element
      doc.rect(posX - 2, y + 8, 4, 4);
      // Output line
      doc.line(posX, y + 12, posX, y + 12);
    }
  }

  /**
   * Draw Contactor main contacts symbol
   */
  private static drawContactorSymbol(doc: jsPDF, x: number, y: number, spacing: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    for (let i = 0; i < 3; i++) {
      const posX = x + i * spacing;
      // Input line
      doc.line(posX, y, posX, y + 3);
      // Contact symbol (NO contact)
      doc.line(posX, y + 3, posX, y + 4);
      doc.line(posX - 2, y + 4, posX + 3, y + 8);
      // Fixed contact point
      doc.circle(posX, y + 9, 0.8, 'F');
      // Output line
      doc.line(posX, y + 10, posX, y + 12);
    }

    // Mechanical linkage line (dashed)
    doc.setLineDashPattern([1, 1], 0);
    doc.line(x - 2, y + 6, x + spacing * 2 + 2, y + 6);
    doc.setLineDashPattern([], 0);
  }

  /**
   * Draw Overload Relay (OLR) thermal symbol
   */
  private static drawOLRSymbol(doc: jsPDF, x: number, y: number, spacing: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    for (let i = 0; i < 3; i++) {
      const posX = x + i * spacing;
      // Input line
      doc.line(posX, y, posX, y + 2);
      // Thermal element (zigzag/heater)
      const zigzagY = y + 2;
      doc.line(posX, zigzagY, posX - 2, zigzagY + 2);
      doc.line(posX - 2, zigzagY + 2, posX + 2, zigzagY + 4);
      doc.line(posX + 2, zigzagY + 4, posX - 2, zigzagY + 6);
      doc.line(posX - 2, zigzagY + 6, posX, zigzagY + 8);
      // Output line
      doc.line(posX, y + 10, posX, y + 12);
    }

    // Bimetallic trip indicator
    doc.setLineDashPattern([0.5, 0.5], 0);
    doc.line(x - 3, y + 6, x + spacing * 2 + 3, y + 6);
    doc.setLineDashPattern([], 0);
  }

  /**
   * Draw Motor symbol - Circle with M and 3~
   */
  private static drawMotorSymbol(doc: jsPDF, x: number, y: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);

    // Motor circle
    doc.circle(x, y, 8, 'S');

    // M letter
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('M', x - 3, y + 1);

    // 3-phase indicator
    doc.setFontSize(6);
    doc.text('3~', x - 2, y + 5);

    // Ground symbol below motor
    doc.line(x, y + 8, x, y + 11);
    doc.line(x - 4, y + 11, x + 4, y + 11);
    doc.line(x - 2.5, y + 12, x + 2.5, y + 12);
    doc.line(x - 1, y + 13, x + 1, y + 13);
  }

  /**
   * Draw Fuse symbol
   */
  private static drawFuseSymbol(doc: jsPDF, x: number, y: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    // Rectangle with internal line
    doc.rect(x - 2, y, 4, 10);
    doc.line(x, y, x, y + 10);
  }

  /**
   * Draw NC (Normally Closed) Push Button symbol
   */
  private static drawNCButtonSymbol(doc: jsPDF, x: number, y: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    // Input line
    doc.line(x, y, x, y + 2);
    // Closed contact bar
    doc.line(x - 3, y + 2, x + 3, y + 2);
    // Push button actuator
    doc.line(x, y + 2, x, y + 4);
    doc.line(x - 2, y + 4, x + 2, y + 4);
    doc.line(x, y + 4, x, y + 6);
    // Output contact point
    doc.circle(x, y + 6, 0.6, 'F');
    doc.line(x, y + 6, x, y + 8);
  }

  /**
   * Draw NO (Normally Open) Push Button symbol
   */
  private static drawNOButtonSymbol(doc: jsPDF, x: number, y: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    // Input line
    doc.line(x, y, x, y + 2);
    // Open contact
    doc.circle(x, y + 2, 0.6, 'F');
    // Gap and tilted contact
    doc.line(x, y + 2, x + 3, y + 5);
    // Push button actuator
    doc.line(x + 1.5, y + 3.5, x + 1.5, y + 5);
    doc.line(x, y + 5, x + 3, y + 5);
    // Output contact point
    doc.circle(x, y + 6, 0.6, 'F');
    doc.line(x, y + 6, x, y + 8);
  }

  /**
   * Draw NO Contact symbol (auxiliary contact)
   */
  private static drawNOContactSymbol(doc: jsPDF, x: number, y: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    doc.circle(x, y, 0.6, 'F');
    doc.line(x, y, x + 3, y + 4);
    doc.circle(x, y + 5, 0.6, 'F');
    doc.line(x, y + 5, x, y + 6);
  }

  /**
   * Draw NC Contact symbol (auxiliary contact)
   */
  private static drawNCContactSymbol(doc: jsPDF, x: number, y: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    doc.line(x - 3, y, x + 3, y);
    doc.line(x, y, x, y + 2);
    doc.circle(x, y + 3, 0.6, 'F');
    doc.line(x, y + 3, x, y + 6);
  }

  /**
   * Draw Coil symbol (contactor/relay coil)
   */
  private static drawCoilSymbol(doc: jsPDF, x: number, y: number) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    // Coil rectangle with curved sides
    doc.rect(x - 4, y, 8, 12);

    // Internal coil representation (semicircles)
    const coilY = y + 2;
    for (let i = 0; i < 3; i++) {
      // Small arc representations
      doc.line(x - 2, coilY + i * 3, x + 2, coilY + i * 3);
    }
  }

  /**
   * Add Bill of Materials table
   */
  private static addBOM(doc: jsPDF, circuit: CircuitDiagram, yPos: number) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL OF MATERIALS (BOM)', 15, yPos);

    const bomData = circuit.components.map((comp) => [
      comp.ref,
      comp.type,
      comp.description,
      comp.manufacturer,
      comp.partNumber,
      comp.quantity.toString(),
    ]);

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Ref', 'Type', 'Description', 'Manufacturer', 'Part Number', 'Qty']],
      body: bomData,
      theme: 'grid',
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 50 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 10 },
      },
    });
  }

  /**
   * Add wiring connection table
   */
  private static addWiringTable(doc: jsPDF, circuit: CircuitDiagram, yPos: number) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('WIRING CONNECTIONS', 15, yPos);

    const wiringData = circuit.connections.map((conn, index) => [
      (index + 1).toString(),
      conn.from,
      conn.to,
      conn.wireLabel,
      conn.wireType,
    ]);

    autoTable(doc, {
      startY: yPos + 5,
      head: [['#', 'From', 'To', 'Wire Label', 'Wire Type/Size']],
      body: wiringData,
      theme: 'striped',
      headStyles: { fillColor: [46, 204, 113], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 50 },
      },
    });
  }

  /**
   * Add technical notes and safety warnings
   */
  private static addTechnicalNotes(doc: jsPDF, circuit: CircuitDiagram, yPos: number) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TECHNICAL NOTES & SAFETY WARNINGS', 15, yPos);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let currentY = yPos + 10;
    circuit.notes.forEach((note, index) => {
      const noteText = `${index + 1}. ${note}`;
      const lines = doc.splitTextToSize(noteText, 180);
      doc.text(lines, 15, currentY);
      currentY += lines.length * 6 + 2;
    });

    // Safety warning box
    currentY += 10;
    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(1);
    doc.rect(15, currentY, 180, 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text('⚠ SAFETY WARNING', 20, currentY + 8);

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    const warningText = doc.splitTextToSize(
      'This electrical installation must be performed by a qualified electrician in accordance with local electrical codes and regulations. Disconnect all power sources before working on this circuit. Failure to follow safety procedures may result in serious injury or death.',
      170
    );
    doc.text(warningText, 20, currentY + 15);

    // Standards compliance
    currentY += 40;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('STANDARDS COMPLIANCE:', 15, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text('• IEC 60204-1: Safety of Machinery - Electrical Equipment', 15, currentY + 6);
    doc.text('• IEC 60947: Low-voltage Switchgear and Controlgear', 15, currentY + 12);
    doc.text('• NEC (National Electrical Code) - Article 430', 15, currentY + 18);
  }

  /**
   * Add footer to all pages
   */
  private static addFooter(doc: jsPDF) {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(10, 285, 200, 285);

      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);

      doc.text('autopaneldesign.com', 15, 290);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, 195, 290, { align: 'right' });

      doc.setFontSize(7);
      doc.text('Version 1.1 | AI-Powered Electrical Design Tool', 105, 294, { align: 'center' });
    }
  }

  /**
   * Download PDF file
   */
  static downloadPDF(pdf: jsPDF, filename: string = 'DOL_Starter_Circuit.pdf') {
    pdf.save(filename);
  }

  // ============================================================================
  // AI-GENERATED CIRCUIT PDF
  // ============================================================================

  /**
   * Generate PDF from AI-generated circuit template with captured diagram image
   */
  static generateAICircuitPDF(
    template: CircuitTemplate,
    diagramImage: string, // Base64 data URL of the captured SVG diagram
    config: {
      voltage?: string;
      phases?: number;
      frequency?: string;
      projectName?: string;
    } = {}
  ): jsPDF {
    const doc = new jsPDF({
      orientation: 'landscape', // Landscape for better diagram display
      unit: 'mm',
      format: 'a4',
    });

    const {
      voltage = '400V AC',
      phases = 3,
      frequency = '50Hz',
      projectName = 'AI Generated Circuit',
    } = config;

    // Page 1: Title and Circuit Diagram (from AI)
    this.addAITitleBlock(doc, template, projectName);
    this.addAIDiagramImage(doc, diagramImage);

    // Page 2: BOM and Connections
    doc.addPage();
    this.addAIBOM(doc, template);
    this.addAIConnections(doc, template);

    // Page 3: Technical Notes
    doc.addPage();
    this.addAITechnicalNotes(doc, template, { voltage, phases, frequency });

    // Add footer to all pages
    this.addAIFooter(doc);

    return doc;
  }

  /**
   * Add title block for AI-generated circuit
   */
  private static addAITitleBlock(doc: jsPDF, template: CircuitTemplate, projectName: string) {
    // Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.rect(10, 10, 277, 25);

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(template.description || 'AI-Generated Circuit', 148.5, 20, { align: 'center' });

    // Subtitle
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Project: ${projectName} | Generated by Gemini AI`, 148.5, 28, { align: 'center' });

    // Company and revision
    doc.setFontSize(9);
    doc.text('AutoPanel Design', 15, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 260, 32);
  }

  /**
   * Add the AI-generated diagram image to the PDF
   */
  private static addAIDiagramImage(doc: jsPDF, diagramImage: string) {
    const diagramY = 40;
    const diagramWidth = 260;
    const diagramHeight = 140;

    // Add section title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CIRCUIT DIAGRAM (AI Generated)', 15, diagramY);

    // Add the captured diagram image
    try {
      doc.addImage(
        diagramImage,
        'PNG',
        15,
        diagramY + 5,
        diagramWidth,
        diagramHeight,
        undefined,
        'MEDIUM'
      );
    } catch (error) {
      // Fallback if image fails
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Diagram image could not be loaded', 148.5, diagramY + 70, { align: 'center' });
    }

    // Border around diagram
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.rect(15, diagramY + 5, diagramWidth, diagramHeight);
  }

  /**
   * Add Bill of Materials for AI-generated circuit
   */
  private static addAIBOM(doc: jsPDF, template: CircuitTemplate) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL OF MATERIALS (BOM)', 15, 20);

    const bomData = template.components.map((comp, index) => [
      (index + 1).toString(),
      comp.id,
      comp.type,
      comp.label,
      comp.manufacturer || 'N/A',
      '1',
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['#', 'Ref', 'Type', 'Description', 'Manufacturer', 'Qty']],
      body: bomData,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
      },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 80 },
        4: { cellWidth: 50 },
        5: { cellWidth: 15 },
      },
    });
  }

  /**
   * Add connections table for AI-generated circuit
   */
  private static addAIConnections(doc: jsPDF, template: CircuitTemplate) {
    // Get the last Y position from the BOM table
    const lastY = (doc as any).lastAutoTable?.finalY || 100;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('WIRING CONNECTIONS', 15, lastY + 15);

    const connectionData = template.connections.map((conn, index) => [
      (index + 1).toString(),
      `${conn.from.componentId}.${conn.from.pin}`,
      `${conn.to.componentId}.${conn.to.pin}`,
      conn.label || '-',
      conn.wireType,
    ]);

    autoTable(doc, {
      startY: lastY + 20,
      head: [['#', 'From', 'To', 'Label', 'Wire Type']],
      body: connectionData,
      theme: 'striped',
      headStyles: {
        fillColor: [46, 204, 113],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
      },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
      },
    });
  }

  /**
   * Add technical notes for AI-generated circuit
   */
  private static addAITechnicalNotes(
    doc: jsPDF,
    template: CircuitTemplate,
    config: { voltage: string; phases: number; frequency: string }
  ) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TECHNICAL SPECIFICATIONS & NOTES', 15, 20);

    // Power specifications
    const specData = [
      ['Circuit Description', template.description],
      ['Supply Voltage', config.voltage],
      ['Number of Phases', config.phases.toString()],
      ['Frequency', config.frequency],
      ['Total Components', template.components.length.toString()],
      ['Total Connections', template.connections.length.toString()],
      ['Generated By', 'Google Gemini AI (gemini-2.0-flash)'],
      ['Generation Date', new Date().toLocaleString()],
    ];

    autoTable(doc, {
      startY: 25,
      body: specData,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold', fillColor: [240, 240, 240] },
        1: { cellWidth: 150 },
      },
    });

    // Safety warning
    const lastY = (doc as any).lastAutoTable?.finalY || 80;

    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(1);
    doc.rect(15, lastY + 10, 260, 35);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text('SAFETY WARNING', 20, lastY + 20);

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    const warningText = doc.splitTextToSize(
      'This AI-generated circuit diagram is for reference only. All electrical installations must be performed by a qualified electrician in accordance with local electrical codes and regulations (IEC 60204-1, NEC, etc.). The AI-generated design should be verified by a professional engineer before implementation. Disconnect all power sources before working on any circuit.',
      250
    );
    doc.text(warningText, 20, lastY + 27);

    // Standards compliance
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICABLE STANDARDS:', 15, lastY + 55);
    doc.setFont('helvetica', 'normal');
    doc.text('• IEC 60204-1: Safety of Machinery - Electrical Equipment', 15, lastY + 62);
    doc.text('• IEC 60617: Graphical Symbols for Diagrams', 15, lastY + 68);
    doc.text('• IEC 60947: Low-voltage Switchgear and Controlgear', 15, lastY + 74);
  }

  /**
   * Add footer to AI-generated PDF pages
   */
  private static addAIFooter(doc: jsPDF) {
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(10, pageHeight - 12, pageWidth - 10, pageHeight - 12);

      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);

      doc.text('autopaneldesign.com | Powered by Gemini AI', 15, pageHeight - 7);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, pageHeight - 7, {
        align: 'right',
      });
    }
  }
}
