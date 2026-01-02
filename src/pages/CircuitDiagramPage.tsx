/**
 * Circuit Diagram Viewer Page
 * Displays professional EPLAN-style electrical circuit diagrams
 * Based on IEC 60617 standards
 *
 * DYNAMIC GENERATION: Uses AI to generate circuits, then renders with EPLAN symbols
 */

import React, { useState, useEffect } from 'react';
import { DynamicEPLANRenderer } from '../components/DynamicEPLANRenderer';
import { AICircuitGenerator, CircuitTemplate } from '../ai/CircuitGenerator';

type CircuitKeyword = 'motor' | 'lighting' | 'plc' | 'power' | 'hvac' | 'pump';

const CircuitDiagramPage: React.FC = () => {
  const [circuitKeyword, setCircuitKeyword] = useState<CircuitKeyword>('motor');
  const [voltage, setVoltage] = useState('400V');
  const [phases, setPhases] = useState(3);
  const [frequency, setFrequency] = useState('50Hz');
  const [motorPower, setMotorPower] = useState('5.5kW');
  const [generatedTemplate, setGeneratedTemplate] = useState<CircuitTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate circuit dynamically when parameters change
  useEffect(() => {
    generateCircuit();
  }, [circuitKeyword, voltage, phases, frequency, motorPower]);

  const generateCircuit = () => {
    setIsGenerating(true);

    // Build natural language description from parameters
    const description = buildCircuitDescription(
      circuitKeyword,
      voltage,
      phases,
      frequency,
      motorPower
    );

    // Use AI to generate circuit
    const result = AICircuitGenerator.generateFromDescription(description);

    if (result.success && result.template) {
      setGeneratedTemplate(result.template);
    }

    setIsGenerating(false);
  };

  return (
    <div className="h-full overflow-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Professional EPLAN-Style Circuit Diagrams
          </h2>
          <p className="text-slate-600">
            Industry-standard IEC 60617 compliant electrical diagrams with proper symbols, wire numbering, and professional layout
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Circuit Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Circuit Type
              </label>
              <select
                value={circuitKeyword}
                onChange={(e) => setCircuitKeyword(e.target.value as CircuitKeyword)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="motor">Motor Starter (DOL)</option>
                <option value="lighting">Lighting Control</option>
                <option value="plc">PLC Control System</option>
                <option value="power">Power Distribution</option>
                <option value="hvac">HVAC Control</option>
                <option value="pump">Pump Control</option>
              </select>
            </div>

            {/* Voltage */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Voltage
              </label>
              <select
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="230V">230V</option>
                <option value="400V">400V</option>
                <option value="24V">24V</option>
                <option value="110V">110V</option>
              </select>
            </div>

            {/* Phases */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phases
              </label>
              <select
                value={phases}
                onChange={(e) => setPhases(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Single Phase</option>
                <option value={3}>Three Phase</option>
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="50Hz">50Hz</option>
                <option value="60Hz">60Hz</option>
              </select>
            </div>

            {/* Motor Power */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Motor Power
              </label>
              <select
                value={motorPower}
                onChange={(e) => setMotorPower(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2.2kW">2.2kW</option>
                <option value="3.7kW">3.7kW</option>
                <option value="5.5kW">5.5kW</option>
                <option value="7.5kW">7.5kW</option>
                <option value="11kW">11kW</option>
                <option value="15kW">15kW</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI-Generated Professional EPLAN-Style Circuit Diagram */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-lg">
          {isGenerating ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Generating circuit with AI...</p>
              </div>
            </div>
          ) : generatedTemplate ? (
            <DynamicEPLANRenderer
              template={generatedTemplate}
              config={{
                voltage: voltage,
                phases: phases,
                frequency: frequency,
                motorPower: motorPower,
              }}
              titleBlock={{
                projectName: 'AI-Generated Circuit',
                projectNumber: 'AI-GEN-001',
                drawnBy: 'AutoPanel AI',
                date: new Date().toLocaleDateString('en-GB'),
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-slate-600 text-lg mb-2">No circuit generated</p>
                <p className="text-slate-400 text-sm">Adjust parameters above to generate a circuit</p>
              </div>
            </div>
          )}
        </div>

        {/* EPLAN Features Panel */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Professional EPLAN-Style Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Standards Compliance</h4>
              <ul className="space-y-1">
                <li>• IEC 60617 electrical symbols</li>
                <li>• ISO 5457 drawing frame</li>
                <li>• ISO 7200 title block</li>
                <li>• IEC 60364 wiring standards</li>
                <li>• Professional grid system (10mm)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Drawing Features</h4>
              <ul className="space-y-1">
                <li>• Wire numbering for traceability</li>
                <li>• Terminal designations</li>
                <li>• Cross-references (K1 coil to contacts)</li>
                <li>• Component designations (Q1, K1, F1)</li>
                <li>• Grid reference system (A-Z, 1-20)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Professional Layout</h4>
              <ul className="space-y-1">
                <li>• Power circuit (left side)</li>
                <li>• Control circuit (right side)</li>
                <li>• Proper line weights</li>
                <li>• Color-coded phase wiring</li>
                <li>• Component list and notes</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-300">
            <h4 className="font-medium text-blue-900 mb-2">Phase Color Coding (IEC 60446)</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded border border-slate-300"></div>
                <span>L1 (Red)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded border border-slate-300"></div>
                <span>L2 (Yellow)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4" style={{ backgroundColor: '#8B4513' }}></div>
                <span>L3 (Brown)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded border border-slate-300"></div>
                <span>Control (Blue)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Notes */}
        <div className="mt-6 bg-slate-100 border border-slate-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Component Designations and Technical Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
            <div>
              <h4 className="font-medium mb-2">Component Designations (IEC 81346)</h4>
              <ul className="space-y-1">
                <li><strong>Q1:</strong> Main Circuit Breaker (protection)</li>
                <li><strong>K1:</strong> Main Contactor (power switching)</li>
                <li><strong>F1:</strong> Motor Overload Relay (thermal protection)</li>
                <li><strong>M1:</strong> Three-Phase Induction Motor</li>
                <li><strong>S0:</strong> Emergency Stop Button (NC)</li>
                <li><strong>S1:</strong> Start Button (NO)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Terminal Designations (IEC 60947)</h4>
              <ul className="space-y-1">
                <li><strong>1-6:</strong> Main circuit terminals (power)</li>
                <li><strong>13-14:</strong> Auxiliary NO contact</li>
                <li><strong>21-22:</strong> Auxiliary NC contact</li>
                <li><strong>A1-A2:</strong> Magnetizing coil terminals</li>
                <li><strong>95-96:</strong> Overload relay contact</li>
                <li><strong>Wire Numbers:</strong> 100-series (power), 500-series (control)</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-400">
            <h4 className="font-medium mb-2">About EPLAN-Style Drawings</h4>
            <p className="text-sm leading-relaxed">
              EPLAN is the world's leading electrical CAD software used by professional engineers.
              These drawings follow the same standards, layout conventions, and symbol libraries used
              in industrial electrical design. Key features include proper component designations,
              terminal numbering, wire identification, cross-references, and professional title blocks.
              This makes the drawings immediately usable for manufacturing, installation, and maintenance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function buildCircuitDescription(
  keyword: CircuitKeyword,
  voltage: string,
  phases: number,
  frequency: string,
  motorPower: string
): string {
  const phaseText = phases === 3 ? 'three phase' : 'single phase';

  switch (keyword) {
    case 'motor':
      return `Create a DOL motor starter circuit with ${voltage} ${phaseText} ${frequency} power supply, ${motorPower} motor, with start stop buttons, contactor, and overload protection`;

    case 'lighting':
      return `Create a lighting control circuit with ${voltage} ${phaseText} power supply, relay control, and light switch`;

    case 'plc':
      return `Create a PLC control system with ${voltage} power supply, digital inputs and outputs, and control logic`;

    case 'power':
      return `Create a power distribution panel with ${voltage} ${phaseText} main breaker and multiple sub-circuits`;

    case 'hvac':
      return `Create an HVAC control system with ${voltage} power supply, temperature sensing, fan control, and heating`;

    case 'pump':
      return `Create a pump control system with ${voltage} ${phaseText} power supply, automatic level sensing, and pump protection`;

    default:
      return `Create an electrical control circuit with ${voltage} ${phaseText} power supply`;
  }
}

export default CircuitDiagramPage;
