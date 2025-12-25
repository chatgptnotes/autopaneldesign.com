/**
 * Main App Component: Split-screen interface
 * Left: Schematic Canvas (Logic/2D)
 * Right: 3D Panel Viewer (Physical/3D)
 */

import React, { useState } from 'react';
import SchematicCanvas from './components/SchematicCanvas';
import Panel3DViewer from './components/Panel3DViewer';
import AIPromptPanel from './components/AIPromptPanel';
import ExportPDFButton from './components/ExportPDFButton';
import LandingPage from './pages/LandingPage';
import { useInitializeApp } from './hooks/useInitializeApp';

type ViewMode = 'landing' | 'design' | 'ai-generate';

const App: React.FC = () => {
  useInitializeApp();
  const [viewMode, setViewMode] = useState<ViewMode>('landing');

  if (viewMode === 'landing') {
    return <LandingPage onEnterApp={() => setViewMode('design')} />;
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Electrical Panel Designer</h1>
            <p className="text-sm text-gray-300">AI-Powered ECAD Tool with Natural Language Generation</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode(viewMode === 'design' ? 'ai-generate' : 'design')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
            >
              {viewMode === 'design' ? 'AI Generate' : 'Back to Design'}
            </button>
            <ExportPDFButton compact />
          </div>
        </div>
      </header>

      {/* Main Content */}
      {viewMode === 'ai-generate' ? (
        <div className="flex-1 overflow-auto p-6">
          <AIPromptPanel />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Schematic View */}
          <div className="w-1/2 border-r border-gray-300 bg-white">
            <div className="h-full flex flex-col">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700">Schematic View (Logic)</h2>
                <p className="text-xs text-gray-500">Drag components and create connections</p>
              </div>
              <div className="flex-1">
                <SchematicCanvas />
              </div>
            </div>
          </div>

          {/* Right Panel: 3D View */}
          <div className="w-1/2 bg-gray-900">
            <div className="h-full flex flex-col">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <h2 className="text-sm font-semibold text-white">3D Panel View (Physical)</h2>
                <p className="text-xs text-gray-400">Place components on DIN rails</p>
              </div>
              <div className="flex-1">
                <Panel3DViewer />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 px-6 py-2 text-xs border-t border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-500">autopaneldesign.com</span> | Version 1.1 | Last updated: {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/chatgptnotes/autopaneldesign.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <span>Powered by React Three Fiber & React Flow</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
