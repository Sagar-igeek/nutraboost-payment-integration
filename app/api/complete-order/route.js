import { completeOrder } from "../../controllers/order.controller";


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

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await completeOrder(body);

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