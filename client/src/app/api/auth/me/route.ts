import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Use cookies() instead of headers()

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token"); // Get the specific token cookie

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const apiResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        // Forward the cookie to the backend
        Cookie: `token=${token.value}`,
      },
    });

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch (error) {
    return NextResponse.json({ message: `An internal server error occurred ${error}`}, { status: 500 });
  }
}