// CANVA-only edition: the entire route is in Bulgaria.
const FLAG_FILE: Record<string, string> = {
  BG: 'BG_Bulgaria.svg'
}

export function flagUrl(countryCode: string): string | undefined {
  const file = FLAG_FILE[countryCode]
  return file ? `/flags/${file}` : undefined
}
