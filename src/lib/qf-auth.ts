/**
 * OAuth2 PKCE + Authorization Code flow helpers.
 * Generates PKCE parameters, builds auth URLs, and exchanges codes for tokens.
 */

import crypto from "crypto";
import { getQfOAuthConfig } from "./qf-config";

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generatePkcePair() {
  const codeVerifier = base64url(crypto.randomBytes(32));
  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  const codeChallenge = base64url(hash);
  return { codeVerifier, codeChallenge };
}

export function randomString(bytes = 16): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export interface AuthUrlResult {
  url: string;
  state: string;
  nonce: string;
  codeVerifier: string;
}

export function buildAuthorizationUrl(redirectUri: string): AuthUrlResult {
  const { authBaseUrl, clientId } = getQfOAuthConfig();
  const { codeVerifier, codeChallenge } = generatePkcePair();
  const state = randomString(16);
  const nonce = randomString(16);

  const params = new URLSearchParams();
  params.set("response_type", "code");
  params.set("client_id", clientId);
  params.set("redirect_uri", redirectUri);
  params.set("scope", "openid offline_access bookmark");
  params.set("state", state);
  params.set("nonce", nonce);
  params.set("code_challenge", codeChallenge);
  params.set("code_challenge_method", "S256");

  const url = `${authBaseUrl}/oauth2/auth?${params.toString()}`;

  return { url, state, nonce, codeVerifier };
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

/**
 * Exchange authorization code for tokens (confidential client, server-side).
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const { authBaseUrl, clientId, clientSecret } = getQfOAuthConfig();

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", codeVerifier);

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${authBaseUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to exchange authorization code for tokens");
  }

  return response.json();
}

/**
 * Refresh the access token using the refresh token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const { authBaseUrl, clientId, clientSecret } = getQfOAuthConfig();

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${authBaseUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return response.json();
}
