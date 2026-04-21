import React from "react";

const options = [
  {
    id: 0,
    badge: null,
    title: "1x Anti-Fungal Gel",
    subtitle: "Kills fungus on contact",
    price: "$35.97",
    priceNote: "+ $5 shipping",
    highlight: false,
  },
  {
    id: 1,
    badge: { label: "LIMITED OFFER", color: "bg-[#C8202F] text-white" },
    title: "Buy 1 Get 1 50% OFF",
    subtitle: "2x Anti-Fungal Gel",
    price: "$26.97",
    priceNote: "per bottle",
    highlight: false,
    tag: "50%",
    tagColor: "bg-[#C8202F]",
  },
  {
    id: 2,
    badge: { label: "BEST VALUE", color: "bg-[#1a5c2e] text-white" },
    title: "Buy 2 Get 2 FREE",
    subtitle: "4x Anti-Fungal Gel",
    price: "$17.97",
    priceNote: "per bottle",
    highlight: true,
    tag: "FREE",
    tagColor: "bg-[#1a5c2e]",
  },
];

// Fallback bottle SVG if images don't load
const BottleIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#aaa"
    strokeWidth="1.5"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="13" y2="14" />
  </svg>
);

export default function QuantitySelector({
  selected,
  setSelected,
  autoRefill,
  onToggleRefill,
  expedited,
  onToggleExpedited,
  productData,
}) {
  console.log(productData, "productData");

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Step Header */}

      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.05),0_8px_10px_-6px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-black font-outfit">
            Step 1: Select Order Quantity
          </h2>
        </div>
        {/* Auto-refill */}
        <label
          className="flex items-center gap-3 bg-white p-2.5 border border-amber-100 mb-6 cursor-pointer"
          onClick={onToggleRefill}
        >
          <input
            type="checkbox"
            checked={autoRefill}
            onChange={onToggleRefill}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-[#0c240e] text-sm">
            Save 25% With Automatic Refills!
          </span>
        </label>

        {/* Product rows */}
        <div className="flex flex-col gap-2.5 p-1">
          {productData.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`relative flex items-center gap-3.5 rounded-sm border p-3 cursor-pointer transition-all duration-150
              ${
                isSelected
                  ? "border-[#2d6a3f] bg-[#f4faf6]"
                  : "border-gray-200 bg-white"
              }`}
              >
                {opt.badge && (
                  <span
                    className={`absolute top-0 right-0 text-[10px] font-semibold px-2 py-0.5 rounded-bl-lg uppercase tracking-wide ${opt.badge.color}`}
                  >
                    {opt.badge.label}
                  </span>
                )}

                {/* Image placeholder */}
                <div className="relative w-[52px] h-[52px] bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <BottleIcon />
                  {opt.tag && (
                    <span
                      className={`absolute -bottom-1 -right-1 text-white text-[9px] font-bold px-1 py-0.5 rounded ${opt.tagColor}`}
                    >
                      {opt.tag}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0c240e] m-0">
                    {opt.name}
                  </p>
                  <p className="text-xs text-gray-500 m-0 mt-0.5">
                    {opt.title}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <span className="block text-[15px] font-semibold text-[#0c240e]">
                    {opt.price_set?.shop_money?.amount}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {opt.priceNote}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stock warning */}
        <div className="flex justify-center items-center gap-3 p-3  mt-6">
          <div className="relative flex items-center justify-center ml-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping absolute" />
            <div className="w-2 h-2 rounded-full bg-blue-500 relative" />
          </div>
          <span className="text-xs font-black uppercase tracking-wide text-slate-600">
            Order now... only 12 bottles left in stock
          </span>
        </div>
      </div>
      <div
        onClick={onToggleExpedited}
        className="cursor-pointer w-full bg-green-50 border-2 border-dashed border-teal-400 rounded-lg p-4 flex items-start gap-3 select-none"
      >
        {/* Checkbox */}
        <div className="mt-0.5 shrink-0">
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors duration-200 ${
              expedited
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-400"
            }`}
          >
            {expedited && (
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="font-bold text-gray-900 text-sm leading-snug mb-1">
            Yes, I Want Expedited Shipping
          </p>
          <p className="text-gray-700 text-sm leading-snug">
            <span className="underline">
              Exclusive shipping and tracking service
            </span>{" "}
            with delivery time up to 3-6 business days. Only $9.97!
          </p>
        </div>
      </div>
      {/* <div
        className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
          expedited
            ? "border-green-500 border-dashed bg-green-50/30 shadow-[0_15px_25px_-10px_rgba(59,130,246,0.1)]"
            : "border-slate-100 bg-white hover:border-slate-200"
        }`}
        onClick={onToggleExpedited}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex items-center justify-center shrink-0 border-2 transition-all duration-300 w-6 h-6 rounded-lg ${
              expedited
                ? "bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "bg-white border-slate-200"
            }`}
          >
            {expedited && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          <div>
            <p className="text-lg font-black uppercase tracking-wider text-slate-900 font-outfit mb-1">
              Yes, I Want Expedited Shipping
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed uppercase tracking-tight">
              <span className="text-green-600 font-black border-b-2 border-green-100">
                Exclusive priority fulfillment
              </span>{" "}
              service with direct tracking. Guaranteed delivery in 3-6 business
              days.{" "}
              <span className="text-slate-900 font-black">
                Just $9.97 extra!
              </span>
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
