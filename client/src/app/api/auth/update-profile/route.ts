import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const apiResponse = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch (error) {
    return NextResponse.json({ message: `An internal server error occurred ${error}` }, { status: 500 });
  }
}