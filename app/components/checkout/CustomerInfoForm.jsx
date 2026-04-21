import React from "react";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function CustomerInfoForm({ formData, onChange }) {
  const handle = (e) =>
    onChange((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const inputCls =
    "w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition";

  const selectCls =
    "w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition";

  const simpleInput =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-full">
      {/* Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Step 2: Your Information
      </h2>

      <div className="flex flex-col gap-3">
        {/* First + Last name */}
        <div className="flex gap-3">
          <input
            className={inputCls}
            name="firstName"
            value={formData.firstName}
            onChange={handle}
            placeholder="First name"
          />
          <input
            className={inputCls}
            name="lastName"
            value={formData.lastName}
            onChange={handle}
            placeholder="Last name"
          />
        </div>

        {/* Email */}
        <input
          className={inputCls}
          name="email"
          type="email"
          value={formData.email}
          onChange={handle}
          placeholder="Email address"
        />

        {/* Country dropdown */}
        <div className="relative">
          <select
            className={selectCls}
            name="country"
            value={formData.country}
            onChange={handle}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="GB">United Kingdom</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="w-4 h-4 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Address */}
        <input
          className={inputCls}
          name="address"
          value={formData.address}
          onChange={handle}
          placeholder="Address"
        />

        {/* Apartment */}
        <input
          className={inputCls}
          name="apartment"
          value={formData.apartment}
          onChange={handle}
          placeholder="Apartement, suite, etc. (optional)"
        />

        {/* City / State / ZIP */}
        <div className="flex gap-3">
          <input
            className={inputCls}
            name="city"
            value={formData.city}
            onChange={handle}
            placeholder="City"
          />
          <div className="relative w-36 flex-shrink-0">
            <select
              className={selectCls}
              name="state"
              value={formData.state}
              onChange={handle}
            >
              <option value=""></option>
              {US_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <input
            className={inputCls}
            name="zip"
            value={formData.zip}
            onChange={handle}
            placeholder="ZIP code"
          />
        </div>

        {/* Phone */}
        <input
          className={inputCls}
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handle}
          placeholder="Phone (optional)"
        />
      </div>
    </div>
  );
}
