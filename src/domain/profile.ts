import fs from 'fs';
import path from 'path';

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

export function loadProfileFromFile(relPath: string): Profile {
  const p = path.resolve(process.cwd(), relPath);
  const raw = fs.readFileSync(p, { encoding: 'utf8' });
  return JSON.parse(raw) as Profile;
}
