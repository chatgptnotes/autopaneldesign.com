/**
 * Circuit Diagram Viewer Page
 * Displays professional electrical circuit diagrams
 */

import React, { useState } from 'react';
import CircuitDiagramRenderer from '../components/CircuitDiagramRenderer';

const CircuitDiagramPage: React.FC = () => {
  const [circuitType, setCircuitType] = useState<'dol' | 'star-delta' | 'reversing' | 'lighting' | 'plc'>('dol');
  const [voltage, setVoltage] = useState('400V');
  const [phases, setPhases] = useState(3);

  return (
    <div className="h-full overflow-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Professional Circuit Diagrams
          </h2>
          <p className="text-slate-600">
            Industry-standard electrical diagrams with proper symbols and color coding
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Circuit Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Circuit Type
              </label>
              <select
                value={circuitType}
                onChange={(e) => setCircuitType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dol">DOL Motor Starter</option>
                <option value="star-delta">Star-Delta Starter</option>
                <option value="reversing">Reversing Starter</option>
                <option value="lighting">Lighting Control</option>
                <option value="plc">PLC Control System</option>
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
                <option value="230V">230V Single Phase</option>
                <option value="400V">400V Three Phase</option>
                <option value="24V">24V DC</option>
                <option value="110V">110V AC</option>
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
          </div>
        </div>

        {/* Circuit Diagram */}
        <CircuitDiagramRenderer
          circuitType={circuitType}
          voltage={voltage}
          phases={phases}
          showExport={true}
        />

        {/* Information Panel */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            About This Diagram
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Power Circuit (Left)</h4>
              <ul className="space-y-1">
                <li>• Three-phase supply (L1, L2, L3)</li>
                <li>• Circuit breakers for protection</li>
                <li>• Main contactor (K1)</li>
                <li>• Overload relay (OL)</li>
                <li>• Three-phase motor</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Control Circuit (Right)</h4>
              <ul className="space-y-1">
                <li>• Stop button (NC - Normally Closed)</li>
                <li>• Start button (NO - Normally Open)</li>
                <li>• Auxiliary contact for latching</li>
                <li>• Magnetizing coil (K1)</li>
                <li>• Neutral connection</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-300">
            <h4 className="font-medium text-blue-900 mb-2">Color Coding</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>L1 (Phase 1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>L2 (Phase 2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>L3 (Phase 3)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Notes */}
        <div className="mt-6 bg-slate-100 border border-slate-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Technical Notes
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <strong>DOL Starter:</strong> Direct On-Line starter is the simplest method of starting a
              three-phase induction motor. It connects the motor directly to the supply voltage.
            </li>
            <li>
              <strong>Contactor (K1):</strong> Electromagnetic switch that controls the motor power supply.
              When energized, it closes and allows current to flow to the motor.
            </li>
            <li>
              <strong>Overload Relay (OL):</strong> Protects the motor from overcurrent conditions.
              Will trip and disconnect the motor if current exceeds safe limits.
            </li>
            <li>
              <strong>Latching Circuit:</strong> The auxiliary contact K1 creates a holding circuit that
              keeps the contactor energized even after the start button is released.
            </li>
            <li>
              <strong>Standards Compliance:</strong> Diagram follows IEC 60204-1 (Safety of Machinery)
              and IEC 60947 (Low-voltage Switchgear) standards.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CircuitDiagramPage;
