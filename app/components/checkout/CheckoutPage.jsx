"use client";
// import { useParams, useNavigate } from "react-router-dom";
import Axios from "../../lib/Axios";
import CartTimer from "./CartTimer";
import QuantitySelector from "./QuantitySelector";
import CustomerInfoForm from "./CustomerInfoForm";
import OrderSummary from "./OrderSummary";
import PaymentForm from "./PaymentForm";
import TrustSection from "../trust/TrustSection";
import ReviewsSection from "../reviews/ReviewsSection";
import { useEffect, useState } from "react";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

export default function CheckoutPage({orderId}) {
  // const params = useParams();
  // console.log(params);
  
  // const navigate = useNavigate();

  const [selectedProductId, setSelectedProductId] = useState(0);
  const [autoRefill, setAutoRefill] = useState(true);
  const [expedited, setExpedited] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  // const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState();

  const getOrderDetails = async () => {
    try {
      const res = await Axios.get(`/order-details?orderId=${orderId}`);
      console.log(res.data, "res");
      setOrderDetails(res.data.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  // useEffect(() => {
  //   console.log(params);
  //   setOrderId(params.orderId);
  // }, [params.orderId]);

  useEffect(() => {
    if (orderId) {
      console.log(orderId);

      getOrderDetails(orderId);
    }
  }, [orderId]);

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-6 sm:py-5 px-4">
      {/* View Order Details Button */}
      {/* {orderId && (
        <div className="max-w-[1170px] mx-auto mb-4">
          <button
            onClick={() => navigate(`/${orderId}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Full Order Details (#{orderId})
          </button>
        </div>
      )} */}
      {orderDetails && (
        <div className="max-w-[1170px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN - Steps 1 & 2 */}
          <div className="flex flex-col gap-0">
            <CartTimer />
            <QuantitySelector
              selected={selectedProductId}
              setSelected={setSelectedProductId}
              autoRefill={autoRefill}
              onToggleRefill={() => setAutoRefill(!autoRefill)}
              expedited={expedited}
              onToggleExpedited={() => setExpedited(!expedited)}
              productData={orderDetails?.line_items}
            />
            <CustomerInfoForm formData={formData} onChange={setFormData} />
          </div>

          {/* RIGHT COLUMN - Order Summary + Payment + Trust */}
          <div className="flex flex-col gap-8">
            <OrderSummary
              selectedProductId={selectedProductId}
              orderDetails={orderDetails}
              expedited={expedited}
            />
            <PaymentForm
              formData={formData}
              orderId={orderId}
              orderDetails={orderDetails}
            />
            <TrustSection />
            <ReviewsSection />
          </div>
        </div>
      )}

      {/* ORDER DETAILS SECTION - Displayed Below */}
      {orderDetails && orderDetails && (
        <div className="max-w-[1170px] mx-auto mt-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details #{orderDetails.order_number}
                </h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      orderDetails.financial_status,
                    )}`}
                  >
                    {orderDetails.financial_status?.toUpperCase()}
                  </span>
                  {orderDetails.fulfillment_status && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {orderDetails.fulfillment_status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Placed on {formatDate(orderDetails.created_at)}
              </p>
            </div>

            <div className="p-6">
              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {orderDetails.line_items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Variant: {item.variant_title}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.price)} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(
                            parseFloat(item.price) * item.quantity,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">
                      {orderDetails.email}
                    </p>
                  </div>
                  {orderDetails.customer?.phone && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <p className="font-medium text-gray-900">
                        {orderDetails.customer?.phone || "No phone number"}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Customer ID</p>
                    <p className="font-medium text-gray-900">
                      {orderDetails.customer?.id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Marketing Consent
                    </p>
                    <p className="font-medium text-gray-900 capitalize">
                      {orderDetails.customer?.email_marketing_consent?.state ||
                        "Not subscribed"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(orderDetails.subtotal_price)}
                    </span>
                  </div>
                  {orderDetails.total_discounts !== "0.00" && (
                    <div className="flex justify-between text-green-600">
                      <span>Discounts</span>
                      <span className="font-medium">
                        -{formatCurrency(orderDetails.total_discounts)}
                      </span>
                    </div>
                  )}
                  {parseFloat(
                    orderDetails.total_shipping_price_set?.shop_money?.amount ||
                      0,
                  ) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium">
                        {formatCurrency(
                          orderDetails.total_shipping_price_set.shop_money
                            .amount,
                        )}
                      </span>
                    </div>
                  )}
                  {orderDetails.total_tax !== "0.00" && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-medium">
                        {formatCurrency(orderDetails.total_tax)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(orderDetails.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Order Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium text-gray-900 truncate">
                      {orderDetails.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Confirmation #</p>
                    <p className="font-medium text-gray-900">
                      {orderDetails.confirmation_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Currency</p>
                    <p className="font-medium text-gray-900">
                      {orderDetails.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Gateway</p>
                    <p className="font-medium text-gray-900">
                      {orderDetails.payment_gateway_names?.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
