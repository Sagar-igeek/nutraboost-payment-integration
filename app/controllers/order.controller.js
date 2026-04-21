import shopifyService from "../lib/shopify"

/**
 * Handles the creation of a draft order
 */
export const createDraftOrder = async (body) => {
  try {
    const { cartOrder, customer } = body;

    if (!cartOrder) {
      return {
        success: false,
        message: "Required data is missing",
      };
    }

    const draftOrder = await shopifyService.createDraftOrder(
      cartOrder,
      customer,
    );

    return {
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
    };
  } catch (error) {
    console.error("createDraftOrder Controller Error:", error.message);
    throw error;
  }
};

export const completeOrder = async (body) => {
  try {
    const {
      orderId,
      customer,
      paymentAmount,
      externalOrderId,
    } = body;

    // Validation
    if (!orderId) {
      return {
        success: false,
        message: "Order ID is required",
      };
    }

    if (!paymentAmount) {
      return {
        success: false,
        message: "Payment amount is required",
      };
    }

    // Step 1: Complete Draft Order
    console.log(`Completing draft order: ${orderId}`);
    const completedOrder = await shopifyService.completeDraftOrder(orderId);

    const shopifyOrderId = completedOrder.order_id;

    // Step 2: Mark as Paid
    console.log(
      `Marking order ${shopifyOrderId} as paid for customer ${customer}`,
    );

    // await shopifyService.markOrderAsPaid(
    //   shopifyOrderId,
    //   paymentAmount,
    //   externalOrderId,
    //   customer,
    // );

    return {
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
    };
  } catch (error) {
    console.error("completeOrder Controller Error:", error.message);
    throw error;
  }
};

export const getOrderDetails = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    // Validation
    if (!orderId) {
      return {
        success: false,
        message: "Order ID is required",
      };
    }

    // Get Order Details
    console.log(`getting details of ${orderId}`);
    const orderData = await shopifyService.getOrderDetail(orderId);
    console.log("orderData", orderData);

    return {
      success: true,
      data: orderData,
    };
  } catch (error) {
    console.error("getOrderDetails Controller Error:", error.message);
    throw error;
  }
};
