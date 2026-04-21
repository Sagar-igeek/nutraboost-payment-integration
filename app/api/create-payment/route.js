import { createPayment } from "../../controllers/payment.controller";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await createPayment(body);

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
