import { getOrderDetails } from "../../controllers/order.controller";


export async function GET(req) {
  try {
    
    const result = await getOrderDetails(req);

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