/**
 * Content API Helpers
 * Fetches verse data, translations, and Quran Reflect posts.
 */

import { getContentToken } from "./qf-content-token";
import { getQfOAuthConfig } from "./qf-config";

export interface VerseData {
  verse_key: string;
  text_uthmani: string;
  translation: string;
  audio_url: string | null;
}

export interface ReflectionPost {
  id: number;
  body: string;
  author_name: string;
  likes_count: number;
  created_at: string;
}

/**
 * Fetch a single verse by key with Arabic text, translation, and audio.
 * Uses translation_id=203 (Al-Hilali & Khan), fallback 85 (Abdel Haleem) for prelive
 * Uses audio recitation 7 (Mishary Rashid al-Afasy)
 */
export async function getVerseByKey(verseKey: string): Promise<VerseData | null> {
  const { apiBaseUrl, clientId } = getQfOAuthConfig();
  const token = await getContentToken();

  const url = new URL(`${apiBaseUrl}/content/api/v4/verses/by_key/${verseKey}`);
  url.searchParams.set("language", "en");
  url.searchParams.set("words", "false");
  url.searchParams.set("translations", "203,85");
  url.searchParams.set("fields", "text_uthmani");
  url.searchParams.set("audio", "7");

  const response = await fetch(url.toString(), {
    headers: {
      "x-auth-token": token,
      "x-client-id": clientId,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    if (response.status === 404) {
      console.warn(`[QF Verse] Verse ${verseKey} not found in API. Skipping.`);
      return null;
    }
    const errorText = await response.text();
    console.error(`[QF Verse] Failed ${verseKey} ${response.status}:`, errorText);
    throw new Error(`Failed to fetch verse ${verseKey}: ${response.status}`);
  }

  const data = await response.json();
  const verse = data.verse;

  // Prefer Hilali & Khan (203), fallback to Abdel Haleem (85) or the first available
  const preferredTranslation =
    verse.translations?.find((t: any) => t.resource_id === 203) ||
    verse.translations?.[0];

  return {
    verse_key: verse.verse_key,
    text_uthmani: verse.text_uthmani || "",
    translation: preferredTranslation?.text || "",
    audio_url: verse.audio?.url ? `https://audio.qurancdn.com/${verse.audio.url}` : null,
  };
}

/**
 * Fetch multiple verses. Batches to avoid overwhelming the API.
 */
export async function getVerses(verseKeys: readonly string[]): Promise<VerseData[]> {
  const BATCH_SIZE = 10;
  const results: VerseData[] = [];

  for (let i = 0; i < verseKeys.length; i += BATCH_SIZE) {
    const batch = verseKeys.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(getVerseByKey));
    results.push(...batchResults.filter((v): v is VerseData => v !== null));
  }

  return results;
}

/**
 * Fetch Quran Reflect posts for a specific verse.
 * Uses the post.read scope (available via client_credentials + post.read scope).
 */
export async function getReflections(
  chapterId: number,
  verseNumber: number
): Promise<ReflectionPost[]> {
  try {
    const { apiBaseUrl, clientId } = getQfOAuthConfig();

    // Need a separate token with post.read scope
    const { authBaseUrl, clientSecret } = getQfOAuthConfig();
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResponse = await fetch(`${authBaseUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "post.read",
      }),
    });

    if (!tokenResponse.ok) {
      return [];
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    const url = new URL(`${apiBaseUrl}/quran-reflect/v1/posts/feed`);
    url.searchParams.set("filter[references][0][chapterId]", chapterId.toString());
    url.searchParams.set("filter[references][0][from]", verseNumber.toString());
    url.searchParams.set("filter[references][0][to]", verseNumber.toString());

    const response = await fetch(url.toString(), {
      headers: {
        "x-auth-token": token,
        "x-client-id": clientId,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const posts = data.posts || data.data || [];

    return posts.slice(0, 5).map((post: Record<string, unknown>) => ({
      id: post.id,
      body: (post.body as string) || (post.trimmed_body as string) || "",
      author_name: (post.author_name as string) || "Anonymous",
      likes_count: (post.likes_count as number) || 0,
      created_at: (post.created_at as string) || "",
    }));
  } catch {
    return [];
  }
}
