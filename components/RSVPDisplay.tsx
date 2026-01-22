'use client';

import { useMemo } from 'react';

interface RSVPDisplayProps {
  word: string;
  wpm: number;
}

// Calculate Optimal Recognition Point (ORP) - where the eye naturally focuses
function getORPIndex(word: string): number {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return Math.floor(length / 2);
  if (length <= 9) return Math.floor(length / 2) - 1;
  if (length <= 13) return Math.floor(length / 3);
  return Math.floor(length / 4);
}

export default function RSVPDisplay({ word, wpm }: RSVPDisplayProps) {
  const { before, focal, after } = useMemo(() => {
    if (!word) {
      return { before: '', focal: '', after: '' };
    }

    const orpIndex = getORPIndex(word);
    return {
      before: word.slice(0, orpIndex),
      focal: word[orpIndex] || '',
      after: word.slice(orpIndex + 1),
    };
  }, [word]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Reader container */}
      <div className="bg-[var(--card)] rounded-2xl p-8 md:p-16 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Focal point guide lines */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-primary-500/30" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-primary-500 rounded-full" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-primary-500 rounded-full" />

        {/* Word display */}
        <div className="flex items-center justify-center text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight select-none">
          {word ? (
            <>
              <span className="text-right min-w-[200px] md:min-w-[300px]">{before}</span>
              <span className="text-primary-500 font-bold">{focal}</span>
              <span className="text-left min-w-[200px] md:min-w-[300px]">{after}</span>
            </>
          ) : (
            <span className="text-[var(--muted)]">Ready</span>
          )}
        </div>

        {/* WPM indicator */}
        <div className="absolute bottom-4 right-4 text-sm text-[var(--muted)]">
          {wpm} wpm
        </div>
      </div>
    </div>
  );
}
