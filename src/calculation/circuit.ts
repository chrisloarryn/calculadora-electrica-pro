import type { CircuitSummary } from '../lib/circuits';
import { clSecRicProfile } from '../standards/clSecRic';
import { getConductorReference, type ConductorReference } from '../standards/conductorReferences';

const resistivityByMaterial = {
  copper: 0.0175,
  aluminium: 0.0282,
} as const;

export interface PreliminaryCircuitResult {
  status: 'blocked' | 'warning';
  installedPowerW: number;
  demandedPowerW: number;
  designCurrentA: number;
  suggestedBreakerA: number | null;
  suggestedConductorMm2: number | null;
  evaluatedConductorMm2: number | null;
  evaluatedConductorCapacityA: number | null;
  estimatedVoltageDropPercent: number | null;
  maximumVoltageDropPercent: number;
  isVoltageDropCompliant: boolean | null;
  warnings: string[];
  appliedRules: string[];
  suggestedCurve: 'B' | 'C' | 'D';
  suggestedRcd: { sensitivityMa: number; nominalCurrentA: number; class: string } | null;
  conductorReference: ConductorReference | null;
}

function selectAtLeast(values: number[], target: number): number | null {
  return values.find((value) => value >= target) ?? null;
}

function blockedResult(
  installedPowerW: number,
  warnings: string[],
  maximumVoltageDropPercent: number,
): PreliminaryCircuitResult {
  return {
    status: 'blocked',
    installedPowerW,
    demandedPowerW: 0,
    designCurrentA: 0,
    suggestedBreakerA: null,
    suggestedConductorMm2: null,
    evaluatedConductorMm2: null,
    evaluatedConductorCapacityA: null,
    estimatedVoltageDropPercent: null,
    maximumVoltageDropPercent,
    isVoltageDropCompliant: null,
    warnings,
    appliedRules: [],
    suggestedCurve: 'C',
    suggestedRcd: null,
    conductorReference: null,
  };
}

function estimateVoltageDropPercent(
  circuit: CircuitSummary,
  currentA: number,
  conductorMm2: number,
  averagePowerFactor: number,
): number {
  const resistivity = resistivityByMaterial[circuit.conductorMaterial];
  const systemMultiplier = circuit.system === 'three-phase' ? Math.sqrt(3) : 2;
  const powerFactor = circuit.system === 'three-phase' ? averagePowerFactor : 1;
  return (systemMultiplier * circuit.lengthM * currentA * resistivity * powerFactor * 100) /
    (conductorMm2 * circuit.voltageV);
}

export function calculatePreliminaryCircuit(circuit: CircuitSummary): PreliminaryCircuitResult {
  const voltageDropPolicy = clSecRicProfile.voltageDropPolicy ?? {
    branchCircuitMaxPercent: circuit.maximumVoltageDropPercent,
    totalInstallationMaxPercent: 5,
    note: '',
  };
  const maximumVoltageDropPercent = Math.min(
    circuit.maximumVoltageDropPercent,
    voltageDropPolicy.branchCircuitMaxPercent,
  );
  const warnings = [
    'Resultado preliminar: requiere validación profesional y perfil normativo aprobado.',
  ];

  if (circuit.standardProfile !== 'CL-SEC-RIC') {
    return blockedResult(
      0,
      ['El perfil Argentina está registrado para compatibilidad, pero todavía no contiene reglas verificadas de cálculo.'],
      maximumVoltageDropPercent,
    );
  }

  const loads = circuit.loads.filter(
    (load) => load.name.trim() && load.powerW > 0 && load.quantity > 0,
  );
  const installedPowerW = loads.reduce((total, load) => total + load.powerW * load.quantity, 0);

  if (!circuit.voltageV || installedPowerW === 0) {
    return blockedResult(
      installedPowerW,
      [...warnings, 'Ingresa tensión y al menos una carga con potencia para calcular.'],
      maximumVoltageDropPercent,
    );
  }

  const averagePowerFactor =
    loads.reduce((total, load) => total + load.powerFactor, 0) / loads.length;
  const averageEfficiency =
    loads.reduce((total, load) => total + load.efficiency, 0) / loads.length;
  const demandFactor = circuit.demandRule === 'profile-rule' ? 1 : circuit.demandFactor;
  const demandedPowerW = installedPowerW * demandFactor;
  const denominator =
    circuit.system === 'three-phase'
      ? Math.sqrt(3) * circuit.voltageV * averagePowerFactor * averageEfficiency
      : circuit.voltageV * averagePowerFactor * averageEfficiency;
  const temperatureFactor =
    circuit.ambientTemperatureC > 40 ? 0.82 : circuit.ambientTemperatureC > 30 ? 0.91 : 1;
  const groupingFactor = circuit.groupedCircuits > 3 ? 0.7 : circuit.groupedCircuits > 1 ? 0.8 : 1;
  const dutyRule = clSecRicProfile.loadDutyRules?.[circuit.loadDuty] ?? {
    currentMultiplier: 1,
    suggestedCurve: 'B' as const,
  };
  const designCurrentA = (demandedPowerW / denominator) * dutyRule.currentMultiplier;
  const suggestedBreakerA = selectAtLeast(clSecRicProfile.breakerCalibres ?? [], designCurrentA);
  const adjustedCurrentA = designCurrentA / (temperatureFactor * groupingFactor);
  const suggestedCalibre = clSecRicProfile.calibres?.find(
    (calibre) => calibre.i_max >= adjustedCurrentA,
  );
  const suggestedConductorMm2 = suggestedCalibre?.mm2 ?? null;
  const selectedCalibre = circuit.selectedConductorMm2
    ? clSecRicProfile.calibres?.find((calibre) => calibre.mm2 === circuit.selectedConductorMm2)
    : null;
  const evaluatedCalibre = selectedCalibre ?? suggestedCalibre;
  const evaluatedConductorMm2 = evaluatedCalibre?.mm2 ?? null;
  const estimatedVoltageDropPercent = evaluatedConductorMm2
    ? estimateVoltageDropPercent(circuit, designCurrentA, evaluatedConductorMm2, averagePowerFactor)
    : null;
  const evaluatedConductorCapacityA = evaluatedCalibre?.i_max ?? null;
  const isVoltageDropCompliant =
    estimatedVoltageDropPercent === null
      ? null
      : estimatedVoltageDropPercent <= maximumVoltageDropPercent;

  const suggestedCurve = loads.some((load) => load.type === 'motor')
    ? 'D'
    : loads.some((load) => load.type === 'electronic')
      ? 'C'
      : dutyRule.suggestedCurve;
  const requiresRcd = loads.some((load) => ['outlet', 'electronic'].includes(load.type));
  const suggestedRcd =
    requiresRcd && suggestedBreakerA
      ? clSecRicProfile.differentials?.find((rcd) => rcd.i_n >= suggestedBreakerA)
      : undefined;

  if (selectedCalibre && adjustedCurrentA > selectedCalibre.i_max) {
    warnings.push(
      `El conductor seleccionado (${String(selectedCalibre.mm2)} mm²) queda sobre la capacidad registrada del perfil para esta condición: ${String(selectedCalibre.i_max)} A frente a ${adjustedCurrentA.toFixed(2)} A ajustados.`,
    );
  }
  if (
    suggestedBreakerA !== null &&
    evaluatedConductorCapacityA !== null &&
    suggestedBreakerA > evaluatedConductorCapacityA
  ) {
    warnings.push(
      `El breaker sugerido (${String(suggestedBreakerA)} A) no protege el conductor evaluado (${String(evaluatedConductorCapacityA)} A) con los datos actuales del perfil.`,
    );
  }
  if (isVoltageDropCompliant === false) {
    warnings.push(
      `La caída estimada supera el límite RIC del circuito terminal de ${String(maximumVoltageDropPercent)} %.`,
    );
  }
  warnings.push(
    'La curva, capacidad de corte, conductor, diferencial y caída de tensión deben verificarse contra la instalación real.',
  );

  return {
    status: 'warning',
    installedPowerW,
    demandedPowerW,
    designCurrentA,
    suggestedBreakerA,
    suggestedConductorMm2,
    evaluatedConductorMm2,
    evaluatedConductorCapacityA,
    estimatedVoltageDropPercent,
    maximumVoltageDropPercent,
    isVoltageDropCompliant,
    warnings,
    appliedRules: [
      `Demanda ${demandFactor.toFixed(2)} mediante regla ${circuit.demandRule}.`,
      `Régimen ${circuit.loadDuty}: multiplicador de corriente x${dutyRule.currentMultiplier.toFixed(2)}.`,
      `Instalación ${circuit.installationMethod}, aislación ${circuit.insulationType}, temperatura ${String(circuit.ambientTemperatureC)} °C y ${String(circuit.groupedCircuits)} circuitos agrupados.`,
      `Límite de caída: circuito terminal ${String(maximumVoltageDropPercent)} % y trayecto total ${String(voltageDropPolicy.totalInstallationMaxPercent)} %. ${voltageDropPolicy.note}`,
      `Conductor evaluado: ${selectedCalibre ? `selección manual de ${String(selectedCalibre.mm2)} mm²` : `automática${suggestedConductorMm2 ? ` (${String(suggestedConductorMm2)} mm²)` : ''}`}.`,
      `Perfil ${clSecRicProfile.id} ${clSecRicProfile.version}: ${clSecRicProfile.verificationStatus ?? 'development'}.`,
    ],
    suggestedCurve,
    suggestedRcd: suggestedRcd
      ? {
          sensitivityMa: suggestedRcd.sensibilidad_mA,
          nominalCurrentA: suggestedRcd.i_n,
          class: suggestedRcd.class,
        }
      : null,
    conductorReference: evaluatedConductorMm2
      ? getConductorReference('CL', evaluatedConductorMm2)
      : null,
  };
}
