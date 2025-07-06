import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(`${API_BASE_URL}/link/get-all`, {
      headers: {
        Cookie: req.headers.get("Cookie") || "",
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "An error occurred" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
