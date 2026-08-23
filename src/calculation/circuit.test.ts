import { describe, expect, it } from 'vitest';
import { calculatePreliminaryCircuit } from './circuit';
import type { CircuitSummary } from '../lib/circuits';

const circuit: CircuitSummary = {
  id: 'c1',
  name: 'Iluminacion',
  standardProfile: 'CL-SEC-RIC',
  system: 'single-phase',
  voltageV: 220,
  demandFactor: 1,
  demandRule: 'manual',
  loadDuty: 'standard',
  lengthM: 20,
  breakerCurve: 'auto',
  advanced: false,
  conductorMaterial: 'copper',
  installationMethod: 'C',
  insulationType: 'PVC',
  ambientTemperatureC: 30,
  groupedCircuits: 1,
  maximumVoltageDropPercent: 3,
  status: 'borrador',
  loads: [
    {
      id: 'l1',
      name: 'Luces',
      type: 'lighting',
      powerW: 1000,
      quantity: 1,
      powerFactor: 1,
      efficiency: 1,
    },
  ],
};

describe('calculatePreliminaryCircuit', () => {
  it('bloquea un circuito sin cargas utilizables', () => {
    expect(calculatePreliminaryCircuit({ ...circuit, loads: [] }).status).toBe('blocked');
  });

  it('calcula una estimacion preliminar con advertencias', () => {
    const result = calculatePreliminaryCircuit(circuit);
    expect(result.status).toBe('warning');
    expect(result.designCurrentA).toBeCloseTo(1000 / 220);
    expect(result.suggestedBreakerA).toBe(6);
    expect(result.warnings).not.toHaveLength(0);
  });

  it('recalcula la caída con un conductor seleccionado manualmente', () => {
    const automatic = calculatePreliminaryCircuit(circuit);
    const manual = calculatePreliminaryCircuit({ ...circuit, selectedConductorMm2: 6 });

    if (
      automatic.estimatedVoltageDropPercent === null ||
      manual.estimatedVoltageDropPercent === null
    ) {
      throw new Error('La caída de tensión debería estar calculada.');
    }

    expect(manual.evaluatedConductorMm2).toBe(6);
    expect(manual.suggestedConductorMm2).toBe(automatic.suggestedConductorMm2);
    expect(manual.estimatedVoltageDropPercent).toBeLessThan(automatic.estimatedVoltageDropPercent);
    expect(manual.isVoltageDropCompliant).toBe(true);
    expect(manual.maximumVoltageDropPercent).toBe(3);
  });
});
