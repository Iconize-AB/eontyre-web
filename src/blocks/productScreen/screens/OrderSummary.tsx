/** A static order from the business system, in product colours. Demo data, not editable. */
const order = {
  number: '48213',
  vehicle: 'Volvo V60 · ABC 123',
  lines: [
    {label: '4 × Michelin Primacy 4+ 215/55 R17', price: '4 980 kr'},
    {label: 'Wheel change and balancing', price: '795 kr'},
    {label: 'Tyre hotel, one season', price: '695 kr'},
  ],
  total: '6 470 kr',
}

export function OrderSummary() {
  return (
    <div
      role="img"
      aria-label={`Example order ${order.number} in Eontyre: tyres, wheel change and tyre hotel, total ${order.total}`}
      className="border border-[#34302D] bg-white text-[#141414]"
    >
      <div aria-hidden="true">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4DFD8] px-[18px] py-3.5 text-[14px]">
          <span className="font-semibold">Order {order.number}</span>
          <span className="text-[#5C5650]">{order.vehicle}</span>
        </div>
        <div className="flex flex-col text-[14px]">
          {order.lines.map((line) => (
            <div key={line.label} className="flex justify-between gap-3 border-b border-[#EFEBE6] px-[18px] py-3">
              <span>{line.label}</span>
              <span className="font-semibold whitespace-nowrap">{line.price}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 bg-[#F5F2EE] px-[18px] py-3.5">
            <span className="font-semibold">Total incl. VAT</span>
            <span className="font-bold whitespace-nowrap">{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
