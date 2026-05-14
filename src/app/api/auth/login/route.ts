/**
 * OAuth2 Login Initiation
 * Generates PKCE, builds auth URL, saves state in session, redirects user.
 */

import { NextResponse } from "next/server";
import { buildAuthorizationUrl } from "@/lib/qf-auth";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/callback`;

  const { url, state, nonce, codeVerifier } = buildAuthorizationUrl(redirectUri);

  // Save PKCE state in session before redirect
  const session = await getSession();
  session.oauthState = state;
  session.oauthNonce = nonce;
  session.oauthCodeVerifier = codeVerifier;
  await session.save();

  return NextResponse.redirect(url);
}
