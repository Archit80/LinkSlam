import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const cookieHeader = token ? `token=${token.value}` : "";

  try {
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