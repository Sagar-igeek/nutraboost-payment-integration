const OrderNotCreated = () => {

  const handleBackToShopify = () => {
    const returnUrl = localStorage.getItem("shopifyCartUrl");

    if (returnUrl) {
      window.location.href = returnUrl;
    } else {
      // fallback (homepage)
      window.location.href = "https://abc-ltd-9947.myshopify.com";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M5 19h14c1.5 0 2.4-1.6 1.7-2.9L13.7 5c-.7-1.3-2.7-1.3-3.4 0L3.3 16.1C2.6 17.4 3.5 19 5 19z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Order not created
        </h1>

        <p className="text-gray-600 text-sm mb-6">
          Your order couldn’t be processed right now. Please try again after
          some time or contact support below.
        </p>

        <button
          onClick={handleBackToShopify}
          className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Back to Store
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Need help?{" "}
          <a
            href="mailto:support@nutraboost.com"
            className="text-gray-700 underline"
          >
            support@nutraboost.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderNotCreated;
