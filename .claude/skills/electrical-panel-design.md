# Electrical Panel Design Skill

## Description
Expert knowledge in electrical panel design, ECAD tools, industrial automation, and AI-powered circuit generation. This skill enables advanced features for the AutoPanel Design project.

## Expertise Areas

### 1. Electrical Engineering
- Industrial control systems
- Motor control circuits (DOL, Star-Delta, VFD)
- PLC integration and I/O design
- Power distribution and protection
- Electrical safety standards (IEC 60204, NEC, UL508A)
- Component selection and sizing
- Wire sizing and voltage drop calculations

### 2. Circuit Patterns
- Motor starter circuits (DOL, reversing, star-delta)
- Lighting control systems
- HVAC control circuits
- Pump and fan control
- Emergency stop circuits
- Safety interlock systems
- Process control loops
- Building automation

### 3. Component Knowledge
- Circuit breakers and protection devices
- Contactors and relays
- PLCs and controllers
- Power supplies and transformers
- Sensors and switches
- Terminal blocks and connectors
- Cable and wiring specifications
- DIN rail components

### 4. Standards and Compliance
- IEC 60204-1: Safety of Machinery
- IEC 60947: Low-voltage Switchgear
- NEC (National Electrical Code)
- UL 508A: Industrial Control Panels
- ISO 9001: Quality Management
- CE marking requirements
- NFPA 70E: Electrical Safety

### 5. AI and Automation
- Natural language processing for circuit descriptions
- Pattern matching and recognition
- Circuit validation and error detection
- Component recommendation algorithms
- Auto-routing and optimization
- BOM generation and cost estimation

## Common Tasks

### Circuit Generation
```
User: "Create a 3-phase motor starter with overload protection"
Response: Generate DOL starter with:
- Main circuit breaker (3-pole)
- Contactor (3-pole, appropriate rating)
- Thermal overload relay
- Start/Stop buttons
- Indicator lights
- Control circuit with E-stop
```

### Component Selection
```
Input: Motor 7.5kW, 400V, 3-phase
Output:
- MCB: 32A, C-curve, 3-pole
- Contactor: 25A, AC3 rating
- Overload: 18-25A adjustable
- Wires: 4mm² for power, 1.5mm² for control
```

### Validation Rules
- Voltage compatibility checks
- Current rating verification
- Protection coordination
- Wire sizing validation
- Safety interlock verification
- Standards compliance checking

## Advanced Features

### 1. Auto-Routing Algorithm
- A* pathfinding in 3D space
- Manhattan routing (90-degree turns)
- Obstacle avoidance
- Cable duct optimization
- Wire bundling
- Length minimization

### 2. BOM Generation
- Component lists with specifications
- Manufacturer part numbers
- Quantity calculations
- Cost estimation
- Supplier information
- Lead time data

### 3. Documentation Export
- Professional PDF schematics
- Wiring diagrams
- Panel layout drawings
- Installation instructions
- Maintenance procedures
- As-built documentation

### 4. Safety Analysis
- Short circuit calculations
- Earth fault protection
- Overload protection verification
- Safety circuit validation
- Emergency stop compliance
- Risk assessment

## Integration Patterns

### With AI Models
```typescript
// Natural language to circuit
const parseCircuitRequest = (description: string) => {
  // Extract components
  const components = extractComponents(description);

  // Determine circuit type
  const pattern = identifyPattern(description);

  // Generate connections
  const connections = generateConnections(components, pattern);

  return { components, connections };
};
```

### With 3D Visualization
```typescript
// Sync 2D schematic to 3D layout
const syncTo3D = (schematicData) => {
  // Place components on DIN rails
  // Route wires in 3D space
  // Check collisions
  // Optimize layout
};
```

### With Validation
```typescript
// Validate electrical design
const validateCircuit = (circuit) => {
  checkVoltageRatings();
  checkCurrentRatings();
  checkProtectionCoordination();
  checkSafetyInterlocks();
  checkStandardsCompliance();
};
```

## Best Practices

### Design Principles
1. Always include main disconnect
2. Proper overcurrent protection
3. Earth fault protection
4. Emergency stop in every circuit
5. Clear component labeling
6. Color-coded wiring
7. Accessible terminals
8. Adequate spacing

### Safety Guidelines
1. Lockout/tagout provisions
2. Safety interlocks on doors
3. Ground fault protection
4. Arc flash labeling
5. Proper ventilation
6. IP rating compliance
7. Temperature considerations

### Documentation Standards
1. Complete component lists
2. Wire numbering schemes
3. Terminal designations
4. Power requirements
5. Installation notes
6. Maintenance procedures
7. Revision control

## Example Workflows

### Workflow 1: New Motor Starter
1. User describes requirement in natural language
2. AI identifies motor starter pattern
3. System generates schematic with proper components
4. Auto-placement in 3D panel layout
5. Wire routing with A* algorithm
6. Validation against standards
7. BOM generation
8. PDF export with documentation

### Workflow 2: Panel Modification
1. Load existing design
2. Add new circuit element
3. Automatic collision detection
4. Re-route affected wires
5. Update BOM
6. Regenerate documentation
7. Highlight changes

### Workflow 3: Standards Compliance Check
1. Import existing design
2. Run validation rules
3. Identify non-compliance issues
4. Suggest corrections
5. Auto-fix where possible
6. Generate compliance report

## Future Enhancements

### Phase 2
- Advanced circuit patterns (star-delta, soft starters)
- Multi-panel systems
- Cable schedule generation
- Conduit sizing
- Heat dissipation calculations
- Short circuit analysis

### Phase 3
- AR visualization for installation
- IoT integration for monitoring
- Predictive maintenance
- Energy efficiency analysis
- Cost optimization suggestions
- Supplier integration

### Phase 4
- AI-powered troubleshooting
- Automated testing procedures
- Digital twin with real-time data
- Remote monitoring and control
- Machine learning for optimization
- Collaborative design in VR

## Resources

### Standards Documents
- IEC 60204-1 (Safety of Machinery)
- IEC 60947-1 to 60947-8 (Switchgear)
- NEC Articles 430, 440, 670
- UL 508A (Industrial Control Panels)
- NFPA 79 (Industrial Machinery)

### Component Catalogs
- Siemens Industry Mall
- Schneider Electric catalog
- ABB Product Guide
- Phoenix Contact catalog
- WAGO component finder

### Design Tools
- EPLAN Electric P8 (reference)
- AutoCAD Electrical (reference)
- SOLIDWORKS Electrical (reference)

## Skill Usage Examples

### Example 1: Create VFD Circuit
```
Prompt: "Design a variable frequency drive panel for a 15kW motor with:
- Input disconnect
- Line reactor
- VFD with bypass contactor
- Output filter
- Remote control capability
- Emergency stop"

Output:
- Complete schematic with all components
- 3D panel layout
- BOM with VFD model suggestions
- Wiring diagram
- Control sequence description
```

### Example 2: Lighting Control
```
Prompt: "Create a lighting panel for a warehouse with:
- 10 zones of LED lighting
- Manual switches and automatic control
- Astronomical time clock
- Daylight sensors
- Emergency lighting circuits"

Output:
- Multi-zone lighting schematic
- Control logic diagram
- Component specifications
- Installation layout
- Programming notes
```

### Example 3: Safety System
```
Prompt: "Design a safety system for a conveyor with:
- Emergency stop at 3 locations
- Safety light curtain
- Two-hand control
- Safety relay
- Status indicators"

Output:
- Safety-rated circuit design
- Category 3 or 4 compliance
- Component specifications (safety-rated)
- Validation report
- Installation instructions
```

## Integration with AutoPanel Design

This skill enhances the AutoPanel Design platform by:

1. **Expanding Circuit Library**: Add 50+ circuit patterns
2. **Improving AI**: Better natural language understanding
3. **Enhanced Validation**: More comprehensive safety checks
4. **Advanced Features**: Heat calculations, arc flash, etc.
5. **Professional Output**: Industry-standard documentation
6. **Educational Content**: Tutorial and best practices

---

**Skill Version**: 1.0
**Last Updated**: December 25, 2025
**Maintained By**: AutoPanel Design Team
