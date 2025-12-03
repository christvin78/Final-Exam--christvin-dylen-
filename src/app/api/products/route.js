// src/app/api/products/route.js

const EXTERNAL_API_URL = "https://course.summitglobal.id/products";

async function handleRequest(request, method) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const targetUrl = id ? `${EXTERNAL_API_URL}?id=${id}` : EXTERNAL_API_URL;
  const body = method !== "GET" ? await request.json() : undefined;

  try {
    const res = await fetch(targetUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error(`Error during ${method} request to external API:`, error);
    return Response.json(
      { message: "Internal server error connecting to external API." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return handleRequest(request, "GET");
}

export async function POST(request) {
  return handleRequest(request, "POST");
}

export async function PUT(request) {
  return handleRequest(request, "PUT");
}
