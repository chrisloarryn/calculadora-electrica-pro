export interface ProfileCalibre {
  mm2: number;
  i_max: number;
}

export interface ProfileDifferential {
  sensibilidad_mA: number;
  i_n: number;
  class: 'AC' | 'A' | 'F' | 'B';
}

export interface ProfileLoadDutyRule {
  currentMultiplier: number;
  suggestedCurve: 'B' | 'C' | 'D';
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
  breakerCalibres?: number[];
  voltageDropPolicy?: {
    branchCircuitMaxPercent: number;
    totalInstallationMaxPercent: number;
    note: string;
  };
  loadDutyRules?: Record<string, ProfileLoadDutyRule>;
  installationMethods?: string[];
  insulationTypes?: string[];
  verificationStatus?: 'development' | 'reviewed';
}

export function parseProfile(raw: string): Profile {
  return JSON.parse(raw) as Profile;
}
