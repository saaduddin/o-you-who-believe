import { notFound } from "next/navigation";
import Link from "next/link";
import { VERSE_KEYS, getSurahName, getNextVerseKey, getPrevVerseKey, getChapterNumber, getVerseNumber as getVerseNum } from "@/lib/verse-keys";
import { getVerseByKey, getReflections, ReflectionPost } from "@/lib/qf-content-api";
import VerseCard from "@/components/VerseCard";

interface PageProps {
  params: Promise<{ key: string }>;
}

export default async function VerseDetailPage({ params }: PageProps) {
  const { key } = await params;
  const verseKey = key;

  // Validate verse key
  if (!VERSE_KEYS.includes(verseKey as typeof VERSE_KEYS[number])) {
    notFound();
  }

  let verse;
  try {
    verse = await getVerseByKey(verseKey);
  } catch {
    verse = null;
  }

  let reflections: ReflectionPost[] = [];
  try {
    const chapter = getChapterNumber(verseKey);
    const verseNum = parseInt(getVerseNum(verseKey));
    reflections = await getReflections(chapter, verseNum);
  } catch {
    reflections = [];
  }

  const prevKey = getPrevVerseKey(verseKey);
  const nextKey = getNextVerseKey(verseKey);
  const surahName = getSurahName(verseKey);

  return (
    <main className="page-container">
      <header className="page-header" style={{ paddingBottom: "24px" }}>
        <h1>{surahName} · {verseKey}</h1>
        <p>
          Verse {getVerseNum(verseKey)} from Surah {surahName}
        </p>
      </header>

      {verse ? (
        <VerseCard
          verseKey={verse.verse_key}
          textUthmani={verse.text_uthmani}
          translation={verse.translation}
          audioUrl={verse.audio_url}
          showAudio
          large
        />
      ) : (
        <div className="verse-card">
          <div className="verse-card-header">
            <span className="verse-key-badge">{verseKey}</span>
          </div>
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>
            Unable to load verse data. Please check your API credentials.
          </p>
        </div>
      )}

      {/* Quran Reflect Reflections */}
      {reflections && reflections.length > 0 && (
        <section className="reflections-section">
          <h2 className="reflections-title">
            <span className="icon">✦</span> Community Reflections
          </h2>
          {reflections.map((post) => (
            <div key={post.id} className="reflection-card">
              <div className="reflection-body">
                {post.body.length > 400
                  ? post.body.slice(0, 400) + "..."
                  : post.body}
              </div>
              <div className="reflection-meta">
                <span className="reflection-author">{post.author_name}</span>
                {post.likes_count > 0 && (
                  <span className="reflection-likes">
                    ♥ {post.likes_count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Navigation */}
      <div className="verse-detail-nav">
        {prevKey ? (
          <Link href={`/verse/${prevKey}`} className="verse-nav-btn">
            ← {prevKey}
          </Link>
        ) : (
          <span className="verse-nav-btn disabled">← Previous</span>
        )}
        {nextKey ? (
          <Link href={`/verse/${nextKey}`} className="verse-nav-btn">
            {nextKey} →
          </Link>
        ) : (
          <span className="verse-nav-btn disabled">Next →</span>
        )}
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return VERSE_KEYS.map((key) => ({
    key,
  }));
}
