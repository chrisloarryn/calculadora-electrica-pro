import type { PreliminaryCircuitResult } from '../calculation/circuit';
import type { CircuitSummary } from './circuits';

export interface CircuitSnapshot {
  id: string;
  projectId: string;
  circuitId: string;
  createdAt: string;
  circuit: CircuitSummary;
  result: PreliminaryCircuitResult;
}

const SNAPSHOTS_KEY = 'cep-circuit-snapshots';

export function loadSnapshots(): CircuitSnapshot[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SNAPSHOTS_KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed as CircuitSnapshot[]) : [];
  } catch {
    return [];
  }
}

export function saveSnapshot(snapshot: CircuitSnapshot): void {
  localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify([snapshot, ...loadSnapshots()]));
}
