// Mirrors public/flags/manifest.csv — country code -> flag SVG filename.
export const FLAG_FILE: Record<string, string> = {
  BG: 'BG_Bulgaria.svg',
  RS: 'RS_Serbia.svg',
  HR: 'HR_Croatia.svg',
  SI: 'SI_Slovenia.svg',
  IT: 'IT_Italy.svg',
  FR: 'FR_France.svg',
  ES: 'ES_Spain.svg',
  PT: 'PT_Portugal.svg',
  GB: 'GB_United_Kingdom.svg',
  CA: 'CA_Canada.svg',
  US: 'US_United_States.svg',
  MX: 'MX_Mexico.svg',
  GT: 'GT_Guatemala.svg',
  SV: 'SV_El_Salvador.svg',
  HN: 'HN_Honduras.svg',
  NI: 'NI_Nicaragua.svg',
  CR: 'CR_Costa_Rica.svg',
  PA: 'PA_Panama.svg',
  MG: 'MG_Madagascar.svg',
  IL: 'IL_Israel.svg'
}

export function flagUrl(countryCode: string): string | undefined {
  const file = FLAG_FILE[countryCode]
  return file ? `/flags/${file}` : undefined
}
