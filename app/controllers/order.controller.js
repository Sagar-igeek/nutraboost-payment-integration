import shopifyService from "../lib/shopify"

/**
 * Handles the creation of a draft order
 */
export const createDraftOrder = async (req, res, next) => {
  try {
    const { cartOrder, customer } = req.body;

    if (!cartOrder) {
      return res.status(400).json({
        success: false,
        message: "Required data is missing",
      });
    }

    // Call the service function
    const draftOrder = await shopifyService.createDraftOrder(
      cartOrder,
      customer,
    );

    console.log(draftOrder, "draftOrder");

    // Return a clean response for the frontend
    return res.status(201).json({
      success: true,
      data: {
        id: draftOrder.id,
        name: draftOrder.name,
        totalPrice: draftOrder.total_price,
        currency: draftOrder.currency,
        invoiceUrl: draftOrder.invoice_url,
        lineItems: draftOrder.line_items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  } catch (error) {
    console.error("createDraftOrder Controller Error:", error.message);
    next(error); // Pass to global error handler
  }
};

export const completeOrder = async (req, res, next) => {
  try {
    const {
      orderId, // draft order ID from URL params
      customer, // shopify customer ID
      paymentAmount, // from URL params
      externalOrderId, // from Razorpay callback
    } = req.body;

    // ────────── Validation ──────────
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!paymentAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount is required",
      });
    }

    // ── Step 1: Complete Draft Order → converts to real order ───
    console.log(`Completing draft order: ${orderId}`);
    const completedOrder = await shopifyService.completeDraftOrder(orderId);

    const shopifyOrderId = completedOrder.order_id;

    // ── Step 2: Mark as Paid (external payment transaction) ─────
    console.log(
      `Marking order ${shopifyOrderId} as paid for customer ${customer}`,
    );
    // await shopifyService.markOrderAsPaid(
    //   shopifyOrderId,
    //   paymentAmount,
    //   externalOrderId,
    //   customer, // ← passing customer ID
    // );

    // ── Response ────────────────────────────────────────────────
    return res.status(201).json({
      success: true,
      data: {
        draftOrderId: orderId,
        orderId: shopifyOrderId,
        orderName: completedOrder.name,
        totalPrice: completedOrder.total_price,
        currency: completedOrder.currency,
        customerId: customer,
        financialStatus: "paid",
      },
    });
  } catch (error) {
    console.error("completeOrder Controller Error:", error.message);
    next(error);
  }
};

export const getOrderDetails = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    // Validation
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Get Order Details
    console.log(`getting details of ${orderId}`);
    const orderData = await shopifyService.getOrderDetail(orderId);
    console.log("orderData", orderData);
    

    // Return response object
    return {
      success: true,
      data: orderData,
    };
  } catch (error) {
    console.error("getOrderDetails Controller Error:", error);
    throw error;
  }
};

// export default {
//   createDraftOrder,
//   completeOrder,
//   getOrderDetails,
// };
