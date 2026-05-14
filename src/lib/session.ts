/**
 * Session management using iron-session.
 * Stores OAuth2 tokens and PKCE state in encrypted httpOnly cookies.
 */

import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  // OAuth2 PKCE flow state (temporary, during login)
  oauthState?: string;
  oauthNonce?: string;
  oauthCodeVerifier?: string;

  // User tokens (after successful login)
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  tokenExpiresAt?: number;

  // User identity from id_token
  user?: {
    sub: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

const SESSION_OPTIONS = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long_for_dev_only_change_in_production",
  cookieName: "oywb_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}
