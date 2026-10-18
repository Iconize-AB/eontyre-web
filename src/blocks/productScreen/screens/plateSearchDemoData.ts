/** Demo vehicles for the webshop plate search (from the Webshop design reference). */

export interface DemoResult {
  brand: string
  model: string
  price: string
  source: string
  qty: string
  delivery: string
  euLabel: string
}

export interface DemoVehicle {
  model: string
  size: string
  results: DemoResult[]
}

const row = (...[brand, model, price, source, qty, delivery, euLabel]: string[]): DemoResult => ({
  brand,
  model,
  price,
  source,
  qty,
  delivery,
  euLabel,
})

export const demoVehicles: Record<string, DemoVehicle> = {
  ABC123: {
    model: 'Volvo V60 B4, 2021',
    size: '215/55 R17 98W',
    results: [
      row('Michelin', 'Primacy 4+', '1 245 kr', 'Own stock', '12 in stock', 'Fit today', 'A · B · 69 dB'),
      row('Continental', 'PremiumContact 7', '1 189 kr', 'Supplier', '40+ available', 'Tomorrow', 'B · A · 71 dB'),
      row('Nokian', 'Wetproof 1', '1 095 kr', 'Partner garage', '8 available', '2 days', 'B · A · 70 dB'),
    ],
  },
  XYZ789: {
    model: 'Volkswagen ID.4, 2022',
    size: '235/50 R20 104T',
    results: [
      row('Michelin', 'e.Primacy', '2 145 kr', 'Own stock', '4 in stock', 'Fit today', 'A · B · 68 dB'),
      row('Pirelli', 'P Zero Elect', '2 390 kr', 'Supplier', '16 available', 'Tomorrow', 'A · A · 70 dB'),
      row('Hankook', 'iON evo', '1 790 kr', 'Partner garage', '12 available', '2 days', 'B · A · 71 dB'),
    ],
  },
  KLM456: {
    model: 'Toyota RAV4 Hybrid, 2020',
    size: '225/60 R18 100H',
    results: [
      row('Bridgestone', 'Turanza 6', '1 520 kr', 'Own stock', '8 in stock', 'Fit today', 'B · A · 70 dB'),
      row('Goodyear', 'EfficientGrip 2 SUV', '1 465 kr', 'Supplier', '24 available', 'Tomorrow', 'A · B · 69 dB'),
      row('Nokian', 'Powerproof SUV', '1 610 kr', 'Partner garage', '4 available', '2 days', 'A · A · 71 dB'),
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
