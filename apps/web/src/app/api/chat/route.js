export async function POST(request) {
  return Response.json({
    response: 'This is a test response from the chat API. The full AI chat feature is being implemented.',
    timestamp: new Date().toISOString()
  });
}
