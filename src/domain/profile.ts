export type Profile = {
  id: string;
  version: string;
  country: string;
  source?: string;
  author?: string;
  notes?: string;
  calibres?: Array<{ mm2: number; i_max: number }>;
  differentials?: Array<{ sensibilidad_mA: number; i_n: number }>;
};

export function parseProfile(raw: string): Profile {
  return JSON.parse(raw) as Profile;
}
