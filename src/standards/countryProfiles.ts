export interface CountryProfileOption {
  country: 'CL' | 'AR';
  id: 'CL-SEC-RIC' | 'AR-BASE';
  label: string;
  calculationAvailable: boolean;
}

export const countryProfiles: Record<'CL' | 'AR', CountryProfileOption> = {
  CL: {
    country: 'CL',
    id: 'CL-SEC-RIC',
    label: 'Chile · RIC (desarrollo)',
    calculationAvailable: true,
  },
  AR: {
    country: 'AR',
    id: 'AR-BASE',
    label: 'Argentina · perfil base',
    calculationAvailable: false,
  },
};
