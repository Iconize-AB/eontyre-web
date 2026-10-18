import type {CSSProperties, ReactNode} from 'react'

import {demoBookings, demoWeek, type Booking, type Source} from './bookingCalendarDemo'

/*
 * A static picture of Eontyre's real booking calendar (week view). It copies
 * the product UI on purpose, so it uses the product's own colours rather than
 * the website's tokens. Reference: docs/reference/components/booking-calendar.html.
 */

const ROW_HEIGHT = 36
const SLOT_MINUTES = 30

const sourceColor: Record<Source, string> = {
  admin: '#141414',
  online: '#5E9E93',
  auto: '#4F7BEA',
}

const minutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const toPx = (duration: number) => (duration / SLOT_MINUTES) * ROW_HEIGHT

function slots() {
  const result: string[] = []
  for (let t = minutes(demoWeek.firstSlot); t <= minutes(demoWeek.lastSlot); t += SLOT_MINUTES) {
    result.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
  }
  return result
}

export function BookingCalendar() {
  const timeSlots = slots()
  const gridHeight = timeSlots.length * ROW_HEIGHT

  return (
    <div
      role="img"
      aria-label="Example of the Eontyre booking calendar, week view"
      // Focusable so keyboard users can scroll it sideways on small screens.
      tabIndex={0}
      className="overflow-x-auto rounded-[8px] border border-[#34302D] bg-white font-sans text-[#141414] shadow-[0_30px_60px_-40px_rgba(40,25,10,0.3)]"
    >
      <div aria-hidden="true" className="min-w-[1500px]">
        <Toolbar />
        <Legend />

        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-[#E6E6E6]">
          <span />
          {demoWeek.days.map((day, index) => {
            const tone = index === 5 ? 'saturday' : index === 6 ? 'sunday' : 'weekday'
            return (
              <div
                key={day.date}
                className={`flex flex-col gap-0.5 border-l border-[#E6E6E6] px-3 py-2.5 ${
                  tone === 'saturday'
                    ? 'bg-[#FFF3F1] text-[#D9452B]'
                    : tone === 'sunday'
                      ? 'bg-[#F7F7F7] text-[#6B6B6B]'
                      : 'bg-white text-[#141414]'
                }`}
              >
                <span className="text-[13px]">{day.weekday}</span>
                <span className="text-[15px] font-semibold">{day.date}</span>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
          <div className="flex flex-col">
            {timeSlots.map((slot) => (
              <span key={slot} className="block h-9 pt-0.5 pl-2.5 text-[11px] text-[#6B6B6B]">
                {slot}
              </span>
            ))}
          </div>
          {demoWeek.days.map((day, index) => (
            <div
              key={day.date}
              className={`relative border-l border-[#E6E6E6] ${index >= 5 ? 'bg-[#F7F7F7]' : 'bg-white'}`}
              style={{
                height: gridHeight,
                backgroundImage: `repeating-linear-gradient(180deg, transparent 0 ${ROW_HEIGHT - 1}px, #ECECEC ${ROW_HEIGHT - 1}px ${ROW_HEIGHT}px)`,
              }}
            >
              {demoBookings
                .filter((booking) => booking.day === index)
                .map((booking) => (
                  <BookingCard key={`${booking.kind}-${booking.start}`} booking={booking} />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BookingCard({booking}: {booking: Booking}) {
  const top = toPx(minutes(booking.start) - minutes(demoWeek.firstSlot))
  const height = toPx(minutes(booking.end) - minutes(booking.start))
  const position: CSSProperties = {top}

  switch (booking.kind) {
    case 'single':
      return (
        <div
          className="absolute inset-x-1 flex items-center gap-1.5 overflow-hidden bg-white px-2 text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
          // 2px shorter than the slot so back-to-back bookings don't touch.
          style={{...position, height: height - 2, borderLeft: `3px solid ${sourceColor[booking.source]}`}}
        >
          <b className="text-[12px] whitespace-nowrap">{booking.plate}</b>
          <span className="min-w-0 flex-1 truncate text-[#6B6B6B]">{booking.service}</span>
          <span className="flex-none text-[11px] whitespace-nowrap text-[#6B6B6B]">
            {booking.start}–{booking.end}
          </span>
          {booking.badge && <Badge>{booking.badge}</Badge>}
        </div>
      )

    case 'group':
      return (
        <div
          className="absolute inset-x-1 z-[1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
          style={{...position, borderLeft: `3px solid ${sourceColor[booking.items[0]?.source ?? 'admin']}`}}
        >
          <div className="truncate border-b border-[#EFEFEF] bg-[#F7F7F7] px-2.5 py-[5px] text-[11px] text-[#4A4A4A]">
            [{booking.items.length} bookings] · {booking.start}–{booking.end}
          </div>
          {booking.items.map((item, index) => (
            <div key={index} className="ml-1.5" style={{borderLeft: `3px solid ${sourceColor[item.source]}`}}>
              <div className="flex h-[30px] items-center gap-1.5 overflow-hidden border-b border-[#EFEFEF] px-2 text-[12px]">
                <SourceIcon source={item.source} />
                <b className="text-[13px] whitespace-nowrap">{item.plate}</b>
                <span className="min-w-0 flex-1 truncate text-[#6B6B6B]">{item.service}</span>
                <span className="flex-none text-[11px] whitespace-nowrap text-[#6B6B6B]">
                  {item.start}–{item.end}
                </span>
              </div>
            </div>
          ))}
        </div>
      )

    case 'detailed':
      return (
        <div
          className="absolute inset-x-1 flex flex-col bg-white px-2 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
          style={{...position, height, borderLeft: `3px solid ${sourceColor[booking.source]}`}}
        >
          <div className="flex justify-between gap-1.5">
            <b className="text-[13px]">{booking.name}</b>
            <span className="text-[10px] text-[#6B6B6B]">
              {booking.start}–{booking.end}
            </span>
          </div>
          <span className="text-[11px] text-[#4A4A4A]">{booking.service}</span>
          <div className="mt-auto flex items-center gap-1.5">
            <Icon stroke="#2E9E5B" width={1.4}>
              <circle cx="8" cy="8" r="6.2" />
              <path d="M5.3 8.2l1.8 1.8 3.6-3.8" />
            </Icon>
            {booking.paid && (
              <Icon stroke="#8A8A8A">
                <rect x="2" y="4" width="12" height="8" rx="1.5" />
                <path d="M2 7h12" />
              </Icon>
            )}
            {booking.badge && <Badge>{booking.badge}</Badge>}
          </div>
        </div>
      )

    case 'closedLift':
      return (
        <div
          className="absolute inset-x-1 flex flex-col gap-[3px] rounded-[4px] border border-dashed border-[#E7C76A] bg-[#FEF7DC] p-2.5"
          style={{...position, height}}
        >
          <span className="flex items-center gap-1.5 overflow-hidden text-[12px] whitespace-nowrap text-[#C46A0A]">
            <LockIcon stroke="#C46A0A" size={12} />
            <span className="min-w-0 truncate">{booking.label}</span>
          </span>
          <span className="text-[14px] font-semibold">Closed</span>
          <span className="text-[11px] text-[#6B6B6B]">
            {booking.start}–{booking.end}
          </span>
        </div>
      )
  }
}

function Toolbar() {
  const control =
    'flex h-[38px] items-center gap-2 whitespace-nowrap rounded-[6px] border border-[#E2E2E2] bg-white px-3.5 text-[14px] font-medium'

  return (
    <div className="flex items-center gap-2.5 border-b border-[#EAEAEA] px-4 py-3">
      <div className="flex gap-0.5 rounded-[6px] border border-[#E2E2E2] p-0.5 text-[14px] font-medium">
        <span className="px-3 py-[7px]">Day</span>
        <span className="rounded-[4px] bg-[#141414] px-3 py-[7px] text-white">Week</span>
        <span className="px-3 py-[7px]">Month</span>
      </div>
      <span className={control}>
        <Icon size={15} width={1.4}>
          <circle cx="8" cy="8" r="6.2" />
          <path d="M8 4.5V8l2.3 1.5" />
        </Icon>
        Jump to today
      </span>
      <span className="px-1 text-[18px]">‹</span>
      <span className={`${control} gap-2.5`}>
        <b>Week {demoWeek.weekNumber}</b>
        <span className="font-normal text-[#6B6B6B]">{demoWeek.range}</span>
      </span>
      <span className="px-1 text-[18px]">›</span>
      <span className={`${control} min-w-[170px] justify-between`}>
        Calendar<span className="text-[#6B6B6B]">⌄</span>
      </span>
      <span className="flex-1" />
      <span className={control}>
        <Icon size={15} width={1.4}>
          <path d="M2.5 4h11M4.5 8h7M6.5 12h3" />
        </Icon>
        Filter
      </span>
      <span className={control}>
        <Icon size={15} width={1.4}>
          <rect x="2" y="2.5" width="12" height="8.5" rx="1.2" />
          <path d="M6 14h4M8 11v3" />
        </Icon>
        Display settings
      </span>
      <span className="flex size-[30px] items-center justify-center rounded-full border-[1.4px] border-[#141414] text-[14px] font-semibold">
        ?
      </span>
      <span className="flex h-[38px] items-center gap-2 whitespace-nowrap rounded-[6px] bg-[#E2531C] px-4 text-[14px] font-semibold text-white">
        <LockIcon stroke="#FFFFFF" size={14} />
        Close lift
      </span>
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-[18px] border-b border-[#EAEAEA] px-4 py-2.5 text-[13px]">
      <span className="text-[12px] tracking-[0.04em] text-[#6B6B6B]">BOOKING COLOURS</span>
      <LegendItem color={sourceColor.admin} icon={<SourceIcon source="admin" />}>
        Admin
      </LegendItem>
      <LegendItem color={sourceColor.online} icon={<SourceIcon source="online" />}>
        Online
      </LegendItem>
      <LegendItem color={sourceColor.auto}>Auto-booking</LegendItem>
      <span className="block h-[18px] w-px bg-[#E2E2E2]" />
      <span className="text-[#6B6B6B]">Auto-booking status</span>
      <span className="text-[#2F6FE0]">Sent</span>
      <span className="text-[#2E9E5B]">Accepted</span>
      <span className="text-[#D93A2B]">Declined</span>
    </div>
  )
}

function LegendItem({color, icon, children}: {color: string; icon?: ReactNode; children: ReactNode}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="block size-[11px] rounded-[2px]" style={{background: color}} />
      {icon}
      {children}
    </span>
  )
}

function SourceIcon({source}: {source: Source}) {
  if (source === 'admin') {
    return (
      <Icon size={14} stroke={sourceColor.admin} width={1.3}>
        <circle cx="6" cy="5.5" r="2.5" />
        <path d="M1.5 13.5c.6-2.4 2.3-3.6 4.5-3.6s3.9 1.2 4.5 3.6" />
      </Icon>
    )
  }
  if (source === 'online') {
    return (
      <Icon size={14} stroke={sourceColor.online} width={1.3}>
        <circle cx="8" cy="8" r="6.2" />
        <path d="M1.8 8h12.4M8 1.8c2 2 2 10.4 0 12.4M8 1.8c-2 2-2 10.4 0 12.4" />
      </Icon>
    )
  }
  return null
}

function LockIcon({stroke, size}: {stroke: string; size: number}) {
  return (
    <Icon size={size} stroke={stroke} width={1.5}>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </Icon>
  )
}

function Icon({
  children,
  size = 14,
  stroke = '#141414',
  width = 1.3,
}: {
  children: ReactNode
  size?: number
  stroke?: string
  width?: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={width} className="flex-none">
      {children}
    </svg>
  )
}

function Badge({children}: {children: ReactNode}) {
  return (
    <span className="flex-none rounded-[3px] bg-[#141414] px-[5px] py-0.5 text-[10px] font-semibold text-white">
      {children}
    </span>
  )
}
