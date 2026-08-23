export type LoadType = 'lighting' | 'outlet' | 'resistive' | 'motor' | 'electronic' | 'custom';
export type LoadDuty = 'standard' | 'continuous' | 'high-starting-current';

export interface CircuitLoad {
  id: string;
  name: string;
  type: LoadType;
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
  demandRule: 'manual' | 'profile-rule';
  loadDuty: LoadDuty;
  lengthM: number;
  breakerCurve: 'auto' | 'B' | 'C' | 'D';
  advanced: boolean;
  conductorMaterial: 'copper' | 'aluminium';
  installationMethod: 'B1' | 'B2' | 'C' | 'E';
  insulationType: 'PVC' | 'XLPE';
  ambientTemperatureC: number;
  groupedCircuits: number;
  maximumVoltageDropPercent: number;
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

function isLoadType(value: unknown): value is LoadType {
  return ['lighting', 'outlet', 'resistive', 'motor', 'electronic', 'custom'].includes(
    value as string,
  );
}

function isCircuitLoad(value: unknown): value is CircuitLoad {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isLoadType(value.type) &&
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
    (value.demandRule === 'manual' || value.demandRule === 'profile-rule') &&
    (value.loadDuty === 'standard' ||
      value.loadDuty === 'continuous' ||
      value.loadDuty === 'high-starting-current') &&
    typeof value.lengthM === 'number' &&
    (value.breakerCurve === 'auto' ||
      value.breakerCurve === 'B' ||
      value.breakerCurve === 'C' ||
      value.breakerCurve === 'D') &&
    typeof value.advanced === 'boolean' &&
    (value.conductorMaterial === 'copper' || value.conductorMaterial === 'aluminium') &&
    (value.installationMethod === 'B1' ||
      value.installationMethod === 'B2' ||
      value.installationMethod === 'C' ||
      value.installationMethod === 'E') &&
    (value.insulationType === 'PVC' || value.insulationType === 'XLPE') &&
    typeof value.ambientTemperatureC === 'number' &&
    typeof value.groupedCircuits === 'number' &&
    typeof value.maximumVoltageDropPercent === 'number' &&
    Array.isArray(value.loads) &&
    value.loads.every(isCircuitLoad) &&
    (value.status === 'borrador' || value.status === 'listo')
  );
}

function migrateLoad(value: unknown, id: string): CircuitLoad {
  if (isCircuitLoad(value)) return value;
  const raw = isRecord(value) ? value : {};
  return {
    id,
    name: typeof raw.name === 'string' ? raw.name : '',
    type: 'custom',
    powerW: typeof raw.powerW === 'number' ? raw.powerW : 0,
    quantity: typeof raw.quantity === 'number' ? raw.quantity : 1,
    powerFactor: typeof raw.powerFactor === 'number' ? raw.powerFactor : 1,
    efficiency: typeof raw.efficiency === 'number' ? raw.efficiency : 1,
  };
}

function migrateCircuit(value: unknown): CircuitSummary | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string')
    return null;
  if (isCircuitSummary(value)) return value;
  const circuitId = value.id;
  const legacyLoads = Array.isArray(value.loads)
    ? value.loads.map((load, index) => migrateLoad(load, `${circuitId}-load-${String(index)}`))
    : [];
  const powerW = typeof value.powerW === 'number' ? value.powerW : 0;
  const loads =
    legacyLoads.length > 0
      ? legacyLoads
      : powerW > 0
        ? [
            {
              id: `${value.id}-load`,
              name: typeof value.loadType === 'string' ? value.loadType : 'Carga general',
              type: 'custom' as const,
              powerW,
              quantity: 1,
              powerFactor: 1,
              efficiency: 1,
            },
          ]
        : [];
  return {
    id: value.id,
    name: value.name,
    system: value.system === 'three-phase' ? 'three-phase' : 'single-phase',
    voltageV: typeof value.voltageV === 'number' ? value.voltageV : 220,
    demandFactor: typeof value.demandFactor === 'number' ? value.demandFactor : 1,
    demandRule: value.demandRule === 'profile-rule' ? 'profile-rule' : 'manual',
    loadDuty:
      value.safetyFactor === 1.25
        ? 'continuous'
        : value.safetyFactor === 1.6
          ? 'high-starting-current'
          : value.loadDuty === 'continuous' || value.loadDuty === 'high-starting-current'
            ? value.loadDuty
            : 'standard',
    lengthM: typeof value.lengthM === 'number' ? value.lengthM : 12,
    breakerCurve:
      value.breakerCurve === 'B' || value.breakerCurve === 'C' || value.breakerCurve === 'D'
        ? value.breakerCurve
        : 'auto',
    advanced: typeof value.advanced === 'boolean' ? value.advanced : false,
    conductorMaterial: value.conductorMaterial === 'aluminium' ? 'aluminium' : 'copper',
    installationMethod:
      value.installationMethod === 'B1' ||
      value.installationMethod === 'B2' ||
      value.installationMethod === 'E'
        ? value.installationMethod
        : 'C',
    insulationType: value.insulationType === 'XLPE' ? 'XLPE' : 'PVC',
    ambientTemperatureC:
      typeof value.ambientTemperatureC === 'number' ? value.ambientTemperatureC : 30,
    groupedCircuits: typeof value.groupedCircuits === 'number' ? value.groupedCircuits : 1,
    maximumVoltageDropPercent:
      typeof value.maximumVoltageDropPercent === 'number' ? value.maximumVoltageDropPercent : 3,
    loads,
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
    demandRule: 'manual',
    loadDuty: 'standard',
    lengthM: 12,
    breakerCurve: 'auto',
    advanced: false,
    conductorMaterial: 'copper',
    installationMethod: 'C',
    insulationType: 'PVC',
    ambientTemperatureC: 30,
    groupedCircuits: 1,
    maximumVoltageDropPercent: 3,
    loads: [],
    status: 'borrador',
  };
}

export function createCircuitLoad(): CircuitLoad {
  return {
    id: `load-${String(Date.now())}`,
    name: '',
    type: 'custom',
    powerW: 0,
    quantity: 1,
    powerFactor: 1,
    efficiency: 1,
  };
}

export function loadCircuits(projectId: string): CircuitSummary[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(getKey(projectId)) ?? '[]');
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
