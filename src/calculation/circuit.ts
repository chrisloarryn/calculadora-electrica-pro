import type { CircuitSummary } from '../lib/circuits';
import { clSecRicProfile } from '../standards/clSecRic';

export interface PreliminaryCircuitResult {
  status: 'blocked' | 'warning';
  installedPowerW: number;
  demandedPowerW: number;
  designCurrentA: number;
  suggestedBreakerA: number | null;
  suggestedConductorMm2: number | null;
  estimatedVoltageDropPercent: number | null;
  warnings: string[];
  appliedRules: string[];
  suggestedCurve: 'B' | 'C' | 'D';
  suggestedRcd: { sensitivityMa: number; nominalCurrentA: number; class: string } | null;
}

function selectAtLeast(values: number[], target: number): number | null {
  return values.find((value) => value >= target) ?? null;
}

export function calculatePreliminaryCircuit(circuit: CircuitSummary): PreliminaryCircuitResult {
  const warnings = [
    'Resultado preliminar: requiere validación profesional y perfil normativo aprobado.',
  ];
  if (circuit.standardProfile !== 'CL-SEC-RIC') {
    return {
      status: 'blocked',
      installedPowerW: 0,
      demandedPowerW: 0,
      designCurrentA: 0,
      suggestedBreakerA: null,
      suggestedConductorMm2: null,
      estimatedVoltageDropPercent: null,
      warnings: [
        'El perfil Argentina está registrado para compatibilidad, pero todavía no contiene reglas verificadas de cálculo.',
      ],
      appliedRules: [],
      suggestedCurve: 'C',
      suggestedRcd: null,
    };
  }
  const loads = circuit.loads.filter(
    (load) => load.name.trim() && load.powerW > 0 && load.quantity > 0,
  );
  const installedPowerW = loads.reduce((total, load) => total + load.powerW * load.quantity, 0);

  if (!circuit.voltageV || installedPowerW === 0) {
    return {
      status: 'blocked',
      installedPowerW,
      demandedPowerW: 0,
      designCurrentA: 0,
      suggestedBreakerA: null,
      suggestedConductorMm2: null,
      estimatedVoltageDropPercent: null,
      warnings: [...warnings, 'Ingresa tensión y al menos una carga con potencia para calcular.'],
      appliedRules: [],
      suggestedCurve: 'C',
      suggestedRcd: null,
    };
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
  const suggestedConductorMm2 =
    clSecRicProfile.calibres?.find((calibre) => calibre.i_max >= adjustedCurrentA)?.mm2 ?? null;
  const estimatedVoltageDropPercent = suggestedConductorMm2
    ? (2 * circuit.lengthM * designCurrentA * 0.0175 * 100) /
      (suggestedConductorMm2 * circuit.voltageV)
    : null;

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
  if (
    estimatedVoltageDropPercent !== null &&
    estimatedVoltageDropPercent > circuit.maximumVoltageDropPercent
  ) {
    warnings.push(
      `La caída estimada supera el límite configurado de ${String(circuit.maximumVoltageDropPercent)} %.`,
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
    estimatedVoltageDropPercent,
    warnings,
    appliedRules: [
      `Demanda ${demandFactor.toFixed(2)} mediante regla ${circuit.demandRule}.`,
      `Régimen ${circuit.loadDuty}: multiplicador de corriente x${dutyRule.currentMultiplier.toFixed(2)}.`,
      `Instalación ${circuit.installationMethod}, aislación ${circuit.insulationType}, temperatura ${String(circuit.ambientTemperatureC)} °C y ${String(circuit.groupedCircuits)} circuitos agrupados.`,
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
  };
}
