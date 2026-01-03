/**
 * GeminiPromptBuilder: Constructs optimized prompts for Gemini AI circuit generation
 * Converts component library to text catalog and defines response schema
 */

import { ComponentDefinition, ComponentType } from '../../types';

export class GeminiPromptBuilder {
  /**
   * Build the complete system prompt with component catalog and response schema
   */
  static buildSystemPrompt(componentLibrary: ComponentDefinition[]): string {
    return `You are an expert electrical engineer specializing in industrial control panel design.
Your task is to generate electrical circuit designs based on user descriptions.

CRITICAL RULES:
1. ALWAYS prefer components from the provided library (use their exact libraryId)
2. Only create new components if absolutely necessary (when no suitable component exists in the library)
3. Follow IEC 60617 and IEEE standards for circuit design
4. Ensure electrical safety: proper overload protection, grounding, emergency stops where needed
5. Respond ONLY with valid JSON matching the schema below - no markdown, no explanations outside JSON
6. Use realistic component positions for clear schematic layout (x: 100-800, y: 100-600)
7. Ensure all connections reference valid component IDs and pin labels from the library

${this.buildComponentCatalog(componentLibrary)}

${this.buildResponseSchema()}

IMPORTANT NOTES:
- For connections, use the pin labels exactly as defined in the component (e.g., "L1", "OUT", "A1", "T1")
- WireType must be one of: "POWER", "SIGNAL", or "GROUND"
- Component type must be one of: MCB, RELAY, CONTACTOR, PLC, TIMER, SENSOR, TERMINAL, POWER_SUPPLY, MOTOR
- Position components logically: power input on left, outputs on right, control below power circuit
- Include proper protection devices (MCBs, overload relays) for motor circuits`;
  }

  /**
   * Convert component library to a readable catalog for the AI
   */
  static buildComponentCatalog(componentLibrary: ComponentDefinition[]): string {
    const grouped = this.groupByType(componentLibrary);

    let catalog = `AVAILABLE COMPONENT LIBRARY:
============================

`;

    for (const [type, components] of Object.entries(grouped)) {
      catalog += `${type}:\n${'─'.repeat(40)}\n`;

      for (const comp of components) {
        const pins = comp.logicalPins.map(p => `${p.label} (${p.type})`).join(', ');
        const ratings = comp.ratings
          ? `${comp.ratings.voltage || '?'}V, ${comp.ratings.current || '?'}A`
          : 'N/A';

        catalog += `ID: ${comp.id}
  Name: ${comp.manufacturer} ${comp.modelNumber} | ${comp.displayName}
  Pins: ${pins}
  Ratings: ${ratings}

`;
      }
    }

    return catalog;
  }

  /**
   * Define the expected JSON response schema
   */
  static buildResponseSchema(): string {
    return `RESPONSE JSON SCHEMA:
====================

You must respond with a JSON object in this exact format:

{
  "description": "Brief description of the generated circuit",
  "reasoning": "Explanation of design choices and component selection",
  "components": [
    {
      "id": "unique_component_id",
      "type": "ComponentType (MCB, RELAY, CONTACTOR, PLC, TIMER, SENSOR, TERMINAL, POWER_SUPPLY, MOTOR)",
      "label": "Human-readable label",
      "libraryId": "exact_id_from_library OR null if creating new",
      "position": { "x": 100, "y": 100 }
    }
  ],
  "connections": [
    {
      "from": { "componentId": "component_id", "pin": "pin_label" },
      "to": { "componentId": "component_id", "pin": "pin_label" },
      "wireType": "POWER | SIGNAL | GROUND",
      "label": "optional_wire_label"
    }
  ],
  "newComponents": [
    {
      "id": "new_component_id",
      "type": "ComponentType",
      "label": "Display Label",
      "suggestedManufacturer": "Manufacturer Name",
      "suggestedModelNumber": "Model Number",
      "ratings": { "voltage": 230, "current": 16, "frequency": 50 },
      "pinDefinitions": [
        { "label": "L1", "type": "POWER", "relativePosition": { "x": 0, "y": 0.2 } },
        { "label": "OUT", "type": "OUTPUT", "relativePosition": { "x": 1, "y": 0.2 } }
      ]
    }
  ]
}

NOTES:
- "newComponents" array is optional and only needed if creating components not in the library
- Pin types: INPUT, OUTPUT, POWER, GROUND, NEUTRAL
- Position x,y should be in reasonable schematic coordinates (100-800 range)
- Always include at least one MCB or circuit breaker for protection in power circuits`;
  }

  /**
   * Group components by their type for organized catalog display
   */
  private static groupByType(componentLibrary: ComponentDefinition[]): Record<string, ComponentDefinition[]> {
    const grouped: Record<string, ComponentDefinition[]> = {};

    for (const comp of componentLibrary) {
      const typeKey = this.getTypeDisplayName(comp.type);
      if (!grouped[typeKey]) {
        grouped[typeKey] = [];
      }
      grouped[typeKey].push(comp);
    }

    return grouped;
  }

  /**
   * Get human-readable display name for component type
   */
  private static getTypeDisplayName(type: ComponentType): string {
    const names: Record<ComponentType, string> = {
      [ComponentType.MCB]: 'CIRCUIT BREAKERS (MCB)',
      [ComponentType.RELAY]: 'RELAYS',
      [ComponentType.CONTACTOR]: 'CONTACTORS',
      [ComponentType.PLC]: 'PLCs (Programmable Logic Controllers)',
      [ComponentType.TIMER]: 'TIMERS',
      [ComponentType.SENSOR]: 'SENSORS & SWITCHES',
      [ComponentType.TERMINAL]: 'TERMINALS',
      [ComponentType.POWER_SUPPLY]: 'POWER SUPPLIES',
      [ComponentType.MOTOR]: 'MOTORS',
    };

    return names[type] || type;
  }

  /**
   * Build the user prompt with the circuit description
   */
  static buildUserPrompt(description: string): string {
    return `USER REQUEST:
${description}

Generate a complete electrical circuit design based on this request. Use components from the library whenever possible. Respond with valid JSON only.`;
  }
}
