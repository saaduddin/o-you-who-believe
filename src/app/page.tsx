import { VERSE_KEYS } from "@/lib/verse-keys";
import { getVerses } from "@/lib/qf-content-api";
import VerseCard from "@/components/VerseCard";

export default async function HomePage() {
  let verses;
  try {
    verses = await getVerses(VERSE_KEYS);
  } catch {
    verses = null;
  }

  return (
    <main className="page-container">
      <header className="page-header">
        <p className="arabic-title">يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟</p>
        <h1>O You Who Believe</h1>
        <p>
          Explore the divine addresses to the believers — 89 verses from the
          Quran where Allah directly calls upon those who have faith.
        </p>
        <span className="verse-count-badge">
          ☪ {VERSE_KEYS.length} Verses
        </span>
      </header>

      <section>
        {verses ? (
          verses.map((verse) => (
            <VerseCard
              key={verse.verse_key}
              verseKey={verse.verse_key}
              textUthmani={verse.text_uthmani}
              translation={verse.translation}
              audioUrl={verse.audio_url}
            />
          ))
        ) : (
          /* Fallback: show verse keys without API data */
          VERSE_KEYS.map((key) => (
            <div key={key} className="verse-card">
              <div className="verse-card-header">
                <div className="verse-reference">
                  <span className="verse-key-badge">{key}</span>
                </div>
              </div>
              <div className="skeleton skeleton-arabic" />
              <div className="skeleton skeleton-text wide" />
              <div className="skeleton skeleton-text medium" />
            </div>
          ))
        )}
      </section>
    </main>
  );
}
