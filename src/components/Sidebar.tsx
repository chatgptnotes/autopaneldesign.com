/**
 * Left Sidebar Navigation
 * Feature list and navigation for the application
 */

import React from 'react';
import {
  MessageSquare,
  Cpu,
  Box,
  FileText,
  Layers,
  Zap,
  Settings,
  Home,
  BookOpen,
  ChevronRight,
  Network,
} from 'lucide-react';
import Logo from './Logo';

// ============================================================================
// TYPES
// ============================================================================

export type FeatureId =
  | 'landing'
  | 'chatbot'
  | 'ai-generator'
  | 'circuit-diagram'
  | 'schematic-2d'
  | 'panel-3d'
  | 'digital-twin'
  | 'pdf-export'
  | 'component-library'
  | 'settings';

interface SidebarFeature {
  id: FeatureId;
  name: string;
  icon: React.ReactNode;
  description: string;
  aiPowered?: boolean;
}

interface SidebarProps {
  currentFeature: FeatureId;
  onFeatureSelect: (featureId: FeatureId) => void;
  isCollapsed?: boolean;
}

// ============================================================================
// FEATURES LIST
// ============================================================================

const FEATURES: SidebarFeature[] = [
  {
    id: 'landing',
    name: 'Home',
    icon: <Home className="w-5 h-5" />,
    description: 'Project overview and introduction',
    aiPowered: false,
  },
  {
    id: 'chatbot',
    name: 'AI Circuit Designer',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Conversational circuit design',
    aiPowered: true,
  },
  {
    id: 'ai-generator',
    name: 'AI Prompt Generator',
    icon: <Zap className="w-5 h-5" />,
    description: 'Natural language to circuits',
    aiPowered: true,
  },
  {
    id: 'circuit-diagram',
    name: 'Circuit Diagrams',
    icon: <Network className="w-5 h-5" />,
    description: 'Professional electrical diagrams',
    aiPowered: true,
  },
  {
    id: 'schematic-2d',
    name: '2D Schematic Editor',
    icon: <Layers className="w-5 h-5" />,
    description: 'Visual circuit diagram editor',
    aiPowered: true,
  },
  {
    id: 'panel-3d',
    name: '3D Panel Viewer',
    icon: <Box className="w-5 h-5" />,
    description: 'Interactive 3D panel layout',
    aiPowered: false,
  },
  {
    id: 'digital-twin',
    name: 'Digital Twin Sync',
    icon: <Cpu className="w-5 h-5" />,
    description: 'Real-time 2D/3D synchronization',
    aiPowered: false,
  },
  {
    id: 'component-library',
    name: 'Component Library',
    icon: <BookOpen className="w-5 h-5" />,
    description: '100+ electrical components',
    aiPowered: false,
  },
  {
    id: 'pdf-export',
    name: 'PDF Export',
    icon: <FileText className="w-5 h-5" />,
    description: 'Professional documentation',
    aiPowered: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Application preferences',
    aiPowered: false,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Sidebar: React.FC<SidebarProps> = ({ currentFeature, onFeatureSelect, isCollapsed = false }) => {
  return (
    <div
      className={`
        ${isCollapsed ? 'w-20' : 'w-72'}
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        border-r border-slate-700
        transition-all duration-300 ease-in-out
        flex flex-col
        h-full
      `}
    >
      {/* Logo / Header */}
      <div className="px-6 py-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Logo size={isCollapsed ? 40 : 48} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">AutoPanel</h1>
              <p className="text-xs text-slate-400">AI-Powered ECAD</p>
            </div>
          )}
        </div>
      </div>

      {/* AI-Powered Badge */}
      {!isCollapsed && (
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-300 font-medium">AI Features Active</span>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {FEATURES.map((feature) => {
            const isActive = currentFeature === feature.id;

            return (
              <button
                key={feature.id}
                onClick={() => onFeatureSelect(feature.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                  group relative
                `}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {feature.icon}
                </div>

                {/* Feature Info */}
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{feature.name}</span>
                      {feature.aiPowered && (
                        <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{feature.description}</p>
                  </div>
                )}

                {/* Active Indicator */}
                {!isCollapsed && isActive && (
                  <ChevronRight className="w-4 h-4 text-white flex-shrink-0" />
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div
                    className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg
                               opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap
                               shadow-xl border border-slate-700 z-50 transition-opacity"
                  >
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{feature.description}</div>
                    {feature.aiPowered && (
                      <div className="text-xs text-purple-400 mt-1">✨ AI-Powered</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-6 py-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-semibold text-slate-300">Production Live</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Version 1.3 • Deployed on Vercel
            </p>
            <div className="flex gap-1 mt-2">
              <div className="flex-1 h-1 bg-blue-500 rounded"></div>
              <div className="flex-1 h-1 bg-purple-500 rounded"></div>
              <div className="flex-1 h-1 bg-pink-500 rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
