// This file proxies requests to the backend API to avoid CORS issues
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/src/app/config/constants";

export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = await context;
    const path = params?.path?.join("/") ?? "";
    const searchParams = request.nextUrl.searchParams;
    const headers = new Headers(request.headers);

    // Keep the authorization header if it exists
    const url = `${API_URL}/v3/${path}?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from API" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const { params } = await context;
    const path = params?.path?.join("/") ?? "";
    const body = await request.json();
    const headers = new Headers(request.headers);
    headers.set("Content-Type", "application/json");

    const url = `${API_URL}/v3/${path}`;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to post to API" },
      { status: 500 }
    );
  }
}
