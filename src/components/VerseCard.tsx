"use client";

import Link from "next/link";
import { getSurahName, getVerseNumber } from "@/lib/verse-keys";
import BookmarkButton from "./BookmarkButton";
import AudioPlayer from "./AudioPlayer";

interface VerseCardProps {
  verseKey: string;
  textUthmani: string;
  translation: string;
  audioUrl: string | null;
  showAudio?: boolean;
  large?: boolean;
}

export default function VerseCard({
  verseKey,
  textUthmani,
  translation,
  audioUrl,
  showAudio = false,
  large = false,
}: VerseCardProps) {
  const surahName = getSurahName(verseKey);
  const verseNum = getVerseNumber(verseKey);

  // Strip HTML from translation
  const cleanTranslation = translation.replace(/<[^>]*>/g, "");

  return (
    <div className="verse-card" id={`verse-${verseKey}`}>
      <div className="verse-card-header">
        <div className="verse-reference">
          <span className="verse-key-badge">{verseKey}</span>
          <span className="verse-surah-name">
            {surahName} · Verse {verseNum}
          </span>
        </div>
        <div className="verse-actions">
          <BookmarkButton verseKey={verseKey} />
          {!large && (
            <Link
              href={`/verse/${verseKey}`}
              className="icon-btn"
              title="View details"
              id={`detail-link-${verseKey}`}
            >
              →
            </Link>
          )}
        </div>
      </div>

      <div className={`verse-arabic ${large ? "large" : ""}`}>{textUthmani}</div>

      <div className="verse-translation">{cleanTranslation}</div>

      {showAudio && <AudioPlayer audioUrl={audioUrl} />}
    </div>
  );
}
