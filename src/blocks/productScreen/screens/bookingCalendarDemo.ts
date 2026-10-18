/**
 * Demo week shown in the booking calendar mock, copied from the real Eontyre
 * calendar (docs/reference: booking-calendar.html). Editors don't edit this.
 */

export type Source = 'admin' | 'online' | 'auto'

export type Booking =
  | {kind: 'single'; day: number; start: string; end: string; plate: string; service: string; source: Source; badge?: string}
  | {
      kind: 'group'
      day: number
      start: string
      end: string
      items: {plate: string; service: string; start: string; end: string; source: Source}[]
    }
  | {
      kind: 'detailed'
      day: number
      start: string
      end: string
      name: string
      service: string
      source: Source
      paid?: boolean
      badge?: string
    }
  | {kind: 'closedLift'; day: number; start: string; end: string; label: string}

export const demoWeek = {
  weekNumber: 40,
  range: 'Sep 28–Oct 4',
  days: [
    {weekday: 'Mon', date: 'Sep 28'},
    {weekday: 'Tue', date: 'Sep 29'},
    {weekday: 'Wed', date: 'Sep 30'},
    {weekday: 'Thu', date: 'Oct 1'},
    {weekday: 'Fri', date: 'Oct 2'},
    {weekday: 'Sat', date: 'Oct 3'},
    {weekday: 'Sun', date: 'Oct 4'},
  ],
  /** First and last time label; one row per 30 minutes. */
  firstSlot: '07:00',
  lastSlot: '14:00',
}

/** `day` is 0 for Monday. */
export const demoBookings: Booking[] = [
  {
    kind: 'group',
    day: 2,
    start: '07:00',
    end: '07:40',
    items: [
      {plate: 'BBD332', service: 'Wheel change', start: '07:00', end: '07:20', source: 'online'},
      {plate: '(Unknown)', service: 'Loose wheel', start: '07:00', end: '07:40', source: 'admin'},
    ],
  },
  {
    kind: 'single',
    day: 2,
    start: '10:00',
    end: '10:30',
    plate: 'WBJ8…',
    service: 'I have new tyres',
    source: 'online',
    badge: 'P1',
  },
  {kind: 'closedLift', day: 2, start: '11:00', end: '13:00', label: 'Closed lift · 2024 - Wheel alignment'},
  {
    kind: 'group',
    day: 4,
    start: '08:10',
    end: '09:00',
    items: [
      {plate: 'EH80724', service: 'Tyre change', start: '08:10', end: '08:30', source: 'online'},
      {plate: 'EH80724', service: 'Tyre change', start: '08:20', end: '08:40', source: 'online'},
      {plate: 'EH80724', service: 'Tyre change', start: '08:30', end: '08:50', source: 'online'},
      {plate: 'EH80724', service: 'Tyre change', start: '08:40', end: '09:00', source: 'online'},
    ],
  },
  {
    kind: 'detailed',
    day: 5,
    start: '09:30',
    end: '10:30',
    name: 'Karl',
    service: 'Wheel alignment',
    source: 'admin',
    paid: true,
    badge: 'P1',
  },
]
