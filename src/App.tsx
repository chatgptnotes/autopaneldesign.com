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
        <footer className="bg-slate-800 text-slate-400 px-6 py-2 text-xs border-t border-slate-700">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-slate-500">autopaneldesign.com</span> | Version 1.3 |{' '}
              {new Date().toLocaleDateString()}
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/chatgptnotes/autopaneldesign.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <span>Powered by Claude AI & React Three Fiber</span>
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
