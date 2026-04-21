import { createDraftOrder } from "../../controllers/order.controller";


export async function POST(req) {
  try {
    const body = await req.json();
    const result = await createDraftOrder(body);

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}