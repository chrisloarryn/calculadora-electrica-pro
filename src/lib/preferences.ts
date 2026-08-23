const UI_PREFERENCES_KEY = 'cep-ui-preferences';
const ACTIVE_PROJECT_KEY = 'cep-active-project-id';

export interface UiPreferences {
  showPrototypeNotice: boolean;
  rememberActiveProject: boolean;
}

const defaultPreferences: UiPreferences = {
  showPrototypeNotice: true,
  rememberActiveProject: true,
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
