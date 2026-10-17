import {stegaClean} from 'next-sanity'

import type {ButtonData} from '@/sanity/content-types'

import {SmartLink} from './SmartLink'

export const buttonStyles = {
  primary:
    'bg-accent text-on-accent font-bold px-[26px] py-4 hover:bg-accent-hover',
  outline:
    'border border-fg text-fg font-semibold px-[22px] py-[14px] hover:bg-fg/8',
} as const

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-[16px] transition-colors duration-150 ease-in-out'

export function Button({button, className = ''}: {button: ButtonData | null | undefined; className?: string}) {
  if (!button?.label) return null
  const variant = stegaClean(button.variant) === 'outline' ? 'outline' : 'primary'

  return (
    <SmartLink link={button.link} className={`${base} ${buttonStyles[variant]} ${className}`}>
      {button.label}
    </SmartLink>
  )
}
