/**
 * Bookmarks Proxy API
 * GET: Fetch user's bookmarks
 * POST: Add a new bookmark
 * Proxies requests to Quran Foundation User APIs with proper headers.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getQfOAuthConfig } from "@/lib/qf-config";

export async function GET() {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { apiBaseUrl, clientId } = getQfOAuthConfig();

  const response = await fetch(`${apiBaseUrl}/auth/v1/bookmarks`, {
    headers: {
      "x-auth-token": session.accessToken,
      "x-client-id": clientId,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { apiBaseUrl, clientId } = getQfOAuthConfig();
  const body = await request.json();

  const response = await fetch(`${apiBaseUrl}/auth/v1/bookmarks`, {
    method: "POST",
    headers: {
      "x-auth-token": session.accessToken,
      "x-client-id": clientId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to add bookmark" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
