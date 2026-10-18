'use client'

import {useRouter} from 'next/navigation'
import type {FormEvent} from 'react'

import {useDictionary, useLocalizedPath} from '@/i18n/LocaleProvider'

interface PlateSearchProps {
  placeholder: string
  buttonLabel: string
  targetUrl: string
}

/** Sends the plate to the webshop as ?plate=ABC123. Works as a plain GET form without JS. */
export function PlateSearch({placeholder, buttonLabel, targetUrl}: PlateSearchProps) {
  const router = useRouter()
  const {plate: text} = useDictionary()
  const localize = useLocalizedPath()
  const action = localize(targetUrl)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const raw = new FormData(event.currentTarget).get('plate')
    const plate = String(raw ?? '')
      .toUpperCase()
      .replace(/[^A-Z0-9ÅÄÖÆØ]/g, '')
    router.push(plate ? `${action}?plate=${encodeURIComponent(plate)}` : action)
  }

  return (
    <form
      action={action}
      onSubmit={onSubmit}
      className="flex w-full max-w-[520px] flex-wrap gap-2 justify-self-end"
    >
      <div className="flex min-w-0 flex-[1_1_240px] overflow-hidden rounded-[4px] bg-white focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-accent">
        <span
          aria-hidden="true"
          className="flex w-[34px] shrink-0 items-end justify-center bg-plate pb-1.5 text-[13px] font-bold text-white"
        >
          {text.countryCode}
        </span>
        <label htmlFor="plate-search" className="sr-only">
          {text.label}
        </label>
        <input
          id="plate-search"
          name="plate"
          placeholder={placeholder}
          maxLength={7}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 border-0 bg-white px-3.5 py-3 font-mono text-[24px] tracking-[0.08em] text-[#141414] uppercase outline-none"
        />
      </div>
      <button
        type="submit"
        className="min-h-14 cursor-pointer whitespace-nowrap rounded-full bg-accent px-6 text-[16px] font-bold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
      >
        {buttonLabel}
      </button>
    </form>
  )
}
