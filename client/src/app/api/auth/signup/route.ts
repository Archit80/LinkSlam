import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const setCookieHeader = apiResponse.headers.get("Set-Cookie");
    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(responseData, { status: apiResponse.status });
    }

    const response = NextResponse.json(responseData);
    if (setCookieHeader) {
      response.headers.set("Set-Cookie", setCookieHeader);
    }
    return response;
  } catch (error) {
    console.error("Signup proxy error:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}