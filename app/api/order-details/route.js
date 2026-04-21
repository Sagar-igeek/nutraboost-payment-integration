import { getOrderDetails } from "../../controllers/order.controller";


export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://abc-ltd-9947.myshopify.com",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(req) {
  try {
    
    const result = await getOrderDetails(req);

    return Response.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "https://abc-ltd-9947.myshopify.com",
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://abc-ltd-9947.myshopify.com",
        },
      },
    );
  }
}