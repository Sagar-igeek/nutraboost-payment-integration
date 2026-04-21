import React from "react";
import { useCountdown } from "../../hooks/useCountdown";

export default function CartTimer() {
  const time = useCountdown(533); // 08:53

  return (
    <div className="flex items-center gap-2.5 border border-[#EDEDE4] rounded-[10px] p-2.5 bg-[#fbfbf6] mb-4">
      <img
        src="//img.funnelish.com/3986/26453/1653358723-discounts.svg"
        alt="discount"
        className="w-[30px] h-auto"
      />
      <div className="text-sm leading-normal">
        <span className="text-[#C8202F] font-bold">LIMITED STOCK!</span>{" "}
        <span className="text-[#0C240E]">Your cart is reserved for</span>{" "}
        <span className="text-[#C8202F] font-bold">{time}</span>
      </div>
    </div>
  );
}
