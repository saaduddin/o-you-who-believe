/**
 * Quran Foundation OAuth2 Configuration
 * Reads QF_CLIENT_ID, QF_CLIENT_SECRET, QF_ENV from environment variables.
 * Maps QF_ENV => { authBaseUrl, apiBaseUrl }
 */

const ENV_MAP = {
  prelive: {
    authBaseUrl: "https://prelive-oauth2.quran.foundation",
    apiBaseUrl: "https://apis-prelive.quran.foundation",
  },
  production: {
    authBaseUrl: "https://oauth2.quran.foundation",
    apiBaseUrl: "https://apis.quran.foundation",
  },
} as const;

type QfEnv = keyof typeof ENV_MAP;

export interface QfOAuthConfig {
  env: QfEnv;
  clientId: string;
  clientSecret: string;
  authBaseUrl: string;
  apiBaseUrl: string;
}

export function getQfOAuthConfig(): QfOAuthConfig {
  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;
  const env = (process.env.QF_ENV ?? "prelive") as QfEnv;

  if (!clientId) {
    throw new Error(
      "Missing Quran Foundation API credentials. Request access: https://api-docs.quran.foundation/request-access"
    );
  }

  if (!clientSecret) {
    throw new Error(
      "Missing QF_CLIENT_SECRET. Required for confidential client token exchange."
    );
  }

  if (!(env in ENV_MAP)) {
    throw new Error(`Invalid QF_ENV value: "${env}". Expected 'prelive' or 'production'.`);
  }

  const { authBaseUrl, apiBaseUrl } = ENV_MAP[env];

  return { env, clientId, clientSecret, authBaseUrl, apiBaseUrl };
}
