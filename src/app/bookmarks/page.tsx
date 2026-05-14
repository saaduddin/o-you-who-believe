"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSurahName, getVerseNumber } from "@/lib/verse-keys";

interface Bookmark {
  id: string;
  verse_key?: string;
  chapter_number?: number;
  verse_number?: number;
  key?: number;
  type?: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Check if user is logged in
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();

        if (!meData.user) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        // Fetch bookmarks
        const bmRes = await fetch("/api/bookmarks");
        if (bmRes.ok) {
          const bmData = await bmRes.json();
          const items = bmData.data || bmData.bookmarks || bmData || [];
          setBookmarks(Array.isArray(items) ? items : []);
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const removeBookmark = async (id: string) => {
    const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const getVerseKey = (bm: Bookmark): string => {
    if (bm.verse_key) return bm.verse_key;
    if (bm.chapter_number && (bm.verse_number || bm.key)) {
      return `${bm.chapter_number}:${bm.verse_number || bm.key}`;
    }
    return "Unknown";
  };

  return (
    <main className="page-container">
      <header className="page-header">
        <h1>Your Bookmarks</h1>
        <p>Verses you&apos;ve saved from the &quot;O you who believe&quot; collection.</p>
      </header>

      {loading ? (
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="verse-card">
              <div className="skeleton skeleton-text short" />
              <div className="skeleton skeleton-arabic" />
              <div className="skeleton skeleton-text wide" />
            </div>
          ))}
        </div>
      ) : !isLoggedIn ? (
        <div className="signin-prompt">
          <p>Sign in with your Quran.com account to view and manage your bookmarks.</p>
          <a href="/api/auth/login">Sign In to Continue</a>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bookmarks-empty">
          <div className="icon">♡</div>
          <p>No bookmarks yet</p>
          <p className="hint">
            Tap the heart icon on any verse to save it here.
          </p>
          <Link
            href="/"
            className="verse-nav-btn"
            style={{ marginTop: "24px", display: "inline-flex" }}
          >
            Browse Verses →
          </Link>
        </div>
      ) : (
        <section>
          {bookmarks.map((bm) => {
            const vk = getVerseKey(bm);
            return (
              <div key={bm.id} className="verse-card">
                <div className="verse-card-header">
                  <div className="verse-reference">
                    <span className="verse-key-badge">{vk}</span>
                    <span className="verse-surah-name">
                      {getSurahName(vk)} · Verse {getVerseNumber(vk)}
                    </span>
                  </div>
                  <div className="verse-actions">
                    <button
                      className="icon-btn bookmarked"
                      onClick={() => removeBookmark(bm.id)}
                      title="Remove bookmark"
                    >
                      ♥
                    </button>
                    <Link
                      href={`/verse/${vk}`}
                      className="icon-btn"
                      title="View verse"
                    >
                      →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
