'use client'

import {useSearchParams} from 'next/navigation'
import {useState, type FormEvent} from 'react'

import {demoPresets, demoVehicles, formatPlate, normalizePlate} from './plateSearchDemoData'

const DEFAULT_PLATE = 'ABC 123'

/**
 * Interactive webshop demo. Runs the search for `?plate=` on load, which is
 * where the plate search in the Home hero sends visitors.
 */
export function PlateSearchDemo() {
  const fromUrl = normalizePlate(useSearchParams().get('plate'))
  return <PlateSearchDemoView key={fromUrl} initialPlate={fromUrl ? formatPlate(fromUrl) : DEFAULT_PLATE} />
}

/** Rendered while search params are unavailable during prerendering. */
export function PlateSearchDemoFallback() {
  return <PlateSearchDemoView initialPlate={DEFAULT_PLATE} />
}

function PlateSearchDemoView({initialPlate}: {initialPlate: string}) {
  const [input, setInput] = useState(initialPlate)
  const [plate, setPlate] = useState(normalizePlate(initialPlate))
  const vehicle = demoVehicles[plate]

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPlate(normalizePlate(input))
  }

  function pick(label: string) {
    setInput(label)
    setPlate(normalizePlate(label))
  }

  return (
    <div className="flex flex-col gap-4 border border-hairline p-[clamp(20px,2.4vw,28px)]">
      <form onSubmit={onSubmit} className="flex flex-wrap gap-2.5">
        <div className="flex min-w-0 flex-[1_1_220px] overflow-hidden rounded-[4px] focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-accent">
          <span
            aria-hidden="true"
            className="flex w-[34px] shrink-0 items-end justify-center bg-plate pb-1.5 text-[13px] font-bold text-white"
          >
            S
          </span>
          <label htmlFor="plate-demo" className="sr-only">
            Registration number
          </label>
          <input
            id="plate-demo"
            value={input}
            onChange={(event) => setInput(formatPlate(event.target.value).slice(0, 7))}
            placeholder="ABC 123"
            maxLength={7}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-0 bg-white px-3.5 py-2.5 font-mono text-[26px] tracking-[0.08em] text-[#141414] uppercase outline-none"
          />
        </div>
        <button
          type="submit"
          className="min-h-14 cursor-pointer rounded-full bg-accent px-[22px] text-[16px] font-semibold whitespace-nowrap text-on-accent transition-colors duration-150 hover:bg-accent-hover"
        >
          Find tyres
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {demoPresets.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => pick(label)}
            className="cursor-pointer rounded-full bg-surface px-2.5 py-1.5 font-mono text-[13px] text-fg transition-colors duration-150 hover:bg-surface-hover"
          >
            {label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {vehicle ? (
          <div className="flex flex-col">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-fg py-3">
              <span className="text-[18px] font-bold">{vehicle.model}</span>
              <span className="text-[14px] text-fg-subtle">{vehicle.size}</span>
            </div>
            <ul>
              {vehicle.results.map((result) => (
                <li
                  key={`${result.brand}-${result.model}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-hairline py-3.5"
                >
                  <span className="text-[16px] font-semibold">
                    {result.brand} {result.model}
                  </span>
                  <span className="text-right text-[16px] font-bold whitespace-nowrap">{result.price}</span>
                  <span className="text-[14px] text-fg-subtle">
                    {result.source} · {result.qty} · {result.delivery}
                  </span>
                  <span className="text-right text-[13px] whitespace-nowrap text-fg-subtle">EU {result.euLabel}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-[15px] text-fg-subtle">
            No car with that registration number in the demo. Try one of the numbers above.
          </p>
        )}
      </div>
    </div>
  )
}
