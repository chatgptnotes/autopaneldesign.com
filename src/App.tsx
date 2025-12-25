/**
 * Main App Component with Sidebar Navigation
 * Features: Chatbot, AI Generator, 2D Schematic, 3D Viewer, Digital Twin
 */

import React, { useState } from 'react';
import SchematicCanvas from './components/SchematicCanvas';
import Panel3DViewer from './components/Panel3DViewer';
import AIPromptPanel from './components/AIPromptPanel';
import ChatbotInterface from './components/ChatbotInterface';
import ExportPDFButton from './components/ExportPDFButton';
import LandingPage from './pages/LandingPage';
import CircuitDiagramPage from './pages/CircuitDiagramPage';
import Sidebar, { FeatureId } from './components/Sidebar';
import { useInitializeApp } from './hooks/useInitializeApp';

const App: React.FC = () => {
  useInitializeApp();
  const [currentFeature, setCurrentFeature] = useState<FeatureId>('landing');

  // Landing page view
  if (currentFeature === 'landing') {
    return <LandingPage onEnterApp={() => setCurrentFeature('chatbot')} />;
  }

  // Main application with sidebar
  return (
    <div className="w-screen h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <Sidebar currentFeature={currentFeature} onFeatureSelect={setCurrentFeature} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {getFeatureTitle(currentFeature)}
              </h1>
              <p className="text-sm text-slate-500">{getFeatureDescription(currentFeature)}</p>
            </div>
            <div className="flex items-center gap-3">
              {currentFeature !== 'chatbot' && currentFeature !== 'pdf-export' && (
                <ExportPDFButton compact />
              )}
            </div>
          </div>
        </header>

        {/* Feature Content */}
        <div className="flex-1 overflow-hidden">
          {renderFeatureContent(currentFeature)}
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-300 px-6 py-3 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">
                © {new Date().getFullYear()} AutoPanel Design
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Version 1.3</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <a
                href="https://bettroi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Bettroi Product
              </a>

              <span className="text-slate-600">|</span>

              <a
                href="https://drmhope.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Powered by DrM Hope Softwares
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <a
                href="https://github.com/chatgptnotes/autopaneldesign.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getFeatureTitle(feature: FeatureId): string {
  const titles: Record<FeatureId, string> = {
    landing: 'Welcome',
    chatbot: 'AI Circuit Designer',
    'ai-generator': 'AI Prompt Generator',
    'circuit-diagram': 'Professional Circuit Diagrams',
    'schematic-2d': '2D Schematic Editor',
    'panel-3d': '3D Panel Viewer',
    'digital-twin': 'Digital Twin Sync',
    'component-library': 'Component Library',
    'pdf-export': 'PDF Export',
    settings: 'Settings',
  };
  return titles[feature];
}

function getFeatureDescription(feature: FeatureId): string {
  const descriptions: Record<FeatureId, string> = {
    landing: 'AI-Powered Electrical Panel Design',
    chatbot: 'Design circuits through conversational AI',
    'ai-generator': 'Generate circuits from natural language',
    'circuit-diagram': 'Industry-standard electrical diagrams with proper symbols',
    'schematic-2d': 'Visual circuit diagram editor',
    'panel-3d': 'Interactive 3D panel layout',
    'digital-twin': 'Real-time 2D/3D synchronization',
    'component-library': '100+ electrical components',
    'pdf-export': 'Professional documentation export',
    settings: 'Application preferences',
  };
  return descriptions[feature];
}

function renderFeatureContent(feature: FeatureId): React.ReactNode {
  switch (feature) {
    case 'chatbot':
      return <ChatbotInterface />;

    case 'ai-generator':
      return (
        <div className="h-full overflow-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
          <AIPromptPanel />
        </div>
      );

    case 'circuit-diagram':
      return <CircuitDiagramPage />;

    case 'schematic-2d':
      return (
        <div className="h-full bg-white">
          <SchematicCanvas />
        </div>
      );

    case 'panel-3d':
      return (
        <div className="h-full bg-slate-900">
          <Panel3DViewer />
        </div>
      );

    case 'digital-twin':
      return (
        <div className="flex h-full">
          {/* Split view: 2D + 3D */}
          <div className="w-1/2 border-r border-slate-300 bg-white">
            <div className="h-full flex flex-col">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-slate-700">Schematic View (Logic)</h2>
                <p className="text-xs text-slate-500">Drag components and create connections</p>
              </div>
              <div className="flex-1">
                <SchematicCanvas />
              </div>
            </div>
          </div>

          <div className="w-1/2 bg-slate-900">
            <div className="h-full flex flex-col">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                <h2 className="text-sm font-semibold text-white">3D Panel View (Physical)</h2>
                <p className="text-xs text-slate-400">Place components on DIN rails</p>
              </div>
              <div className="flex-1">
                <Panel3DViewer />
              </div>
            </div>
          </div>
        </div>
      );

    case 'component-library':
      return (
        <div className="h-full overflow-auto p-6 bg-white">
          <ComponentLibraryView />
        </div>
      );

    case 'pdf-export':
      return (
        <div className="h-full overflow-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
          <PDFExportView />
        </div>
      );

    case 'settings':
      return (
        <div className="h-full overflow-auto p-6 bg-white">
          <SettingsView />
        </div>
      );

    default:
      return (
        <div className="h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Feature Coming Soon</h2>
            <p className="text-slate-500">This feature is under development.</p>
          </div>
        </div>
      );
  }
}

// ============================================================================
// FEATURE VIEWS
// ============================================================================

const ComponentLibraryView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Component Library</h2>
        <p className="text-slate-600">Browse 100+ industrial electrical components</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'MCB (Circuit Breakers)', count: 20, manufacturer: 'Siemens, Schneider' },
          { name: 'Contactors', count: 15, manufacturer: 'ABB, Siemens' },
          { name: 'Relays', count: 18, manufacturer: 'Finder, Phoenix Contact' },
          { name: 'PLCs', count: 8, manufacturer: 'Siemens S7-1200' },
          { name: 'Power Supplies', count: 12, manufacturer: 'Phoenix Contact' },
          { name: 'Terminal Blocks', count: 25, manufacturer: 'WAGO, Phoenix' },
        ].map((category, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-slate-800 mb-2">{category.name}</h3>
            <p className="text-sm text-slate-600 mb-1">{category.count} components</p>
            <p className="text-xs text-slate-500">{category.manufacturer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PDFExportView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">PDF Export</h2>
        <p className="text-slate-600">Generate professional circuit documentation</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <ExportPDFButton />
        <div className="mt-6">
          <h3 className="font-semibold text-slate-800 mb-3">PDF Includes:</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>✓ Circuit diagram with component symbols</li>
            <li>✓ Bill of Materials (BOM) with specifications</li>
            <li>✓ Wiring connection tables</li>
            <li>✓ Technical notes and installation instructions</li>
            <li>✓ Safety warnings and standards compliance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Settings</h2>
        <p className="text-slate-600">Configure application preferences</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-800 mb-4">General</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Dark Mode</span>
              <button className="px-3 py-1 bg-slate-200 rounded text-sm">Coming Soon</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Auto-save</span>
              <button className="px-3 py-1 bg-slate-200 rounded text-sm">Coming Soon</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
