require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  shopify: {
    store: process.env.SHOPIFY_STORE,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    apiVersion: "2026-01", // Standardizing on a recent API version
  },
};

// Validation
if (!config.shopify.store || !config.shopify.accessToken) {
  console.warn(
    "WARNING: SHOPIFY_STORE or SHOPIFY_ACCESS_TOKEN is not defined in .env",
  );
}

module.exports = config;
