import {fill, type Dictionary} from '@/i18n/dictionaries'

/** A static order from the business system, in product colours. Demo data, not editable. */
const order = {
  number: '48213',
  vehicle: 'Volvo V60 · ABC 123',
  lines: [
    {key: 'tyres', price: 4980},
    {key: 'wheelChange', price: 795},
    {key: 'tyreHotel', price: 695},
  ] as const,
  total: 6470,
}

export function OrderSummary({dictionary}: {dictionary: Dictionary}) {
  const {order: text, plateDemo} = dictionary
  const money = (amount: number) =>
    fill(plateDemo.price, {amount: new Intl.NumberFormat(dictionary.numberLocale).format(amount)})

  return (
    <div
      role="img"
      aria-label={fill(text.ariaLabel, {number: order.number, total: money(order.total)})}
      className="border border-[#34302D] bg-white text-[#141414]"
    >
      <div aria-hidden="true">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4DFD8] px-[18px] py-3.5 text-[14px]">
          <span className="font-semibold">
            {text.title} {order.number}
          </span>
          <span className="text-[#5C5650]">{order.vehicle}</span>
        </div>
        <div className="flex flex-col text-[14px]">
          {order.lines.map((line) => (
            <div key={line.key} className="flex justify-between gap-3 border-b border-[#EFEBE6] px-[18px] py-3">
              <span>{text.lines[line.key]}</span>
              <span className="font-semibold whitespace-nowrap">{money(line.price)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 bg-[#F5F2EE] px-[18px] py-3.5">
            <span className="font-semibold">{text.totalInclVat}</span>
            <span className="font-bold whitespace-nowrap">{money(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
