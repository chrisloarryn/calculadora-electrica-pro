import type { ProjectSummary } from '../components/molecules/ProjectCard';

// Minimal IndexedDB wrapper for projects persistence
const DB_NAME = 'cep-db';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';

interface ExportPayload {
  version: number;
  projects: ProjectSummary[];
  exportedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProjectSummary(value: unknown): value is ProjectSummary {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.location === 'string' &&
    typeof value.updatedLabel === 'string' &&
    typeof value.circuits === 'number' &&
    typeof value.progress === 'number' &&
    (typeof value.isDemo === 'boolean' || typeof value.isDemo === 'undefined')
  );
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(toError(req.error));
  });
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROJECTS, 'readonly');
    const store = tx.objectStore(STORE_PROJECTS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as ProjectSummary[]);
    req.onerror = () => reject(toError(req.error));
  });
}

export async function saveProject(project: ProjectSummary): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROJECTS, 'readwrite');
    const store = tx.objectStore(STORE_PROJECTS);
    const req = store.put(project);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(toError(req.error));
  });
}

export async function deleteProject(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROJECTS, 'readwrite');
    const store = tx.objectStore(STORE_PROJECTS);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(toError(req.error));
  });
}

export async function exportAll(): Promise<string> {
  const projects = await getAllProjects();
  const payload: ExportPayload = { version: 1, projects, exportedAt: new Date().toISOString() };
  return JSON.stringify(payload, null, 2);
}

export async function importAll(jsonText: string): Promise<void> {
  const parsed: unknown = JSON.parse(jsonText);
  if (!isRecord(parsed) || !Array.isArray(parsed.projects)) {
    throw new Error('Invalid import format');
  }
  const projects = parsed.projects as unknown[];
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROJECTS, 'readwrite');
    const store = tx.objectStore(STORE_PROJECTS);
    for (const project of projects) {
      if (!isProjectSummary(project)) {
        throw new Error('Invalid import format');
      }
      store.put(project);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(toError(tx.error));
  });
}
