/**
 * Form definitions shared by the form block (client) and the /api/forms route
 * (server). The fields of each form are fixed here, not in Sanity (BRIEF-2).
 */

export type FormType = 'contact' | 'trial' | 'newsletter'

export interface FormField {
  name: string
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select'
  required?: boolean
  autoComplete?: string
  options?: string[]
  /** Spans both columns in two-column forms. */
  wide?: boolean
  maxLength?: number
}

export const formFields: Record<FormType, FormField[]> = {
  contact: [
    {name: 'name', required: true, autoComplete: 'name', maxLength: 200},
    {name: 'email', type: 'email', required: true, autoComplete: 'email', maxLength: 320},
    {name: 'message', type: 'textarea', required: true, maxLength: 5000},
  ],
  trial: [
    {name: 'company', required: true, wide: true, autoComplete: 'organization', maxLength: 200},
    {name: 'orgNumber', maxLength: 40},
    {name: 'phone', type: 'tel', autoComplete: 'tel', maxLength: 40},
    {name: 'address', wide: true, autoComplete: 'street-address', maxLength: 200},
    {name: 'zip', autoComplete: 'postal-code', maxLength: 20},
    {name: 'city', autoComplete: 'address-level2', maxLength: 100},
    {
      name: 'country',
      type: 'select',
      wide: true,
      autoComplete: 'country-name',
      options: ['Sweden', 'Norway', 'Denmark', 'Finland', 'Other'],
    },
    {name: 'email', type: 'email', required: true, autoComplete: 'email', maxLength: 320},
    {name: 'password', type: 'password', autoComplete: 'new-password', maxLength: 200},
  ],
  newsletter: [{name: 'email', type: 'email', required: true, autoComplete: 'email', maxLength: 320}],
}

/** Hidden field that people never fill in; bots often do. */
export const HONEYPOT = 'website'

export const isFormType = (value: unknown): value is FormType =>
  value === 'contact' || value === 'trial' || value === 'newsletter'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns the cleaned values, or the name of the first invalid field. */
export function validateForm(type: FormType, input: Record<string, unknown>) {
  const values: Record<string, string> = {}
  for (const field of formFields[type]) {
    const raw = input[field.name]
    const value = typeof raw === 'string' ? raw.trim() : ''
    if (field.required && !value) return {error: field.name}
    if (field.maxLength && value.length > field.maxLength) return {error: field.name}
    if (value && field.type === 'email' && !EMAIL.test(value)) return {error: field.name}
    if (value && field.options && !field.options.includes(value)) return {error: field.name}
    if (value) values[field.name] = value
  }
  return {values}
}
