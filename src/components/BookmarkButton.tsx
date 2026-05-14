"use client";

import { useState, useCallback } from "react";

interface BookmarkButtonProps {
  verseKey: string;
  isBookmarked?: boolean;
  bookmarkId?: string;
  onToggle?: (verseKey: string, bookmarked: boolean) => void;
}

export default function BookmarkButton({
  verseKey,
  isBookmarked: initialBookmarked = false,
  bookmarkId,
  onToggle,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (bookmarked && bookmarkId) {
        // Remove bookmark
        const res = await fetch(`/api/bookmarks/${bookmarkId}`, { method: "DELETE" });
        if (res.ok) {
          setBookmarked(false);
          onToggle?.(verseKey, false);
        }
      } else {
        // Add bookmark
        const [chapter, verse] = verseKey.split(":");
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: parseInt(verse),
            mushaf_id: 1,
            type: "ayah",
            verse_number: parseInt(verse),
            chapter_number: parseInt(chapter),
          }),
        });
        if (res.ok) {
          setBookmarked(true);
          setAnimating(true);
          setTimeout(() => setAnimating(false), 300);
          onToggle?.(verseKey, true);
        } else if (res.status === 401) {
          // Not logged in — redirect to login
          window.location.href = "/api/auth/login";
          return;
        }
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [bookmarked, bookmarkId, verseKey, loading, onToggle]);

  return (
    <button
      className={`icon-btn ${bookmarked ? "bookmarked" : ""} ${animating ? "bookmark-animate" : ""}`}
      onClick={toggle}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      title={bookmarked ? "Remove bookmark" : "Bookmark this verse"}
      disabled={loading}
      id={`bookmark-btn-${verseKey}`}
    >
      {bookmarked ? "♥" : "♡"}
    </button>
  );
}
