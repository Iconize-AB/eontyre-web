import {NextResponse, type NextRequest} from 'next/server'

import {HONEYPOT, isFormType, validateForm} from '@/lib/forms'

/**
 * Receives contact, trial and newsletter submissions.
 *
 * Where submissions should go is still an open question for Eontyre (BRIEF-2).
 * Until it is answered, set FORMS_WEBHOOK_URL to forward them as JSON. Without
 * it, submissions are only logged in development and refused in production,
 * so no lead is silently dropped.
 */
export async function POST(request: NextRequest) {
  let input: Record<string, unknown>
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request'}, {status: 400})
  }

  const formType = input.formType
  if (!isFormType(formType)) return NextResponse.json({error: 'Unknown form'}, {status: 400})

  // Bots fill in the hidden field. Pretend it worked so they don't retry.
  if (typeof input[HONEYPOT] === 'string' && input[HONEYPOT]) return NextResponse.json({ok: true})

  const result = validateForm(formType, input)
  if ('error' in result) return NextResponse.json({error: 'Invalid field', field: result.error}, {status: 422})

  // The trial password is never forwarded or logged: whether "Try free" creates an
  // account in the Eontyre app is undecided, and a password must not go to a lead inbox.
  const values = {...result.values}
  delete values.password
  const locale = typeof input.locale === 'string' ? input.locale : undefined
  const submission = {formType, locale, values, submittedAt: new Date().toISOString()}

  const webhook = process.env.FORMS_WEBHOOK_URL
  if (webhook) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(submission),
    }).catch(() => null)
    if (!response?.ok) return NextResponse.json({error: 'Could not deliver the submission'}, {status: 502})
    return NextResponse.json({ok: true})
  }

  if (process.env.NODE_ENV === 'development') {
    console.info('[forms] FORMS_WEBHOOK_URL is not set; submission not delivered:', formType, Object.keys(values))
    return NextResponse.json({ok: true})
  }

  return NextResponse.json({error: 'Form submissions are not configured'}, {status: 503})
}
