export interface CircuitSummary {
  id: string;
  name: string;
  loadType: string;
  powerW: number;
  lengthM: number;
  status: 'borrador' | 'listo';
}

const CIRCUITS_PREFIX = 'cep-circuits:';

function getKey(projectId: string): string {
  return `${CIRCUITS_PREFIX}${projectId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCircuitSummary(value: unknown): value is CircuitSummary {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.loadType === 'string' &&
    typeof value.powerW === 'number' &&
    typeof value.lengthM === 'number' &&
    (value.status === 'borrador' || value.status === 'listo')
  );
}

export function loadCircuits(projectId: string): CircuitSummary[] {
  try {
    const raw = localStorage.getItem(getKey(projectId));
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCircuitSummary);
  } catch {
    return [];
  }
}

export function saveCircuits(projectId: string, circuits: CircuitSummary[]): void {
  localStorage.setItem(getKey(projectId), JSON.stringify(circuits));
}
