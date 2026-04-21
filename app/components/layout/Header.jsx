import React from "react";
import { LOGO_URL } from "../../utils/productData";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full bg-white px-4 py-2.5 border-b border-gray-200 mx-auto">
      <div className="max-w-[1170px] mx-auto flex items-center justify-between">
        <img
          src="////cdn.shopify.com/s/files/1/0568/0087/0463/files/nutraboost-logo.svg?v=1725915728"
          alt="NutraBoost"
          className="w-[150px] h-auto"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <h2 className="text-[#0C240E] text-lg font-bold uppercase m-0">
          Secure Checkout
        </h2>
        <div className="flex items-center gap-6">
          <Link
            href="/orders"
            className="text-[#0C240E] text-sm font-semibold hover:text-green-600 transition uppercase"
          >
            My Orders
          </Link>
          <div className="text-right">
            <h2 className="text-[#0C240E] text-lg font-bold uppercase mb-1 mt-0">
              Contact Us
            </h2>
            <p className="text-[#0C240E] text-sm m-0 font-medium">
              +1 (206) 875-2099
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
