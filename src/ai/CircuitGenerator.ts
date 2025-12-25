/**
 * AI Circuit Generator: Converts natural language descriptions to wiring diagrams
 * Uses pattern matching and electrical engineering rules to generate circuits
 */

import { ComponentType, PinType, WireType } from '../types';

// ============================================================================
// CIRCUIT PATTERNS & TEMPLATES
// ============================================================================

export interface CircuitPattern {
  id: string;
  name: string;
  keywords: string[];
  description: string;
  template: CircuitTemplate;
}

export interface CircuitTemplate {
  components: ComponentSpec[];
  connections: ConnectionSpec[];
  description: string;
}

export interface ComponentSpec {
  id: string;
  type: ComponentType;
  label: string;
  manufacturer?: string;
  position?: { x: number; y: number };
}

export interface ConnectionSpec {
  from: { componentId: string; pin: string };
  to: { componentId: string; pin: string };
  wireType: WireType;
  label?: string;
}

// ============================================================================
// PRE-DEFINED CIRCUIT PATTERNS
// ============================================================================

export const CIRCUIT_PATTERNS: CircuitPattern[] = [
  {
    id: 'motor_starter',
    name: 'Motor Starter Circuit',
    keywords: ['motor', 'starter', 'contactor', 'overload', 'start', 'stop'],
    description: 'Standard 3-phase motor starter with start/stop buttons and overload protection',
    template: {
      description: '3-phase motor starter with DOL (Direct On Line) configuration',
      components: [
        { id: 'mcb', type: ComponentType.MCB, label: 'Main MCB', position: { x: 100, y: 100 } },
        { id: 'contactor', type: ComponentType.CONTACTOR, label: 'Motor Contactor', position: { x: 300, y: 100 } },
        { id: 'overload', type: ComponentType.RELAY, label: 'Overload Relay', position: { x: 500, y: 100 } },
        { id: 'start_button', type: ComponentType.SENSOR, label: 'Start Button', position: { x: 100, y: 300 } },
        { id: 'stop_button', type: ComponentType.SENSOR, label: 'Stop Button', position: { x: 300, y: 300 } },
      ],
      connections: [
        { from: { componentId: 'mcb', pin: 'OUT' }, to: { componentId: 'contactor', pin: 'L1' }, wireType: 'POWER', label: 'L1' },
        { from: { componentId: 'contactor', pin: 'T1' }, to: { componentId: 'overload', pin: 'IN' }, wireType: 'POWER', label: 'Motor L1' },
        { from: { componentId: 'start_button', pin: 'OUT' }, to: { componentId: 'contactor', pin: 'A1' }, wireType: 'SIGNAL', label: 'Start' },
        { from: { componentId: 'stop_button', pin: 'OUT' }, to: { componentId: 'contactor', pin: 'A2' }, wireType: 'SIGNAL', label: 'Stop' },
      ],
    },
  },

  {
    id: 'lighting_control',
    name: 'Lighting Control Circuit',
    keywords: ['light', 'lighting', 'lamp', 'switch', 'relay', 'control'],
    description: 'Relay-based lighting control circuit',
    template: {
      description: 'Simple relay-controlled lighting circuit',
      components: [
        { id: 'mcb', type: ComponentType.MCB, label: 'Lighting MCB', position: { x: 100, y: 100 } },
        { id: 'relay', type: ComponentType.RELAY, label: 'Lighting Relay', position: { x: 300, y: 100 } },
        { id: 'switch', type: ComponentType.SENSOR, label: 'Light Switch', position: { x: 100, y: 300 } },
      ],
      connections: [
        { from: { componentId: 'mcb', pin: 'OUT' }, to: { componentId: 'relay', pin: '11' }, wireType: 'POWER', label: 'L' },
        { from: { componentId: 'switch', pin: 'OUT' }, to: { componentId: 'relay', pin: 'A1' }, wireType: 'SIGNAL', label: 'Control' },
      ],
    },
  },

  {
    id: 'plc_control',
    name: 'PLC Control System',
    keywords: ['plc', 'automation', 'control', 'program', 'logic', 'controller'],
    description: 'Basic PLC control system with I/O',
    template: {
      description: 'PLC with power supply, digital inputs and outputs',
      components: [
        { id: 'psu', type: ComponentType.POWER_SUPPLY, label: '24VDC PSU', position: { x: 100, y: 100 } },
        { id: 'plc', type: ComponentType.PLC, label: 'PLC CPU', position: { x: 400, y: 100 } },
        { id: 'input_sensor', type: ComponentType.SENSOR, label: 'Input Sensor', position: { x: 100, y: 300 } },
        { id: 'output_relay', type: ComponentType.RELAY, label: 'Output Relay', position: { x: 700, y: 100 } },
      ],
      connections: [
        { from: { componentId: 'psu', pin: 'PLUS' }, to: { componentId: 'plc', pin: '24V' }, wireType: 'POWER', label: '24V' },
        { from: { componentId: 'psu', pin: 'MINUS' }, to: { componentId: 'plc', pin: 'GND' }, wireType: 'GROUND', label: '0V' },
        { from: { componentId: 'input_sensor', pin: 'OUT' }, to: { componentId: 'plc', pin: 'DI0' }, wireType: 'SIGNAL', label: 'DI0' },
        { from: { componentId: 'plc', pin: 'DO0' }, to: { componentId: 'output_relay', pin: 'A1' }, wireType: 'SIGNAL', label: 'DO0' },
      ],
    },
  },

  {
    id: 'power_distribution',
    name: 'Power Distribution',
    keywords: ['power', 'distribution', 'panel', 'breaker', 'supply', 'mains'],
    description: 'Basic power distribution with main breaker and sub-circuits',
    template: {
      description: 'Power distribution panel with main breaker and multiple sub-circuits',
      components: [
        { id: 'main_mcb', type: ComponentType.MCB, label: 'Main Breaker', position: { x: 100, y: 100 } },
        { id: 'mcb1', type: ComponentType.MCB, label: 'Circuit 1', position: { x: 300, y: 100 } },
        { id: 'mcb2', type: ComponentType.MCB, label: 'Circuit 2', position: { x: 500, y: 100 } },
        { id: 'mcb3', type: ComponentType.MCB, label: 'Circuit 3', position: { x: 700, y: 100 } },
      ],
      connections: [
        { from: { componentId: 'main_mcb', pin: 'OUT' }, to: { componentId: 'mcb1', pin: 'L1' }, wireType: 'POWER', label: 'L1' },
        { from: { componentId: 'main_mcb', pin: 'OUT' }, to: { componentId: 'mcb2', pin: 'L1' }, wireType: 'POWER', label: 'L1' },
        { from: { componentId: 'main_mcb', pin: 'OUT' }, to: { componentId: 'mcb3', pin: 'L1' }, wireType: 'POWER', label: 'L1' },
      ],
    },
  },

  {
    id: 'hvac_control',
    name: 'HVAC Control System',
    keywords: ['hvac', 'heating', 'cooling', 'air', 'conditioning', 'temperature', 'fan'],
    description: 'HVAC control with temperature sensing and fan control',
    template: {
      description: 'HVAC system with temperature control and fan management',
      components: [
        { id: 'psu', type: ComponentType.POWER_SUPPLY, label: '24VDC PSU', position: { x: 100, y: 100 } },
        { id: 'plc', type: ComponentType.PLC, label: 'HVAC Controller', position: { x: 400, y: 100 } },
        { id: 'temp_sensor', type: ComponentType.SENSOR, label: 'Temp Sensor', position: { x: 100, y: 300 } },
        { id: 'fan_contactor', type: ComponentType.CONTACTOR, label: 'Fan Contactor', position: { x: 700, y: 100 } },
        { id: 'heater_relay', type: ComponentType.RELAY, label: 'Heater Relay', position: { x: 700, y: 300 } },
      ],
      connections: [
        { from: { componentId: 'psu', pin: 'PLUS' }, to: { componentId: 'plc', pin: '24V' }, wireType: 'POWER', label: '24V' },
        { from: { componentId: 'temp_sensor', pin: 'OUT' }, to: { componentId: 'plc', pin: 'DI0' }, wireType: 'SIGNAL', label: 'Temp' },
        { from: { componentId: 'plc', pin: 'DO0' }, to: { componentId: 'fan_contactor', pin: 'A1' }, wireType: 'SIGNAL', label: 'Fan' },
        { from: { componentId: 'plc', pin: 'DO1' }, to: { componentId: 'heater_relay', pin: 'A1' }, wireType: 'SIGNAL', label: 'Heat' },
      ],
    },
  },

  {
    id: 'pump_control',
    name: 'Pump Control System',
    keywords: ['pump', 'water', 'pressure', 'level', 'tank', 'flow'],
    description: 'Automatic pump control with level sensing',
    template: {
      description: 'Pump control system with automatic level sensing and protection',
      components: [
        { id: 'main_mcb', type: ComponentType.MCB, label: 'Main Breaker', position: { x: 100, y: 100 } },
        { id: 'pump_contactor', type: ComponentType.CONTACTOR, label: 'Pump Contactor', position: { x: 300, y: 100 } },
        { id: 'overload', type: ComponentType.RELAY, label: 'Overload', position: { x: 500, y: 100 } },
        { id: 'level_high', type: ComponentType.SENSOR, label: 'Level High', position: { x: 100, y: 300 } },
        { id: 'level_low', type: ComponentType.SENSOR, label: 'Level Low', position: { x: 300, y: 300 } },
      ],
      connections: [
        { from: { componentId: 'main_mcb', pin: 'OUT' }, to: { componentId: 'pump_contactor', pin: 'L1' }, wireType: 'POWER', label: 'L1' },
        { from: { componentId: 'level_low', pin: 'OUT' }, to: { componentId: 'pump_contactor', pin: 'A1' }, wireType: 'SIGNAL', label: 'Start' },
        { from: { componentId: 'level_high', pin: 'OUT' }, to: { componentId: 'pump_contactor', pin: 'A2' }, wireType: 'SIGNAL', label: 'Stop' },
        { from: { componentId: 'pump_contactor', pin: 'T1' }, to: { componentId: 'overload', pin: 'IN' }, wireType: 'POWER', label: 'Motor' },
      ],
    },
  },
];

// ============================================================================
// AI CIRCUIT GENERATOR
// ============================================================================

export class AICircuitGenerator {
  /**
   * Main entry point: Generate circuit from natural language description
   */
  static generateFromDescription(description: string): CircuitGenerationResult {
    const normalizedDesc = description.toLowerCase().trim();

    // Extract key requirements
    const requirements = this.extractRequirements(normalizedDesc);

    // Find matching patterns
    const matchedPattern = this.findBestPattern(normalizedDesc, requirements);

    if (matchedPattern) {
      return {
        success: true,
        template: matchedPattern.template,
        patternUsed: matchedPattern.name,
        confidence: this.calculateConfidence(normalizedDesc, matchedPattern),
        suggestions: this.generateSuggestions(requirements),
      };
    }

    // If no pattern matched, try to generate custom circuit
    const customCircuit = this.generateCustomCircuit(requirements);

    return {
      success: customCircuit !== null,
      template: customCircuit,
      patternUsed: 'Custom Generated',
      confidence: 0.6,
      suggestions: this.generateSuggestions(requirements),
    };
  }

  /**
   * Extract electrical requirements from natural language
   */
  private static extractRequirements(description: string): CircuitRequirements {
    const requirements: CircuitRequirements = {
      voltage: this.extractVoltage(description),
      current: this.extractCurrent(description),
      phases: this.extractPhases(description),
      components: this.extractComponentTypes(description),
      controlType: this.extractControlType(description),
      safety: this.extractSafetyRequirements(description),
    };

    return requirements;
  }

  /**
   * Find best matching circuit pattern
   */
  private static findBestPattern(description: string, requirements: CircuitRequirements): CircuitPattern | null {
    let bestMatch: { pattern: CircuitPattern; score: number } | null = null;

    for (const pattern of CIRCUIT_PATTERNS) {
      const score = this.scorePattern(description, pattern, requirements);

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { pattern, score };
      }
    }

    // Only return if confidence is high enough
    return bestMatch && bestMatch.score > 0.5 ? bestMatch.pattern : null;
  }

  /**
   * Score how well a pattern matches the description
   */
  private static scorePattern(description: string, pattern: CircuitPattern, requirements: CircuitRequirements): number {
    let score = 0;
    const words = description.split(/\s+/);

    // Check keyword matches
    for (const keyword of pattern.keywords) {
      if (description.includes(keyword)) {
        score += 0.2;
      }
    }

    // Check component type matches
    for (const comp of pattern.template.components) {
      if (requirements.components.includes(comp.type)) {
        score += 0.15;
      }
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate confidence score for the generated circuit
   */
  private static calculateConfidence(description: string, pattern: CircuitPattern): number {
    const words = description.split(/\s+/);
    let matches = 0;

    for (const keyword of pattern.keywords) {
      if (description.includes(keyword)) {
        matches++;
      }
    }

    return Math.min(matches / pattern.keywords.length, 1.0);
  }

  /**
   * Generate custom circuit from requirements
   */
  private static generateCustomCircuit(requirements: CircuitRequirements): CircuitTemplate | null {
    if (requirements.components.length === 0) {
      return null;
    }

    const components: ComponentSpec[] = [];
    const connections: ConnectionSpec[] = [];
    let xPos = 100;

    // Generate components based on requirements
    requirements.components.forEach((compType, index) => {
      components.push({
        id: `comp_${index}`,
        type: compType,
        label: `${compType} ${index + 1}`,
        position: { x: xPos, y: 100 },
      });
      xPos += 200;
    });

    // Generate basic connections (power distribution)
    if (components.length > 1) {
      for (let i = 0; i < components.length - 1; i++) {
        connections.push({
          from: { componentId: components[i].id, pin: 'OUT' },
          to: { componentId: components[i + 1].id, pin: 'IN' },
          wireType: 'POWER',
          label: `Connection ${i + 1}`,
        });
      }
    }

    return {
      description: 'Custom generated circuit based on requirements',
      components,
      connections,
    };
  }

  /**
   * Generate helpful suggestions for the user
   */
  private static generateSuggestions(requirements: CircuitRequirements): string[] {
    const suggestions: string[] = [];

    if (!requirements.voltage) {
      suggestions.push('Consider specifying voltage requirements (e.g., "24V DC" or "230V AC")');
    }

    if (!requirements.current) {
      suggestions.push('Add current ratings for proper component sizing (e.g., "16A")');
    }

    if (requirements.safety.length === 0) {
      suggestions.push('Include safety requirements (e.g., "overload protection", "emergency stop")');
    }

    return suggestions;
  }

  // ============================================================================
  // EXTRACTION HELPERS
  // ============================================================================

  private static extractVoltage(description: string): number | null {
    const voltagePattern = /(\d+)\s*v(?:olt)?s?/i;
    const match = description.match(voltagePattern);
    return match ? parseInt(match[1]) : null;
  }

  private static extractCurrent(description: string): number | null {
    const currentPattern = /(\d+)\s*a(?:mp)?s?/i;
    const match = description.match(currentPattern);
    return match ? parseInt(match[1]) : null;
  }

  private static extractPhases(description: string): number {
    if (description.includes('three phase') || description.includes('3 phase')) return 3;
    if (description.includes('single phase') || description.includes('1 phase')) return 1;
    return 1; // Default to single phase
  }

  private static extractComponentTypes(description: string): ComponentType[] {
    const types: ComponentType[] = [];

    if (description.includes('motor') || description.includes('contactor')) {
      types.push(ComponentType.CONTACTOR);
    }
    if (description.includes('plc') || description.includes('controller')) {
      types.push(ComponentType.PLC);
    }
    if (description.includes('relay')) {
      types.push(ComponentType.RELAY);
    }
    if (description.includes('breaker') || description.includes('mcb')) {
      types.push(ComponentType.MCB);
    }
    if (description.includes('power supply') || description.includes('psu')) {
      types.push(ComponentType.POWER_SUPPLY);
    }
    if (description.includes('sensor') || description.includes('switch') || description.includes('button')) {
      types.push(ComponentType.SENSOR);
    }

    return types;
  }

  private static extractControlType(description: string): 'manual' | 'automatic' | 'plc' | null {
    if (description.includes('automatic') || description.includes('auto')) return 'automatic';
    if (description.includes('plc') || description.includes('program')) return 'plc';
    if (description.includes('manual') || description.includes('button')) return 'manual';
    return null;
  }

  private static extractSafetyRequirements(description: string): string[] {
    const safety: string[] = [];

    if (description.includes('overload')) safety.push('overload_protection');
    if (description.includes('emergency') || description.includes('e-stop')) safety.push('emergency_stop');
    if (description.includes('safety') || description.includes('protection')) safety.push('safety_relay');

    return safety;
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface CircuitRequirements {
  voltage: number | null;
  current: number | null;
  phases: number;
  components: ComponentType[];
  controlType: 'manual' | 'automatic' | 'plc' | null;
  safety: string[];
}

export interface CircuitGenerationResult {
  success: boolean;
  template: CircuitTemplate | null;
  patternUsed: string;
  confidence: number;
  suggestions: string[];
}
