import React from "react";
import {
  MONEY_BACK_ICON,
  SHIPPING_ICON,
  RATING_ICON,
} from "../../utils/productData";

const features = [
  {
    title: "120-Day Money Back Guarantee",
    body: "If you are not satisfied with your order, just return it within 120 days of your purchase and we will give you a full refund.",
    icon: (
      <img
        alt=""
        data-src="////cdn.shopify.com/s/files/1/0568/0087/0463/files/money-back.svg?v=1769434249"
        height="auto"
        src="////cdn.shopify.com/s/files/1/0568/0087/0463/files/money-back.svg?v=1769434249"
        width="100%"
        crossOrigin="anonymous"
        fetchPriority="high"
        loading="lazy"
      />
    ),
  },
  {
    title: "Free Shipping & Free Returns",
    body: "We offer the choice of free shipping and express shipping. If you need to return your order, we will also pay for the return shipping.",
    icon: (
      <img
        alt=""
        data-src="////cdn.shopify.com/s/files/1/0568/0087/0463/files/shipping.svg?v=1769434412"
        height="auto"
        src="////cdn.shopify.com/s/files/1/0568/0087/0463/files/shipping.svg?v=1769434412"
        width="100%"
        crossOrigin="anonymous"
        fetchPriority="high"
        loading="lazy"
      />
    ),
  },
  {
    title: "Over 100.000+ Happy Customers",
    body: "Everyone that tries the NutraBoost says it's a must-have. It has been clinically tested and researched for over 20 years, and was developed with the help of chemists and physicists.",
    icon: (
      <img
        alt=""
        data-src="////cdn.shopify.com/s/files/1/0568/0087/0463/files/customer-rating.svg?v=1769434554"
        height="auto"
        src="////cdn.shopify.com/s/files/1/0568/0087/0463/files/customer-rating.svg?v=1769434554"
        width="100%"
        crossOrigin="anonymous"
        fetchPriority="high"
        loading="lazy"
      />
    ),
  },
];
// PaymentForm

export default function TrustSection() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 font-outfit text-center mb-6">
        Why Choose NutraBoost
      </h2>

      <div className=" border-t rounded-2xl border-slate-100">
        <div className="max-w-[900px] mx-auto px-6">
          {/* 👇 Single column list */}
          <div className="flex flex-col gap-4 bg-white p-4">
            {features.map(({ title, body, icon }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="flex-shrink-0 mt-1 h-10 w-10">{icon}</div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">{title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
