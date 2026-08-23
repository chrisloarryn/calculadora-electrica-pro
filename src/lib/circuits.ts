export interface CircuitLoad {
  id: string;
  name: string;
  powerW: number;
  quantity: number;
  powerFactor: number;
  efficiency: number;
}

export interface CircuitSummary {
  id: string;
  name: string;
  system: 'single-phase' | 'three-phase';
  voltageV: number;
  demandFactor: number;
  safetyFactor: 1 | 1.25 | 1.6;
  lengthM: number;
  breakerCurve: 'auto' | 'B' | 'C' | 'D';
  loads: CircuitLoad[];
  status: 'borrador' | 'listo';
}

const CIRCUITS_PREFIX = 'cep-circuits:';

function getKey(projectId: string): string {
  return `${CIRCUITS_PREFIX}${projectId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCircuitLoad(value: unknown): value is CircuitLoad {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.powerW === 'number' &&
    typeof value.quantity === 'number' &&
    typeof value.powerFactor === 'number' &&
    typeof value.efficiency === 'number'
  );
}

function isCircuitSummary(value: unknown): value is CircuitSummary {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.system === 'single-phase' || value.system === 'three-phase') &&
    typeof value.voltageV === 'number' &&
    typeof value.demandFactor === 'number' &&
    (value.safetyFactor === 1 || value.safetyFactor === 1.25 || value.safetyFactor === 1.6) &&
    typeof value.lengthM === 'number' &&
    (value.breakerCurve === 'auto' ||
      value.breakerCurve === 'B' ||
      value.breakerCurve === 'C' ||
      value.breakerCurve === 'D') &&
    Array.isArray(value.loads) &&
    value.loads.every(isCircuitLoad) &&
    (value.status === 'borrador' || value.status === 'listo')
  );
}

function migrateCircuit(value: unknown): CircuitSummary | null {
  if (isCircuitSummary(value)) {
    return value;
  }

  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') {
    return null;
  }

  const powerW = typeof value.powerW === 'number' ? value.powerW : 0;
  const loadType = typeof value.loadType === 'string' ? value.loadType : 'Carga general';
  const lengthM = typeof value.lengthM === 'number' ? value.lengthM : 0;

  return {
    id: value.id,
    name: value.name,
    system: 'single-phase',
    voltageV: 220,
    demandFactor: 1,
    safetyFactor: 1,
    lengthM,
    breakerCurve: 'auto',
    loads:
      powerW > 0
        ? [
            {
              id: `${value.id}-load`,
              name: loadType,
              powerW,
              quantity: 1,
              powerFactor: 1,
              efficiency: 1,
            },
          ]
        : [],
    status: value.status === 'listo' ? 'listo' : 'borrador',
  };
}

export function createCircuit(): CircuitSummary {
  return {
    id: `circuit-${String(Date.now())}`,
    name: '',
    system: 'single-phase',
    voltageV: 220,
    demandFactor: 1,
    safetyFactor: 1,
    lengthM: 12,
    breakerCurve: 'auto',
    loads: [],
    status: 'borrador',
  };
}

export function createCircuitLoad(): CircuitLoad {
  return {
    id: `load-${String(Date.now())}`,
    name: '',
    powerW: 0,
    quantity: 1,
    powerFactor: 1,
    efficiency: 1,
  };
}

export function loadCircuits(projectId: string): CircuitSummary[] {
  try {
    const raw = localStorage.getItem(getKey(projectId));
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map(migrateCircuit).filter((circuit): circuit is CircuitSummary => circuit !== null)
      : [];
  } catch {
    return [];
  }
}

export function saveCircuits(projectId: string, circuits: CircuitSummary[]): void {
  localStorage.setItem(getKey(projectId), JSON.stringify(circuits));
}
