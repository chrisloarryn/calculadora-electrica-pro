export interface ConductorReference {
  metricMm2: number;
  nearestAwg: string;
  awgAreaMm2: number;
  note: string;
}

const metricAwgReferences: ConductorReference[] = [
  { metricMm2: 1.5, nearestAwg: '15 AWG', awgAreaMm2: 1.65, note: 'Equivalencia aproximada.' },
  { metricMm2: 2.5, nearestAwg: '13 AWG', awgAreaMm2: 2.62, note: 'Equivalencia aproximada.' },
  { metricMm2: 4, nearestAwg: '11 AWG', awgAreaMm2: 4.17, note: 'Equivalencia aproximada.' },
  { metricMm2: 6, nearestAwg: '9 AWG', awgAreaMm2: 6.63, note: 'Equivalencia aproximada.' },
  { metricMm2: 10, nearestAwg: '7 AWG', awgAreaMm2: 10.55, note: 'Equivalencia aproximada.' },
  { metricMm2: 16, nearestAwg: '5 AWG', awgAreaMm2: 16.77, note: 'Equivalencia aproximada.' },
];

export const conductorReferencesByCountry: Record<'CL' | 'AR', ConductorReference[]> = {
  CL: metricAwgReferences,
  AR: metricAwgReferences,
};

export function getConductorReference(
  country: 'CL' | 'AR',
  metricMm2: number,
): ConductorReference | null {
  return (
    conductorReferencesByCountry[country].find((reference) => reference.metricMm2 === metricMm2) ??
    null
  );
}
