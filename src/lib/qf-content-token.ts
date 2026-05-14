/**
 * Content API Token Manager
 * Uses OAuth2 client_credentials grant to get a token for Content APIs.
 * Caches the token in memory and refreshes before expiry.
 */

import { getQfOAuthConfig } from "./qf-config";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getContentToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const { authBaseUrl, clientId, clientSecret } = getQfOAuthConfig();

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${authBaseUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "content",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[QF Token] Failed ${response.status}:`, errorText);
    throw new Error(`Content token request failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  return cachedToken!;
}
