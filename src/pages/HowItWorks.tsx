/**
 * How It Works Page - SEO-Optimized Content
 * Step-by-step guide to using AutoPanel Design
 */

import React from 'react';
import { MessageSquare, Zap, Download, CheckCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            How to Design Electrical Panels with AI
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Create professional electrical circuit diagrams and control panels in minutes
            with our AI-powered ECAD tool. No installation, no training required.
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div className="mb-4">
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">Step 1</span>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                Describe Your Circuit
              </h2>
            </div>
            <p className="text-slate-600 mb-6">
              Simply chat with our AI and describe what you need in plain English.
              For example: "Create a DOL motor starter for a 7.5kW 3-phase motor with emergency stop"
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700 font-mono">
                "I need a motor starter circuit with overload protection and start/stop buttons"
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="mb-4">
              <span className="text-sm font-bold text-purple-600 uppercase tracking-wide">Step 2</span>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                AI Generates Design
              </h2>
            </div>
            <p className="text-slate-600 mb-6">
              Our AI analyzes your requirements, selects appropriate components (circuit breakers, contactors, relays),
              creates proper wiring connections, and generates both 2D schematics and 3D panel layouts.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">Professional circuit diagrams</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">3D DIN rail layout</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">Safety validation</span>
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
              <Download className="w-8 h-8 text-white" />
            </div>
            <div className="mb-4">
              <span className="text-sm font-bold text-green-600 uppercase tracking-wide">Step 3</span>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                Download Documentation
              </h2>
            </div>
            <p className="text-slate-600 mb-6">
              Export professional 3-page PDF documentation with complete circuit diagrams,
              Bill of Materials (BOM), wiring tables, and installation instructions - ready for production.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-semibold">
                ✓ Production-ready documentation<br/>
                ✓ IEC & NEC compliant<br/>
                ✓ Professional formatting
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Features */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            What You Get with AutoPanel Design
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">AI-Powered Features</h3>
              <ul className="space-y-3">
                {[
                  'Natural language circuit description',
                  'Automatic component selection',
                  'Intelligent wire routing with A* algorithm',
                  'Real-time safety validation',
                  'Pattern recognition for common circuits',
                  'Auto-generated documentation',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Professional Tools</h3>
              <ul className="space-y-3">
                {[
                  '2D electrical schematic editor',
                  '3D panel visualization with DIN rails',
                  'Digital twin synchronization',
                  '100+ electrical components library',
                  'PDF export with BOM and wiring tables',
                  'Standards compliance (IEC 60204, NEC)',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Common Use Cases
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Motor Control Panels',
                description: 'Design DOL starters, star-delta starters, and VFD panels for industrial motors',
                examples: ['Pump control', 'Fan control', 'Conveyor systems']
              },
              {
                title: 'PLC Control Systems',
                description: 'Create PLC wiring diagrams with I/O modules, sensors, and actuators',
                examples: ['Process automation', 'Machine control', 'Building automation']
              },
              {
                title: 'Lighting Control',
                description: 'Design lighting panels with contactors, timers, and photocells',
                examples: ['Warehouse lighting', 'Parking lot control', 'Street lighting']
              },
              {
                title: 'Power Distribution',
                description: 'Layout main distribution boards with circuit breakers and sub-panels',
                examples: ['Industrial facilities', 'Commercial buildings', 'Data centers']
              },
              {
                title: 'HVAC Control',
                description: 'Design heating and cooling control panels with temperature sensors',
                examples: ['Air handling units', 'Chiller control', 'Boiler systems']
              },
              {
                title: 'Safety Systems',
                description: 'Create safety circuits with emergency stops and interlocks',
                examples: ['Machine safety', 'Access control', 'Emergency lighting']
              },
            ].map((useCase, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{useCase.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{useCase.description}</p>
                <div className="space-y-1">
                  {useCase.examples.map((example, j) => (
                    <div key={j} className="text-xs text-slate-500">• {example}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Design Your First Electrical Panel?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            No installation required. No credit card needed. 100% free.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Designing Now
          </button>
          <p className="mt-4 text-sm opacity-75">
            Join thousands of electrical engineers using AutoPanel Design
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
