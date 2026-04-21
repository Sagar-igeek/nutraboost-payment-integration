"use client";
import React from "react";
import TopBanner from "../components/layout/TopBanner";
import Header from "../components/layout/Header";
import CheckoutPage from "../components/checkout/CheckoutPage";
import Footer from "../components/layout/Footer";
import { useParams } from "next/navigation";

const Checkout = () => {

  const params = useParams();
  const orderId = params.orderId;
  console.log("orderId", orderId);
  
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <TopBanner />
      <Header />
      <main>
        <CheckoutPage orderId={orderId} />
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
