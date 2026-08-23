import type { LoadType } from '../lib/circuits';

export interface LoadCatalogItem {
  name: string;
  type: LoadType;
  powerW: number;
  powerFactor: number;
  efficiency: number;
}

export const chileLoadCatalog: LoadCatalogItem[] = [
  { name: 'Iluminación LED', type: 'lighting', powerW: 12, powerFactor: 0.9, efficiency: 1 },
  { name: 'Enchufe de uso general', type: 'outlet', powerW: 200, powerFactor: 1, efficiency: 1 },
  { name: 'Hervidor', type: 'resistive', powerW: 2000, powerFactor: 1, efficiency: 1 },
  { name: 'Calefactor', type: 'resistive', powerW: 2000, powerFactor: 1, efficiency: 1 },
  { name: 'Lavadora', type: 'motor', powerW: 800, powerFactor: 0.85, efficiency: 0.85 },
  { name: 'Refrigerador', type: 'motor', powerW: 300, powerFactor: 0.8, efficiency: 0.8 },
  { name: 'Computador', type: 'electronic', powerW: 250, powerFactor: 0.95, efficiency: 1 },
];
