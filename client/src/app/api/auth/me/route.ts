import { NextResponse } from "next/server";
import { headers } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function GET() {
  const headersList = headers();
  const cookie = headersList.get("cookie");

  if (!cookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const apiResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Cookie: cookie,
      },
    });

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch (error) {
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}