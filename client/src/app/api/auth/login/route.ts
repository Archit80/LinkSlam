import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Call your actual backend on Render
    const apiResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // 2. Extract the 'Set-Cookie' header from the backend's response
    const setCookieHeader = apiResponse.headers.get("Set-Cookie");
    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(responseData, { status: apiResponse.status });
    }

    // 3. Create a new response to send to the browser
    const response = NextResponse.json(responseData);

    // 4. IMPORTANT: Copy the 'Set-Cookie' header to the browser's response
    if (setCookieHeader) {
      response.headers.set("Set-Cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}