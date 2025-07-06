import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

async function handler(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const path = pathname.replace("/api/", "");
  const url = `${API_BASE_URL}/${path}${search}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        "Content-Type": "application/json",
        // Forward cookies from the client to the backend
        Cookie: req.headers.get("cookie") || "",
      },
      body: req.body,
      // duplex: 'half' is required for streaming request bodies
      // @ts-ignore
      duplex: "half",
    });

    const data = await response.json();

    const res = new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Forward Set-Cookie headers from the backend to the client
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch (error) {
    console.error(`[API PROXY] ${path}`, error);
    return new NextResponse(
      JSON.stringify({ error: "An error occurred" }),
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
