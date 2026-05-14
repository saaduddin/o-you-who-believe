/**
 * Static list of 89 "O you who believe" verse keys.
 * Format: "chapter:verse"
 */

export const SURAH_NAMES: Record<number, string> = {
  2: "Al-Baqarah",
  3: "Ali 'Imran",
  4: "An-Nisa",
  5: "Al-Ma'idah",
  8: "Al-Anfal",
  9: "At-Tawbah",
  22: "Al-Hajj",
  24: "An-Nur",
  33: "Al-Ahzab",
  47: "Muhammad",
  49: "Al-Hujurat",
  57: "Al-Hadid",
  58: "Al-Mujadila",
  59: "Al-Hashr",
  60: "Al-Mumtahanah",
  61: "As-Saf",
  62: "Al-Jumu'ah",
  63: "Al-Munafiqun",
  64: "At-Taghabun",
  66: "At-Tahrim",
};

export const VERSE_KEYS = [
  "2:104", "2:153", "2:172", "2:178", "2:183", "2:208", "2:254", "2:264", "2:267", "2:278", "2:282",
  "3:100", "3:102", "3:118", "3:130", "3:149", "3:156", "3:200",
  "4:19", "4:29", "4:43", "4:59", "4:71", "4:94", "4:135", "4:136", "4:144",
  "5:1", "5:2", "5:6", "5:8", "5:11", "5:35", "5:51", "5:54", "5:57", "5:87", "5:90", "5:94", "5:95", "5:101", "5:105", "5:106",
  "8:15", "8:20", "8:24", "8:27", "8:29", "8:45",
  "9:23", "9:28", "9:34", "9:38", "9:119", "9:123",
  "22:77",
  "24:21", "24:27", "24:58",
  "33:9", "33:41", "33:49", "33:53", "33:56", "33:69", "33:70",
  "47:7", "47:33",
  "49:1", "49:2", "49:6", "49:11", "49:12",
  "57:28",
  "58:9", "58:11", "58:12",
  "59:18",
  "60:1", "60:10", "60:13",
  "61:2", "61:10", "61:14",
  "62:9",
  "63:9",
  "64:14",
  "66:6", "66:8",
] as const;

export function getSurahName(verseKey: string): string {
  const chapter = parseInt(verseKey.split(":")[0]);
  return SURAH_NAMES[chapter] || `Surah ${chapter}`;
}

export function getVerseNumber(verseKey: string): string {
  return verseKey.split(":")[1];
}

export function getChapterNumber(verseKey: string): number {
  return parseInt(verseKey.split(":")[0]);
}

export function getVerseIndex(verseKey: string): number {
  return VERSE_KEYS.indexOf(verseKey as typeof VERSE_KEYS[number]);
}

export function getNextVerseKey(verseKey: string): string | null {
  const idx = getVerseIndex(verseKey);
  return idx >= 0 && idx < VERSE_KEYS.length - 1 ? VERSE_KEYS[idx + 1] : null;
}

export function getPrevVerseKey(verseKey: string): string | null {
  const idx = getVerseIndex(verseKey);
  return idx > 0 ? VERSE_KEYS[idx - 1] : null;
}
