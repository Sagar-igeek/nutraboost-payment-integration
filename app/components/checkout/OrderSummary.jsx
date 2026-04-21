import { useEffect, useState } from "react";

export default function OrderSummary({
  orderDetails,
  selectedProductId,
  expedited,
}) {
  const [open, setOpen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState();

  // Calculate totals based on order details
  const calculateSubtotal = () => {
    if (!orderDetails || !orderDetails.line_items) return "$0.00";
    const total = orderDetails.line_items.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: orderDetails.currency || "USD",
    }).format(total);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal().replace(/[^0-9.-]+/g, ""));
    const shipping = expedited ? 9.97 : 0;
    const total = subtotal + shipping;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: orderDetails?.currency || "USD",
    }).format(total);
  };

  const getProductTitle = () => {
    if (
      !orderDetails ||
      !orderDetails.line_items ||
      orderDetails.line_items.length === 0
    ) {
      return "Product";
    }
    return (
      orderDetails.line_items[0].name ||
      orderDetails.line_items[0].title ||
      "Product"
    );
  };

  const getProductQuantity = () => {
    if (
      !orderDetails ||
      !orderDetails.line_items ||
      orderDetails.line_items.length === 0
    ) {
      return 1;
    }
    return orderDetails.line_items[0].quantity || 1;
  };

  useEffect(() => {
    console.log(orderDetails, "orderDetails");
    if (selectedProductId && orderDetails && orderDetails.line_items) {
      const order = orderDetails.line_items.find(
        (res) => res.id === selectedProductId,
      );
      setSelectedProduct(order);
    }
  }, [selectedProductId]);

  return (
    <div className="bg-white w-full rounded-xl border border-gray-200 shadow-sm p-5">
      {/* Title */}
      <h2 className="font-bold text-gray-900 text-lg mb-3">Order Summary</h2>

      {/* Toggle row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-gray-700 text-sm hover:text-gray-900 transition"
        >
          {/* Cart icon */}
          <svg
            className="w-5 h-5 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span>{open ? "Hide" : "Show"} order summary</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-0" : "rotate-180"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="font-semibold text-gray-900 text-sm">
          {calculateTotal()}
        </span>
      </div>

      {/* Expandable content */}
      {open && (
        <>
          {/* Column headers */}
          <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 pt-3 pb-2">
            <span>Product</span>
            <span>Price</span>
          </div>

          {/* Product row */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {/* Product image placeholder */}
              <div className="relative shrink-0">
                <div className="w-12 h-14 bg-green-100 rounded border border-gray-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-8 text-green-600"
                    viewBox="0 0 24 32"
                    fill="currentColor"
                  >
                    <rect
                      x="6"
                      y="0"
                      width="12"
                      height="3"
                      rx="1.5"
                      fill="currentColor"
                    />
                    <rect
                      x="4"
                      y="3"
                      width="16"
                      height="26"
                      rx="3"
                      fill="currentColor"
                      opacity="0.2"
                    />
                    <rect
                      x="4"
                      y="3"
                      width="16"
                      height="26"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <rect
                      x="7"
                      y="8"
                      width="10"
                      height="1.5"
                      rx="0.75"
                      fill="currentColor"
                    />
                    <rect
                      x="7"
                      y="12"
                      width="8"
                      height="1.5"
                      rx="0.75"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                {/* Quantity badge */}
                <span className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-xs font-bold rounded px-1 py-0.5 leading-none">
                  x{selectedProduct?.quantity}
                </span>
              </div>

              <div>
                <p className="font-bold text-gray-900 text-sm">
                  {getProductTitle()}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {selectedProduct?.variant_title || "Standard"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-gray-900 text-sm">
                {orderDetails?.line_items?.[0]?.price
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: orderDetails.currency || "USD",
                    }).format(parseFloat(orderDetails.line_items[0].price))
                  : "$0.00"}
              </p>
              <p className="text-gray-500 text-xs">per unit</p>
            </div>
          </div>

          {/* Expedited Shipping */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 text-sm">Expedited Shipping</span>
            <span className="text-gray-900 text-sm">$9.97</span>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-3">
            <span className="text-gray-700 text-sm">Total</span>
            <span className="font-semibold text-gray-900 text-sm">
              {calculateTotal()}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
