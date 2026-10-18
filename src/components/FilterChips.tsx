'use client'

export interface Chip {
  value: string
  label: string
  count?: number
}

/** Pill buttons for filtering a list. Shared by the integration directory and the news list. */
export function FilterChips({
  chips,
  active,
  onChange,
  label,
}: {
  chips: Chip[]
  active: string
  onChange: (value: string) => void
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const on = chip.value === active
        return (
          <button
            key={chip.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(chip.value)}
            className={`cursor-pointer rounded-full border px-3.5 py-[9px] text-[15px] font-medium transition-colors duration-150 ${
              on ? 'border-accent bg-accent text-on-accent' : 'border-chip-line text-fg hover:border-fg'
            }`}
          >
            {chip.label}
            {chip.count !== undefined && <span className="ml-1.5 opacity-60">{chip.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
