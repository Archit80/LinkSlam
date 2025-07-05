import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    // Pass along the original request's cookies to the backend
    const cookieHeader = request.headers.get("Cookie") || "";

    const apiResponse = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
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
    console.error("Logout proxy error:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}