/**
 * PDF Exporter: Generate professional electrical circuit diagrams
 * Creates industry-standard schematics with symbols, BOM, and specifications
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    let yPos = 20;

    // Page 1: Title and Circuit Diagram
    this.addTitleBlock(doc, circuit);
    yPos = 70;

    this.addProjectInfo(doc, circuit, yPos);
    yPos += 40;

    this.addPowerRatings(doc, circuit, yPos);
    yPos += 30;

    this.addCircuitDiagram(doc, circuit, yPos);

    // Page 2: Bill of Materials and Notes
    doc.addPage();
    yPos = 20;

    this.addBOM(doc, circuit, yPos);
    yPos = 160;

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
   * Add circuit diagram (simplified schematic representation)
   */
  private static addCircuitDiagram(doc: jsPDF, circuit: CircuitDiagram, yPos: number) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CIRCUIT DIAGRAM', 15, yPos);

    const diagramY = yPos + 10;

    // Draw power lines
    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(30, diagramY, 30, diagramY + 100); // L1
    doc.setDrawColor(255, 215, 0);
    doc.line(50, diagramY, 50, diagramY + 100); // L2
    doc.setDrawColor(0, 0, 255);
    doc.line(70, diagramY, 70, diagramY + 100); // L3

    // Labels
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('L1', 28, diagramY - 2);
    doc.text('L2', 48, diagramY - 2);
    doc.text('L3', 68, diagramY - 2);

    // QF1 - Main Breaker
    doc.setDrawColor(0, 0, 0);
    doc.rect(25, diagramY + 5, 50, 10);
    doc.text('QF1', 48, diagramY + 11);

    // KM1 - Contactor
    doc.rect(25, diagramY + 25, 50, 10);
    doc.text('KM1', 48, diagramY + 31);

    // F1 - Overload
    doc.rect(25, diagramY + 45, 50, 10);
    doc.text('F1', 48, diagramY + 51);

    // M1 - Motor symbol
    doc.circle(50, diagramY + 70, 8);
    doc.text('M1', 48, diagramY + 72);
    doc.text('3~', 48, diagramY + 78);

    // Control circuit
    doc.setDrawColor(100, 100, 100);
    doc.line(120, diagramY + 10, 180, diagramY + 10);

    // Stop button
    doc.rect(125, diagramY + 8, 10, 4);
    doc.text('SB2', 128, diagramY + 7);
    doc.text('STOP', 126, diagramY + 15);

    // Start button
    doc.rect(145, diagramY + 8, 10, 4);
    doc.text('SB1', 148, diagramY + 7);
    doc.text('START', 145, diagramY + 15);

    // Coil
    doc.rect(165, diagramY + 8, 10, 4);
    doc.text('KM1', 167, diagramY + 7);
    doc.text('A1-A2', 165, diagramY + 15);

    // Legend
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Power Circuit (Left) | Control Circuit (Right)', 105, yPos + 110, { align: 'center' });
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
}
