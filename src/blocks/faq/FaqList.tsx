'use client'

import {useId, useState, type ReactNode} from 'react'

interface FaqListProps {
  questions: string[]
  /** Server-rendered answers, in the same order as `questions`. */
  answers: ReactNode[]
  openFirst: boolean
}

/**
 * Accordion: one answer open at a time, and clicking the open one closes it.
 * Closed answers stay in the HTML (hidden) so search engines can read them.
 */
export function FaqList({questions, answers, openFirst}: FaqListProps) {
  const [open, setOpen] = useState(openFirst ? 0 : -1)
  const id = useId()

  return (
    <ul className="flex flex-col border-b border-hairline">
      {questions.map((question, index) => {
        const isOpen = open === index
        const buttonId = `${id}-q${index}`
        const panelId = `${id}-a${index}`
        return (
          <li key={buttonId} className="border-t border-hairline">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-[22px] text-left text-[18px] font-semibold text-fg"
              >
                {question}
                <span aria-hidden="true" className="flex-none text-[24px] font-normal text-accent-text">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="max-w-[620px] pb-6">
              {answers[index]}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
