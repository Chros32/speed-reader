'use client';

import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRestart: () => void;
  currentIndex: number;
  totalWords: number;
  canGoBack: boolean;
  canGoForward: boolean;
}

export default function PlaybackControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onRestart,
  currentIndex,
  totalWords,
  canGoBack,
  canGoForward,
}: PlaybackControlsProps) {
  const progress = totalWords > 0 ? ((currentIndex + 1) / totalWords) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--muted)]">
          <span>{currentIndex + 1} / {totalWords} words</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onRestart}
          className="p-3 rounded-full bg-[var(--border)] hover:bg-[var(--muted)]/20 transition-colors"
          aria-label="Restart"
          title="Restart (R)"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={onPrevious}
          disabled={!canGoBack}
          className="p-3 rounded-full bg-[var(--border)] hover:bg-[var(--muted)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous word"
          title="Previous (←)"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={onPlayPause}
          className="p-4 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title="Play/Pause (Space)"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>

        <button
          onClick={onNext}
          disabled={!canGoForward}
          className="p-3 rounded-full bg-[var(--border)] hover:bg-[var(--muted)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next word"
          title="Next (→)"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="flex justify-center gap-4 text-xs text-[var(--muted)]">
        <span><kbd className="px-1.5 py-0.5 bg-[var(--border)] rounded">Space</kbd> Play/Pause</span>
        <span><kbd className="px-1.5 py-0.5 bg-[var(--border)] rounded">←</kbd> <kbd className="px-1.5 py-0.5 bg-[var(--border)] rounded">→</kbd> Navigate</span>
        <span><kbd className="px-1.5 py-0.5 bg-[var(--border)] rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-[var(--border)] rounded">↓</kbd> Speed</span>
      </div>
    </div>
  );
}
