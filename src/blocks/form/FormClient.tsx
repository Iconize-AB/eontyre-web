'use client'

import {useId, useState, type FormEvent, type ReactNode} from 'react'

import {formFields, HONEYPOT, type FormField, type FormType} from '@/lib/forms'

interface Props {
  formType: FormType
  /** "stack" (one column), "columns" (two columns, trial) or "inline" (field + button, newsletter). */
  arrangement: 'stack' | 'columns' | 'inline'
  submitLabel: string
  successHeading: string
  successBody: string | null
  errorText: string
  finePrint?: ReactNode
}

const fieldClass =
  'w-full rounded-[4px] border border-field-line bg-surface p-3 text-[16px] text-fg outline-none focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent'

export function FormClient({formType, arrangement, submitLabel, successHeading, successBody, errorText, finePrint}: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const id = useId()
  const fields = formFields[formType]

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data, formType}),
      })
      setStatus(response.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className={`border-t-2 border-accent pt-5 ${arrangement === 'inline' ? '' : 'max-w-[520px]'}`}>
        <p className="text-[22px] font-bold">{successHeading}</p>
        {successBody && <p className="mt-2 text-[16px] leading-[1.55] text-fg-muted">{successBody}</p>}
      </div>
    )
  }

  const submit = (
    <button
      type="submit"
      disabled={status === 'sending'}
      className="min-h-[50px] cursor-pointer self-start rounded-full bg-accent px-6 py-[15px] text-[16px] font-semibold whitespace-nowrap text-on-accent transition-colors duration-150 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
    >
      {submitLabel}
    </button>
  )

  const honeypot = (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input name={HONEYPOT} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )

  const error = status === 'error' && (
    <p role="alert" className="text-[15px] text-accent-text">
      {errorText}
    </p>
  )

  if (arrangement === 'inline') {
    const field = fields[0]
    return (
      <form onSubmit={onSubmit} className="relative flex flex-col gap-3">
        {honeypot}
        <div className="flex flex-wrap gap-2.5">
          <label htmlFor={`${id}-${field.name}`} className="sr-only">
            {field.label}
          </label>
          <input
            id={`${id}-${field.name}`}
            name={field.name}
            type={field.type ?? 'text'}
            required={field.required}
            autoComplete={field.autoComplete}
            placeholder={field.label}
            className={`${fieldClass} flex-[1_1_240px] p-3.5`}
          />
          {submit}
        </div>
        {error}
      </form>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`relative ${
        arrangement === 'columns' ? 'grid max-w-[560px] grid-cols-1 gap-4 sm:grid-cols-2' : 'flex flex-col gap-4'
      }`}
    >
      {honeypot}
      {fields.map((field) => (
        <Field key={field.name} field={field} id={`${id}-${field.name}`} wide={arrangement === 'columns' && field.wide} />
      ))}
      <div className={`mt-2 flex flex-col gap-3 ${arrangement === 'columns' ? 'sm:col-span-2' : ''}`}>
        {submit}
        {error}
        {finePrint && <div className="text-[13px] text-fg-subtle [&_a]:text-fg-subtle">{finePrint}</div>}
      </div>
    </form>
  )
}

function Field({field, id, wide}: {field: FormField; id: string; wide?: boolean}) {
  const common = {
    id,
    name: field.name,
    required: field.required,
    autoComplete: field.autoComplete,
    maxLength: field.maxLength,
    className: fieldClass,
  }

  return (
    <div className={`flex flex-col gap-1.5 ${wide ? 'sm:col-span-2' : ''}`}>
      <label htmlFor={id} className="text-[14px] font-medium">
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea {...common} rows={5} className={`${fieldClass} resize-y`} />
      ) : field.type === 'select' ? (
        <select {...common} defaultValue={field.options?.[0]}>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input {...common} type={field.type ?? 'text'} />
      )}
    </div>
  )
}
