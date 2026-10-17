export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing NEXT_PUBLIC_SANITY_PROJECT_ID',
)

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing NEXT_PUBLIC_SANITY_DATASET',
)

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-01'

export const studioUrl = '/studio'

function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined || value === '') throw new Error(message)
  return value
}
