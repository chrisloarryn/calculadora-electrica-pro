export interface ProfileCalibre {
  mm2: number;
  i_max: number;
}

export interface ProfileDifferential {
  sensibilidad_mA: number;
  i_n: number;
}

export interface Profile {
  id: string;
  version: string;
  country: string;
  source?: string;
  author?: string;
  notes?: string;
  calibres?: ProfileCalibre[];
  differentials?: ProfileDifferential[];
}

export function parseProfile(raw: string): Profile {
  return JSON.parse(raw) as Profile;
}
