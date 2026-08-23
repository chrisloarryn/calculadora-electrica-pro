export type Power = { value: number; unit: 'W' | 'kW' };

export function wToKw(powerW: number): number {
  return powerW / 1000;
}

export function kwToW(powerKw: number): number {
  return Math.round(powerKw * 1000);
}

export function normalizePower(input: number, unit: 'W' | 'kW'): Power {
  if (!Number.isFinite(input) || input < 0) {
    throw new Error('power must be a non-negative finite number');
  }
  return { value: input, unit };
}

export function parsePositiveNumber(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error('invalid positive number');
  return n;
}

export type Voltage = { value: number; unit: 'V' };
export function normalizeVoltage(v: number): Voltage {
  if (!Number.isFinite(v) || v <= 0) throw new Error('voltage must be > 0');
  return { value: v, unit: 'V' };
}

export type Percentage = number; // 0..100
export function normalizePercentage(p: number): Percentage {
  if (!Number.isFinite(p) || p < 0 || p > 100) throw new Error('percentage out of range');
  return p;
}

export type Section = { mm2: number };
export function normalizeSection(mm2: number): Section {
  if (!Number.isFinite(mm2) || mm2 <= 0) throw new Error('section must be > 0');
  return { mm2 };
}

export type Length = { meters: number };
export function normalizeLength(m: number): Length {
  if (!Number.isFinite(m) || m < 0) throw new Error('length must be >= 0');
  return { meters: m };
}
