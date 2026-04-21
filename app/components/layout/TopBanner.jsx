import React from "react";

export default function TopBanner() {
  return (
    <div className="w-full bg-[#0C240E] py-2.5 px-4">
      <div className="mx-auto text-center">
        <h2 className="text-white text-lg font-bold uppercase mb-[5px]">
          Limited New Year's Sale
        </h2>
        <p className="text-white text-[16px] m-0">
          <span className="text-[#FFF54E] font-bold">ATTENTION:</span> Coupon
          Code <strong>(T7K3nk5)</strong> Applied. Limited Inventory. Sell Out
          Risk High.
        </p>
      </div>
    </div>
  );
}
