export async function GET() {
  return Response.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
}
