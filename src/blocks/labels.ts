/** Merges a block's "Interface texts" over the defaults, ignoring texts that are unset or empty. */
export function withLabels<T extends Record<string, string>>(defaults: T, value: object | null | undefined): T {
  const set = Object.entries(value ?? {}).filter(([, text]) => typeof text === 'string' && text.trim())
  return {...defaults, ...Object.fromEntries(set)}
}
