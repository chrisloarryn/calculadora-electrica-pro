const UI_PREFERENCES_KEY = 'cep-ui-preferences';
const ACTIVE_PROJECT_KEY = 'cep-active-project-id';

export interface UiPreferences {
  showPrototypeNotice: boolean;
  rememberActiveProject: boolean;
  country: 'CL' | 'AR';
  defaultVoltageV: number;
  defaultInstallationMethod: 'B1' | 'B2' | 'C' | 'E';
  defaultInsulationType: 'PVC' | 'XLPE';
  defaultAmbientTemperatureC: number;
  defaultGroupedCircuits: number;
  defaultMaximumVoltageDropPercent: number;
  defaultLoadDuty: 'standard' | 'continuous' | 'high-starting-current';
}

const defaultPreferences: UiPreferences = {
  showPrototypeNotice: true,
  rememberActiveProject: true,
  country: 'CL',
  defaultVoltageV: 220,
  defaultInstallationMethod: 'C',
  defaultInsulationType: 'PVC',
  defaultAmbientTemperatureC: 30,
  defaultGroupedCircuits: 1,
  defaultMaximumVoltageDropPercent: 3,
  defaultLoadDuty: 'standard',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function loadUiPreferences(): UiPreferences {
  try {
    const raw = localStorage.getItem(UI_PREFERENCES_KEY);
    if (!raw) {
      return defaultPreferences;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return defaultPreferences;
    }

    return {
      showPrototypeNotice:
        typeof parsed.showPrototypeNotice === 'boolean'
          ? parsed.showPrototypeNotice
          : defaultPreferences.showPrototypeNotice,
      rememberActiveProject:
        typeof parsed.rememberActiveProject === 'boolean'
          ? parsed.rememberActiveProject
          : defaultPreferences.rememberActiveProject,
      country: parsed.country === 'AR' ? 'AR' : 'CL',
      defaultVoltageV:
        typeof parsed.defaultVoltageV === 'number'
          ? parsed.defaultVoltageV
          : defaultPreferences.defaultVoltageV,
      defaultInstallationMethod:
        parsed.defaultInstallationMethod === 'B1' ||
        parsed.defaultInstallationMethod === 'B2' ||
        parsed.defaultInstallationMethod === 'E'
          ? parsed.defaultInstallationMethod
          : 'C',
      defaultInsulationType: parsed.defaultInsulationType === 'XLPE' ? 'XLPE' : 'PVC',
      defaultAmbientTemperatureC:
        typeof parsed.defaultAmbientTemperatureC === 'number'
          ? parsed.defaultAmbientTemperatureC
          : defaultPreferences.defaultAmbientTemperatureC,
      defaultGroupedCircuits:
        typeof parsed.defaultGroupedCircuits === 'number'
          ? parsed.defaultGroupedCircuits
          : defaultPreferences.defaultGroupedCircuits,
      defaultMaximumVoltageDropPercent:
        typeof parsed.defaultMaximumVoltageDropPercent === 'number'
          ? parsed.defaultMaximumVoltageDropPercent
          : defaultPreferences.defaultMaximumVoltageDropPercent,
      defaultLoadDuty:
        parsed.defaultLoadDuty === 'continuous' ||
        parsed.defaultLoadDuty === 'high-starting-current'
          ? parsed.defaultLoadDuty
          : 'standard',
    };
  } catch {
    return defaultPreferences;
  }
}

export function saveUiPreferences(preferences: UiPreferences): void {
  localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(preferences));
}

export function loadActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
}

export function saveActiveProjectId(projectId: string | null): void {
  if (projectId) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
  } else {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}
