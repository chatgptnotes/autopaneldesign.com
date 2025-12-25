/**
 * ComponentNode: Custom React Flow node for electrical components
 * Displays component with connection handles (pins)
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ComponentInstance, ComponentDefinition } from '../types';

interface ComponentNodeData {
  component: ComponentInstance;
  definition?: ComponentDefinition;
}

const ComponentNode: React.FC<NodeProps<ComponentNodeData>> = ({ data }) => {
  const { component, definition } = data;

  if (!definition) {
    return (
      <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-red-500 bg-red-100">
        <div className="text-xs text-red-700">Component definition not found</div>
      </div>
    );
  }

  const isPlaced = component.isPhysicallyPlaced;

  return (
    <div
      className={`px-4 py-2 shadow-lg rounded-lg border-2 ${
        isPlaced
          ? 'border-green-500 bg-green-50'
          : 'border-red-500 bg-red-50'
      } min-w-[120px]`}
    >
      {/* Component Header */}
      <div className="font-bold text-sm text-gray-800">{component.label}</div>
      <div className="text-xs text-gray-600">{definition.displayName}</div>
      <div className="text-xs text-gray-400">{definition.type}</div>

      {/* Pin Handles */}
      {definition.logicalPins.map((pin, index) => {
        const handleId = `${component.instanceId}_${pin.label}`;

        // Determine handle position based on pin type
        let position: Position;
        if (pin.type === 'INPUT' || pin.type === 'POWER') {
          position = Position.Left;
        } else {
          position = Position.Right;
        }

        return (
          <Handle
            key={pin.id}
            type={pin.type === 'INPUT' || pin.type === 'POWER' ? 'target' : 'source'}
            position={position}
            id={handleId}
            style={{
              top: `${(index + 1) * (100 / (definition.logicalPins.length + 1))}%`,
              background: getPinColor(pin.type),
            }}
            className="w-3 h-3 border-2 border-white"
          />
        );
      })}

      {/* Status indicator */}
      <div className="mt-2 pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              isPlaced ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-gray-600">
            {isPlaced ? '3D Placed' : 'Not Placed'}
          </span>
        </div>
      </div>
    </div>
  );
};

function getPinColor(pinType: string): string {
  switch (pinType) {
    case 'POWER':
      return '#ef4444'; // Red
    case 'INPUT':
      return '#3b82f6'; // Blue
    case 'OUTPUT':
      return '#10b981'; // Green
    case 'GROUND':
      return '#000000'; // Black
    case 'NEUTRAL':
      return '#6b7280'; // Gray
    default:
      return '#8b5cf6'; // Purple
  }
}

export default memo(ComponentNode);
