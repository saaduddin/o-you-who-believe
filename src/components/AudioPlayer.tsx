"use client";

import { useState, useRef, useCallback } from "react";

interface AudioPlayerProps {
  audioUrl: string | null;
  reciterName?: string;
}

export default function AudioPlayer({
  audioUrl,
  reciterName = "Mishary Rashid al-Afasy",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = useCallback(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  if (!audioUrl) return null;

  return (
    <div className="audio-player">
      <button
        className="audio-player-btn"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        id="audio-play-btn"
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <div>
        <div className="audio-player-label">Recitation</div>
        <div className="audio-player-reciter">{reciterName}</div>
      </div>
    </div>
  );
}
