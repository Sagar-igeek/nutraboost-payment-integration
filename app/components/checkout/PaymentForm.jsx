import { useState } from "react";
import Axios from "../../lib/Axios";

// ── Payment brand logos as inline SVGs / text badges ──────────────────────────

function VisaBadge({ small }) {
  const h = small ? "h-5" : "h-7";
  return (
    <span
      className={`inline-flex items-center justify-center ${h} px-1.5 border border-gray-300 rounded bg-white`}
    >
      <span className="text-blue-800 font-extrabold text-xs tracking-tight">
        VISA
      </span>
    </span>
  );
}

function MastercardBadge({ small }) {
  const sz = small ? "w-5 h-5" : "w-7 h-7";
  return (
    <span className={`inline-flex items-center justify-center ${sz}`}>
      <svg viewBox="0 0 38 24" className="w-full h-full">
        <circle cx="13" cy="12" r="11" fill="#EB001B" />
        <circle cx="25" cy="12" r="11" fill="#F79E1B" />
        <path d="M19 4.8a11 11 0 010 14.4A11 11 0 0119 4.8z" fill="#FF5F00" />
      </svg>
    </span>
  );
}

function AmexBadge({ small }) {
  const h = small ? "h-5" : "h-7";
  return (
    <span
      className={`inline-flex items-center justify-center ${h} px-1.5 border border-gray-300 rounded bg-blue-600`}
    >
      <span className="text-white font-bold text-xs tracking-tight">AMEX</span>
    </span>
  );
}

function DiscoverBadge() {
  return (
    <span className="inline-flex items-center justify-center h-7 px-1.5 border border-gray-300 rounded bg-white">
      <span className="text-gray-800 font-bold text-xs">DISCOVER</span>
    </span>
  );
}

function GooglePayBadge() {
  return (
    <span className="inline-flex items-center justify-center h-7 px-2 rounded bg-black">
      <span className="text-white font-medium text-xs tracking-wide">
        G Pay
      </span>
    </span>
  );
}

function ApplePayBadge() {
  return (
    <span className="inline-flex items-center justify-center h-7 px-2 rounded bg-black">
      <span className="text-white font-medium text-xs tracking-wide"> Pay</span>
    </span>
  );
}

function PayPalLogo({ size = "md" }) {
  const textSz = size === "sm" ? "text-sm" : "text-lg";
  return (
    <span className={`font-extrabold ${textSz}`}>
      <span className="text-blue-800">Pay</span>
      <span className="text-blue-400">Pal</span>
    </span>
  );
}

// ── Radio button ──────────────────────────────────────────────────────────────
function Radio({ checked }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${checked ? "border-orange-400" : "border-gray-300"}`}
    >
      {checked && <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PaymentForm({ formData, orderId, orderDetails }) {
  const [method, setMethod] = useState("card"); // "card" | "paypal"
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCard = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
  };

  const handlePayment = async () => {
    if (method === "paypal") {
      // For PayPal, you might redirect to a different endpoint or handle it via PayPal SDK
      window.alert("Redirecting to PayPal...");
      return;
    }

    // Basic Validation
    if (!cardNum || !expiry || !cvc) {
      setError("Please fill in all card details");
      return;
    }

    const expiryParts = expiry.split(" / ");
    if (expiryParts.length !== 2) {
      setError("Invalid expiry date format (MM / YY)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payloadData = {
        order_id: orderId,
        order_amount: orderDetails?.totalPrice || "0.00",
        order_currency: orderDetails?.currency || "USD",
        order_description:
          orderDetails?.lineItems?.map((item) => item.title).join(", ") ||
          "Shopify Order",
        card_number: cardNum.replace(/\s/g, ""),
        card_exp_month: expiryParts[0],
        card_exp_year: "20" + expiryParts[1], // Assuming YY format in UI
        card_cvv2: cvc,
        payer_first_name: formData.firstName,
        payer_last_name: formData.lastName,
        payer_email: formData.email,
        payer_phone: formData.phone,
        payer_address: formData.address,
        payer_city: formData.city,
        payer_zip: formData.zip,
        payer_country: formData.country,
        payer_ip: "127.0.0.1", // Ideally fetched from a service or handled by backend
      };

      const { data } = await Axios.post(`/create-payment`, payloadData);

      if (data.requires_3ds) {
        // Redirection for 3DS verification
        const form = document.createElement("form");
        form.method = data.redirect_method || "POST";
        form.action = data.redirect_url;

        Object.entries(data.redirect_params || {}).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else if (data.success) {
        // Save order ID to localStorage for the "My Orders" list
        const existingOrders = JSON.parse(
          localStorage.getItem("nutraboost_orders") || "[]",
        );
        if (!existingOrders.includes(data.trans_id)) {
          existingOrders.push(data.trans_id);
          localStorage.setItem(
            "nutraboost_orders",
            JSON.stringify(existingOrders),
          );
        }

        window.alert("Payment successful! Transaction ID: " + data.trans_id);
        // Redirect to a success/thank-you page or order details
        // window.location.href = `/order/${data.trans_id}`;
      } else {
        setError(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      const msg =
        err.response?.data?.message || "An unexpected error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-3 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition";

  return (
    <div className="bg-white w-full rounded-xl border border-gray-200 shadow-sm p-5">
      {/* Title */}
      <h2 className="font-bold text-gray-900 text-lg mb-4">
        Step 3: Payment Method
      </h2>

      {/* Options container */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        {/* ── Credit/Debit Card row ── */}
        <button
          onClick={() => setMethod("card")}
          className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <Radio checked={method === "card"} />
            <span className="font-semibold text-gray-900 text-sm">
              Credit/Debit Card
            </span>
          </div>
          <div className="flex items-center gap-1">
            <VisaBadge small />
            <MastercardBadge small />
            <AmexBadge small />
          </div>
        </button>

        {/* Card fields (shown when card selected) */}
        {method === "card" && (
          <div className="px-4 pb-4 bg-white border-t border-gray-100">
            <div className="mt-3">
              <label className="block text-xs text-gray-500 mb-1">
                Card number
              </label>
              <div className="relative">
                <input
                  className={inputCls + " pr-28"}
                  placeholder="1234 1234 1234 1234"
                  value={cardNum}
                  onChange={(e) => setCardNum(formatCard(e.target.value))}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold rounded-md px-2 py-1">
                  Autofill <span className="text-green-400">link</span>
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">
                  MM/YY
                </label>
                <input
                  className={inputCls}
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">CVC</label>
                <input
                  className={inputCls}
                  placeholder="CVC"
                  maxLength={4}
                  value={cvc}
                  onChange={(e) =>
                    setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* ── PayPal row ── */}
        <button
          onClick={() => setMethod("paypal")}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition"
        >
          <Radio checked={method === "paypal"} />
          <span className="text-blue-700 font-bold text-base">
            <span className="text-blue-900">Pay</span>
            <span className="text-blue-400">Pal</span>
          </span>
        </button>

        {/* PayPal info panel */}
        {method === "paypal" && (
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 flex flex-col items-center gap-3">
            {/* Browser/redirect icon */}
            <svg
              className="w-14 h-10 text-gray-400"
              viewBox="0 0 56 40"
              fill="none"
            >
              <rect
                x="1"
                y="1"
                width="54"
                height="38"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M1 9h54" stroke="currentColor" strokeWidth="2" />
              <circle cx="7" cy="5" r="1.5" fill="currentColor" />
              <circle cx="13" cy="5" r="1.5" fill="currentColor" />
              <circle cx="19" cy="5" r="1.5" fill="currentColor" />
              <path
                d="M38 24 L46 24 M42 20 L46 24 L42 28"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-center text-gray-600 text-sm leading-relaxed max-w-xs">
              After clicking <strong>"Complete Order"</strong>, you will be
              redirected to PayPal to complete your purchase securely.
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Complete Order button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white text-sm tracking-widest uppercase transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-gray-900"
        }`}
      >
        {loading ? "Processing..." : "Complete Order"}
      </button>

      {/* Payment icons row */}
      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
        {/* PayPal P */}
        <span className="inline-flex items-center justify-center w-9 h-7 rounded bg-white border border-gray-200">
          <span className="text-blue-700 font-extrabold text-sm">P</span>
        </span>
        <VisaBadge />
        <MastercardBadge />
        <AmexBadge />
        <DiscoverBadge />
        <GooglePayBadge />
        <ApplePayBadge />
        <PayPalLogo />
      </div>

      {/* SSL note */}
      <p className="text-center text-gray-500 text-xs mt-3">
        🔒 Secure 256-bit SSL encryption
      </p>
    </div>
  );
}
