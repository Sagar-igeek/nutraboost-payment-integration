import config from "./config";
import axios from "axios";
import qs from "qs";

const BASE_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/${config.shopify.apiVersion}`;
let HEADERS = {
  "Content-Type": "application/json",
  "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
};

/**
 * Common Shopify API Request helper with retry logic
 */
const shopifyRequest = async (method, url, data = null, retry = true) => {
  try {
    const config = {
      method,
      url,
      headers: HEADERS,
    };
    if (method.toLowerCase() !== "get" && data !== null) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401 && retry) {
      console.log("401 Unauthorized detected. Attempting token refresh...");
      try {
        await accessTokenGenerate();
        console.log("Retrying request with new token...");
        return await shopifyRequest(method, url, data, false);
      } catch (refreshError) {
        console.error(
          "Token refresh failed during request:",
          refreshError.message,
        );
        throw error;
      }
    }
    console.error(
      `Shopify API Request Error (${method} ${url}):`,
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

/**
 * Generate a new access token using client credentials
 */
const accessTokenGenerate = async () => {
  try {
    let data = qs.stringify({
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    });

    let configRequest = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://${process.env.SHOPIFY_STORE}/admin/oauth/access_token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    const response = await axios.request(configRequest);
    console.log("New Access Token Generated successfully");

    const newToken = response.data.access_token;
    HEADERS["X-Shopify-Access-Token"] = newToken;
    process.env.SHOPIFY_ACCESS_TOKEN = newToken;

    return newToken;
  } catch (error) {
    console.error(
      "Error in generate access token:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

/**
 * Create a Draft Order in Shopify
 */
const createDraftOrder = async (cartOrder, customer) => {
  const endpoint = `${BASE_URL}/draft_orders.json`;

  const body = {
    draft_order: {
      line_items: cartOrder.items.map((res) => ({
        variant_id: parseInt(res.id),
        quantity: parseInt(res.quantity),
      })),
      // customer: {
      //   id: customer,
      // },
      use_customer_default_address: true,
    },
  };

  const data = await shopifyRequest("post", endpoint, body);
  return data.draft_order;
  // return "ffewgegerwerererer";
};

/**
 * Get Order's detail
 */
const getOrderDetail = async (orderId) => {
  try {
    const endpoint = `${BASE_URL}/draft_orders/${orderId}.json`;

    // const body = {
    //   draft_order: {
    //     line_items: cartOrder.items.map((res) => ({
    //       variant_id: parseInt(res.id),
    //       quantity: parseInt(res.quantity),
    //     })),
    //     // customer: {
    //     //   id: customer,
    //     // },
    //     use_customer_default_address: true,
    //   },
    // };

    const data = await shopifyRequest("get", endpoint);
    return data.draft_order;
  } catch (error) {
    console.log(error, "error");
  }
};

/**
 * Complete a Draft Order (converts to real order)
 */
const completeDraftOrder = async (draftOrderId) => {
  const endpoint = `${BASE_URL}/draft_orders/${draftOrderId}/complete.json`;
  const data = await shopifyRequest("put", endpoint, {
    payment_pending: false,
  });
  return data.draft_order;
};

/**
 * Marks an order as paid by adding an external payment transaction
 */
const markOrderAsPaid = async (
  orderId,
  amount,
  customerId,
  externalOrderId,
) => {
  const endpoint = `${BASE_URL}/orders/${orderId}/transactions.json`;
  const body = {
    transaction: {
      kind: "capture",
      status: "success",
      amount: amount,
      gateway: "external",
      authorization: externalOrderId,
      receipt: {
        customer_id: customerId,
      },
    },
  };

  const data = await shopifyRequest("post", endpoint, body);
  return data.transaction;
};

/**
 * Health check for Shopify connection
 */
const checkConnection = async () => {
  const endpoint = `${BASE_URL}/shop.json`;
  try {
    await shopifyRequest("get", endpoint);
    return true;
  } catch (error) {
    console.error("Shopify Connection Check Failed:", error.message);
    return false;
  }
};

const shopifyService = {
  createDraftOrder,
  completeDraftOrder,
  markOrderAsPaid,
  checkConnection,
  accessTokenGenerate,
  getOrderDetail,
};

export default shopifyService;
