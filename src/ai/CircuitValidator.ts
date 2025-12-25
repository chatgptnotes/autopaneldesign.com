/**
 * Circuit Validator: Safety and electrical rules validation
 * Ensures AI-generated circuits comply with electrical standards
 */

import { ComponentInstance, LogicalConnection, ComponentDefinition, ComponentType } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  severity: 'error';
  message: string;
  componentId?: string;
  connectionId?: string;
}

export interface ValidationWarning {
  severity: 'warning';
  message: string;
  componentId?: string;
  connectionId?: string;
}

export class CircuitValidator {
  /**
   * Validate complete circuit design
   */
  static validateCircuit(
    components: ComponentInstance[],
    connections: LogicalConnection[],
    componentLibrary: ComponentDefinition[]
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Run all validation checks
    errors.push(...this.validateComponentRatings(components, componentLibrary));
    errors.push(...this.validateConnections(components, connections, componentLibrary));
    warnings.push(...this.validateSafetyRequirements(components, componentLibrary));
    warnings.push(...this.validatePowerDistribution(components, connections, componentLibrary));

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate component electrical ratings
   */
  private static validateComponentRatings(
    components: ComponentInstance[],
    componentLibrary: ComponentDefinition[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    components.forEach((comp) => {
      const definition = componentLibrary.find((d) => d.id === comp.definitionId);

      if (!definition) {
        errors.push({
          severity: 'error',
          message: `Component definition not found for ${comp.label}`,
          componentId: comp.instanceId,
        });
        return;
      }

      // Check if ratings are defined
      if (!definition.ratings) {
        errors.push({
          severity: 'error',
          message: `Missing electrical ratings for ${comp.label}`,
          componentId: comp.instanceId,
        });
      }
    });

    return errors;
  }

  /**
   * Validate electrical connections
   */
  private static validateConnections(
    components: ComponentInstance[],
    connections: LogicalConnection[],
    componentLibrary: ComponentDefinition[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    connections.forEach((conn) => {
      // Validate connection endpoints exist
      const fromPin = this.findPin(conn.fromPinId, components, componentLibrary);
      const toPin = this.findPin(conn.toPinId, components, componentLibrary);

      if (!fromPin) {
        errors.push({
          severity: 'error',
          message: `Source pin not found: ${conn.fromPinId}`,
          connectionId: conn.id,
        });
      }

      if (!toPin) {
        errors.push({
          severity: 'error',
          message: `Destination pin not found: ${conn.toPinId}`,
          connectionId: conn.id,
        });
      }

      // Validate pin types are compatible
      if (fromPin && toPin) {
        if (fromPin.type === toPin.type && fromPin.type !== 'POWER' && fromPin.type !== 'GROUND') {
          errors.push({
            severity: 'error',
            message: `Invalid connection: Cannot connect ${fromPin.type} to ${toPin.type}`,
            connectionId: conn.id,
          });
        }
      }
    });

    return errors;
  }

  /**
   * Validate safety requirements
   */
  private static validateSafetyRequirements(
    components: ComponentInstance[],
    componentLibrary: ComponentDefinition[]
  ): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    // Check for overload protection on motors
    const hasMotorContactor = components.some((comp) => {
      const def = componentLibrary.find((d) => d.id === comp.definitionId);
      return def?.type === ComponentType.CONTACTOR;
    });

    const hasOverloadRelay = components.some((comp) => {
      const def = componentLibrary.find((d) => d.id === comp.definitionId);
      return def?.type === ComponentType.RELAY && def.displayName.toLowerCase().includes('overload');
    });

    if (hasMotorContactor && !hasOverloadRelay) {
      warnings.push({
        severity: 'warning',
        message: 'Motor circuit should include overload protection',
      });
    }

    // Check for main breaker
    const hasMainBreaker = components.some((comp) => {
      const def = componentLibrary.find((d) => d.id === comp.definitionId);
      return def?.type === ComponentType.MCB && comp.label.toLowerCase().includes('main');
    });

    if (components.length > 3 && !hasMainBreaker) {
      warnings.push({
        severity: 'warning',
        message: 'Circuit should have a main breaker for protection',
      });
    }

    return warnings;
  }

  /**
   * Validate power distribution
   */
  private static validatePowerDistribution(
    components: ComponentInstance[],
    connections: LogicalConnection[],
    componentLibrary: ComponentDefinition[]
  ): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    // Check for power supply when needed
    const needsPowerSupply = components.some((comp) => {
      const def = componentLibrary.find((d) => d.id === comp.definitionId);
      return def?.type === ComponentType.PLC || def?.ratings?.voltage === 24;
    });

    const hasPowerSupply = components.some((comp) => {
      const def = componentLibrary.find((d) => d.id === comp.definitionId);
      return def?.type === ComponentType.POWER_SUPPLY;
    });

    if (needsPowerSupply && !hasPowerSupply) {
      warnings.push({
        severity: 'warning',
        message: 'Circuit may need a 24VDC power supply',
      });
    }

    return warnings;
  }

  /**
   * Helper: Find pin by ID
   */
  private static findPin(pinId: string, components: ComponentInstance[], componentLibrary: ComponentDefinition[]) {
    for (const comp of components) {
      const definition = componentLibrary.find((d) => d.id === comp.definitionId);
      if (definition) {
        const pin = definition.logicalPins.find((p) => p.id === pinId || pinId.includes(p.label));
        if (pin) return pin;
      }
    }
    return null;
  }
}
