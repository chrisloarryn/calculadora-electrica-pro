import type { LoadType } from '../lib/circuits';

export interface LoadCatalogItem {
  name: string;
  type: LoadType;
  powerW: number;
  powerFactor: number;
  efficiency: number;
  ratedCurrentA?: number;
  notes?: string;
  nominalVoltageV?: number;
  phases?: 1 | 3;
  source?: string;
}

export const chileLoadCatalog: LoadCatalogItem[] = [
  { name: 'Iluminación LED', type: 'lighting', powerW: 12, powerFactor: 0.9, efficiency: 1 },
  { name: 'Enchufe de uso general', type: 'outlet', powerW: 200, powerFactor: 1, efficiency: 1 },
  { name: 'Hervidor', type: 'resistive', powerW: 2000, powerFactor: 1, efficiency: 1 },
  { name: 'Calefactor', type: 'resistive', powerW: 2000, powerFactor: 1, efficiency: 1 },
  { name: 'Lavadora', type: 'motor', powerW: 800, powerFactor: 0.85, efficiency: 0.85 },
  { name: 'Refrigerador', type: 'motor', powerW: 300, powerFactor: 0.8, efficiency: 0.8 },
  { name: 'Computador', type: 'electronic', powerW: 250, powerFactor: 0.95, efficiency: 1 },
  {
    name: 'Wall connector (definir potencia de placa)',
    type: 'electronic',
    powerW: 0,
    powerFactor: 1,
    efficiency: 1,
    notes: 'Ingresa la potencia y corriente nominal indicadas por el fabricante.',
  },
  {
    name: 'SAVE Tesla 22 kW · Tipo 2',
    type: 'electronic',
    powerW: 22000,
    powerFactor: 1,
    efficiency: 1,
    nominalVoltageV: 380,
    phases: 3,
    source: 'SEC Resolución Exenta Electrónica N°24215, 03-04-2024; RIC N°15.',
    notes:
      'Autorización de producto para instalaciones específicas. Verificar compatibilidad del caso, datos de placa y requisitos RIC N°15.',
  },
  {
    name: 'Cortina eléctrica RF 230 V',
    type: 'motor',
    powerW: 200,
    powerFactor: 1,
    efficiency: 1,
    ratedCurrentA: 0.87,
    notes: 'Receptor RF integrado; confirmar datos de placa antes de calcular.',
  },
];
