/**
 * OAuth2 Callback Handler
 * Validates state, exchanges code for tokens, stores in session.
 */

import { NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/qf-auth";
import { getSession } from "@/lib/session";

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return {};
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const session = await getSession();

  // Validate state (CSRF protection)
  if (!state || state !== session.oauthState) {
    return NextResponse.redirect(new URL("/?error=invalid_state", url.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", url.origin));
  }

  const codeVerifier = session.oauthCodeVerifier;
  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/?error=no_verifier", url.origin));
  }

  // Clear PKCE state
  delete session.oauthState;
  delete session.oauthNonce;
  delete session.oauthCodeVerifier;

  try {
    const redirectUri = `${url.origin}/api/auth/callback`;
    const tokens = await exchangeCodeForTokens(code, redirectUri, codeVerifier);

    // Store tokens in session
    session.accessToken = tokens.access_token;
    session.refreshToken = tokens.refresh_token;
    session.idToken = tokens.id_token;
    session.tokenExpiresAt = Date.now() + tokens.expires_in * 1000;

    // Decode id_token for user identity
    if (tokens.id_token) {
      const claims = decodeJwtPayload(tokens.id_token);
      session.user = {
        sub: claims.sub as string,
        email: claims.email as string | undefined,
        first_name: claims.first_name as string | undefined,
        last_name: claims.last_name as string | undefined,
      };
    }

    await session.save();

    return NextResponse.redirect(new URL("/", url.origin));
  } catch {
    return NextResponse.redirect(new URL("/?error=token_exchange_failed", url.origin));
  }
}
