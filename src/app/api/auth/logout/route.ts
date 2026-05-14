/**
 * Logout Handler
 * Clears the session and redirects to home.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSession();
  session.destroy();

  const { origin } = new URL(request.url);
  return NextResponse.redirect(new URL("/", origin));
}
