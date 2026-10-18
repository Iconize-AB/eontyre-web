/**
 * Demo week shown in the booking calendar mock, copied from the real Eontyre
 * calendar. Editors don't edit this.
 */

export type Source = 'admin' | 'online' | 'auto'
export type Service = 'wheelChange' | 'tyreChange' | 'looseWheel' | 'newTyres' | 'wheelAlignment'

export type Booking =
  | {kind: 'single'; day: number; start: string; end: string; plate: string | null; service: Service; source: Source; badge?: string}
  | {
      kind: 'group'
      day: number
      start: string
      end: string
      items: {plate: string | null; service: Service; start: string; end: string; source: Source}[]
    }
  | {
      kind: 'detailed'
      day: number
      start: string
      end: string
      name: string
      service: Service
      source: Source
      paid?: boolean
      badge?: string
    }
  | {kind: 'closedLift'; day: number; start: string; end: string; service: Service; year: string}

export const demoWeek = {
  weekNumber: 40,
  /** Monday to Sunday; weekday and date names are formatted in the page's language. */
  days: [
    '2026-09-28',
    '2026-09-29',
    '2026-09-30',
    '2026-10-01',
    '2026-10-02',
    '2026-10-03',
    '2026-10-04',
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
      {plate: 'BBD332', service: 'wheelChange', start: '07:00', end: '07:20', source: 'online'},
      {plate: null, service: 'looseWheel', start: '07:00', end: '07:40', source: 'admin'},
    ],
  },
  {
    kind: 'single',
    day: 2,
    start: '10:00',
    end: '10:30',
    plate: 'WBJ8…',
    service: 'newTyres',
    source: 'online',
    badge: 'P1',
  },
  {kind: 'closedLift', day: 2, start: '11:00', end: '13:00', service: 'wheelAlignment', year: '2024'},
  {
    kind: 'group',
    day: 4,
    start: '08:10',
    end: '09:00',
    items: [
      {plate: 'EH80724', service: 'tyreChange', start: '08:10', end: '08:30', source: 'online'},
      {plate: 'EH80724', service: 'tyreChange', start: '08:20', end: '08:40', source: 'online'},
      {plate: 'EH80724', service: 'tyreChange', start: '08:30', end: '08:50', source: 'online'},
      {plate: 'EH80724', service: 'tyreChange', start: '08:40', end: '09:00', source: 'online'},
    ],
  },
  {
    kind: 'detailed',
    day: 5,
    start: '09:30',
    end: '10:30',
    name: 'Karl',
    service: 'wheelAlignment',
    source: 'admin',
    paid: true,
    badge: 'P1',
  },
]
