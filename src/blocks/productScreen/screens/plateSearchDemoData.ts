/** Demo vehicles for the webshop plate search (from the Webshop design reference). */

export interface DemoResult {
  brand: string
  model: string
  /** In the demo's currency, shown with the language's own suffix. */
  price: number
  source: 'own' | 'supplier' | 'partner'
  stock: 'inStock' | 'available' | 'availablePlus'
  count: number
  delivery: 'today' | 'tomorrow' | 'twoDays'
  euLabel: string
}

export interface DemoVehicle {
  model: string
  size: string
  results: DemoResult[]
}

const row = (
  brand: string,
  model: string,
  price: number,
  source: DemoResult['source'],
  stock: DemoResult['stock'],
  count: number,
  delivery: DemoResult['delivery'],
  euLabel: string,
): DemoResult => ({brand, model, price, source, stock, count, delivery, euLabel})

export const demoVehicles: Record<string, DemoVehicle> = {
  ABC123: {
    model: 'Volvo V60 B4, 2021',
    size: '215/55 R17 98W',
    results: [
      row('Michelin', 'Primacy 4+', 1245, 'own', 'inStock', 12, 'today', 'A · B · 69 dB'),
      row('Continental', 'PremiumContact 7', 1189, 'supplier', 'availablePlus', 40, 'tomorrow', 'B · A · 71 dB'),
      row('Nokian', 'Wetproof 1', 1095, 'partner', 'available', 8, 'twoDays', 'B · A · 70 dB'),
    ],
  },
  XYZ789: {
    model: 'Volkswagen ID.4, 2022',
    size: '235/50 R20 104T',
    results: [
      row('Michelin', 'e.Primacy', 2145, 'own', 'inStock', 4, 'today', 'A · B · 68 dB'),
      row('Pirelli', 'P Zero Elect', 2390, 'supplier', 'available', 16, 'tomorrow', 'A · A · 70 dB'),
      row('Hankook', 'iON evo', 1790, 'partner', 'available', 12, 'twoDays', 'B · A · 71 dB'),
    ],
  },
  KLM456: {
    model: 'Toyota RAV4 Hybrid, 2020',
    size: '225/60 R18 100H',
    results: [
      row('Bridgestone', 'Turanza 6', 1520, 'own', 'inStock', 8, 'today', 'B · A · 70 dB'),
      row('Goodyear', 'EfficientGrip 2 SUV', 1465, 'supplier', 'available', 24, 'tomorrow', 'A · B · 69 dB'),
      row('Nokian', 'Powerproof SUV', 1610, 'partner', 'available', 4, 'twoDays', 'A · A · 71 dB'),
    ],
  },
}

export const demoPresets = ['ABC 123', 'XYZ 789', 'KLM 456']

/** "abc-123" → "ABC123" */
export const normalizePlate = (value: string | null | undefined) => (value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '')

/** "abc123" → "ABC 123" */
export function formatPlate(value: string) {
  const plate = normalizePlate(value)
  return plate.length > 3 ? `${plate.slice(0, 3)} ${plate.slice(3)}` : plate
}
