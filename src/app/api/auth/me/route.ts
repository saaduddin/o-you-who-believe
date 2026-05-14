/**
 * Current User API
 * Returns the current user from session, or null if not logged in.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session.user || !session.accessToken) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: session.user,
  });
}
