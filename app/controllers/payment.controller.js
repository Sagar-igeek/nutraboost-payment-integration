import shopifyService from "../lib/shopify"
const qs = require("qs");

// For S2S Card: Formula 1 from Akurateco docs
// md5( strtoupper( strrev( card_number + order_id + order_amount + order_currency + PASSWORD ) ) )
function calcSaleHash({ card_number, order_id, order_amount, order_currency }) {
  const raw =
    card_number + order_id + order_amount + order_currency + AKURATECO_PASSWORD;
  return crypto
    .createHash("md5")
    .update(raw.split("").reverse().join("").toUpperCase())
    .digest("hex");
}

const { AKURATECO_CLIENT_KEY, AKURATECO_PASSWORD, AKURATECO_PAYMENT_URL } =
  process.env;

/**
 * handle payment create
 */
// const createPayment = async (req, res, next) => {
//   try {
//     const {
//       order_id,
//       order_amount,
//       order_currency = "USD",
//       order_description,
//       brand,
//       identifier,
//       payer_first_name,
//       payer_last_name,
//       payer_email,
//       payer_ip,
//       payer_country,
//     } = req.body;

//     const hash = calcSaleHash({
//       identifier,
//       order_id,
//       order_amount,
//       order_currency,
//     });

//     const payload = {
//       action: "SALE",
//       client_key: AKURATECO_CLIENT_KEY,
//       brand, // e.g. 'your_brand' — provided by Akurateco
//       order_id,
//       order_amount,
//       order_currency,
//       order_description,
//       identifier,
//       payer_first_name,
//       payer_last_name,
//       payer_email,
//       payer_ip,
//       payer_country,
//       return_url: `${process.env.APP_URL}/payment/return`,
//       hash,
//     };

//     const { data } = await axios.post(
//       AKURATECO_PAYMENT_URL,
//       qs.stringify(payload),
//       {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       },
//     );
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const createPayment = async (req, res, next) => {
  try {
    const {
      order_id,
      order_amount,
      order_currency = "USD",
      order_description,
      // Card details
      card_number,
      card_exp_month,
      card_exp_year,
      card_cvv2,
      card_token, // optional: use saved token instead of raw card
      req_token = "N", // set "Y" to get a token back for future charges
      // Payer details
      payer_first_name,
      payer_last_name,
      payer_email,
      payer_phone,
      payer_address,
      payer_city,
      payer_zip,
      payer_country,
      payer_ip,
    } = req.body;

    // S2S Card hash: card_number + order_id + order_amount + order_currency + PASSWORD
    // (different from APM hash which uses identifier instead of card_number)
    const hash = calcSaleHash({
      card_number: card_token ? "" : card_number, // if using token, pass empty
      order_id,
      order_amount,
      order_currency,
    });

    const payload = {
      action: "SALE",
      client_key: AKURATECO_CLIENT_KEY,
      order_id,
      order_amount,
      order_currency,
      order_description,
      req_token,
      // Use card_token if provided, otherwise use raw card fields
      ...(card_token
        ? { card_token }
        : { card_number, card_exp_month, card_exp_year, card_cvv2 }),
      payer_first_name,
      payer_last_name,
      payer_email,
      payer_phone,
      payer_address,
      payer_city,
      payer_zip,
      payer_country,
      payer_ip,
      // Required for 3DS — bank redirects user back here after verification
      term_url_3ds: `${process.env.APP_URL}/payment/3ds-return`,
      hash,
    };

    const { data } = await axios.post(
      AKURATECO_PAYMENT_URL,
      qs.stringify(payload),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    // Handle all possible responses from Akurateco
    switch (data.result) {
      case "SUCCESS":
        // Payment settled immediately (no 3DS required)
        return res.json({
          success: true,
          status: data.status,
          trans_id: data.trans_id,
          card_token: data.card_token || null, // returned if req_token = "Y"
          message: "Payment successful",
        });

      case "REDIRECT":
        // 3DS verification required — send redirect info to frontend
        return res.json({
          success: false,
          requires_3ds: true,
          trans_id: data.trans_id,
          redirect_url: data.redirect_url,
          redirect_params: data.redirect_params || {},
          redirect_method: data.redirect_method || "POST",
          message: "3DS verification required",
        });

      case "DECLINED":
        return res.status(402).json({
          success: false,
          status: "DECLINED",
          trans_id: data.trans_id,
          message: data.decline_reason || "Payment declined",
        });

      case "ERROR":
        return res.status(400).json({
          success: false,
          status: "ERROR",
          message: data.error_message || "Payment error",
        });

      default:
        // UNDEFINED / ACCEPTED — async, final status comes via webhook callback
        return res.json({
          success: false,
          status: data.status,
          trans_id: data.trans_id,
          message: "Payment is being processed, await confirmation",
        });
    }
  } catch (err) {
    next(err); // pass to your error middleware
  }
};

/**
 * payment callback
 */
const paymentCallback = async (req, res, next) => {
  try {
    const params = req.body;

    // Verify callback hash (see Akurateco Appendix A - Callback signature)
    const { hash: receivedHash, ...rest } = params;

    // Sort keys alphabetically, reverse each value, concat, uppercase, append password, md5
    const sorted = Object.keys(rest).sort();
    const str = sorted
      .map((k) => String(rest[k]).split("").reverse().join(""))
      .join("");

    const expectedHash = crypto
      .createHash("md5")
      .update((str + AKURATECO_PASSWORD).toUpperCase())
      .digest("hex");

    if (expectedHash !== receivedHash) {
      console.error("Invalid callback hash!");
      return res.send("ERROR");
    }

    const { order_id, trans_id, result, status } = params;

    console.log(
      `Payment ${order_id}: result=${result}, status=${status}, trans_id=${trans_id}`,
    );

    // TODO: update your DB order status here based on result/status
    // if (result === 'SUCCESS' && status === 'SETTLED') → mark order as paid
    // if (result === 'DECLINED') → mark order as failed

    return res.send("OK");
  } catch (error) {
    console.error("Payment callback error:", error);

    // Optional: pass to Express error middleware
    // return next(error);

    return res.status(500).send("ERROR");
  }
};

module.exports = {
  createPayment,
  paymentCallback,
};
