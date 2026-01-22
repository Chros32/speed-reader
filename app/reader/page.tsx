'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import RSVPDisplay from '@/components/RSVPDisplay';
import SpeedControl from '@/components/SpeedControl';
import PlaybackControls from '@/components/PlaybackControls';
import TextInput from '@/components/TextInput';
import FontSizeControl from '@/components/FontSizeControl';
import { getRecentDocuments, saveDocument, updateDocumentProgress, deleteDocument, RecentDocument } from '@/lib/storage';

type FontSize = 'small' | 'medium' | 'large' | 'xl';

function parseTextToWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ReaderPage() {
  // State
  const [text, setText] = useState<string | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wpm, setWpm] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('large');
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Current word
  const currentWord = words[currentIndex] || '';

  // Load recent documents on mount
  useEffect(() => {
    setRecentDocs(getRecentDocuments());
  }, []);

  // Parse text into words when text changes
  useEffect(() => {
    if (text) {
      const parsedWords = parseTextToWords(text);
      setWords(parsedWords);
      setCurrentIndex(0);
      setIsPlaying(false);

      // Save to recent documents
      const doc = saveDocument(text);
      setCurrentDocId(doc.id);
      setRecentDocs(getRecentDocuments());
    }
  }, [text]);

  // Update progress periodically
  useEffect(() => {
    if (currentDocId && words.length > 0) {
      const progress = Math.round((currentIndex / words.length) * 100);
      updateDocumentProgress(currentDocId, progress);
    }
  }, [currentIndex, currentDocId, words.length]);

  // Playback interval
  useEffect(() => {
    if (isPlaying && words.length > 0) {
      const interval = 60000 / wpm;

      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, wpm, words.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (words.length > 0) {
            setIsPlaying((prev) => !prev);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setWpm((prev) => Math.min(1000, prev + 25));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setWpm((prev) => Math.max(100, prev - 25));
          break;
        case 'KeyR':
          e.preventDefault();
          setCurrentIndex(0);
          setIsPlaying(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [words.length]);

  // Handlers
  const handleTextSubmit = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (currentIndex >= words.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying((prev) => !prev);
  }, [currentIndex, words.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1));
  }, [words.length]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const handleBack = useCallback(() => {
    setText(null);
    setWords([]);
    setCurrentIndex(0);
    setCurrentDocId(null);
    setIsPlaying(false);
    setRecentDocs(getRecentDocuments());
  }, []);

  const handleDeleteDoc = useCallback((id: string) => {
    deleteDocument(id);
    setRecentDocs(getRecentDocuments());
  }, []);

  // Render input view if no text loaded
  if (!text) {
    return (
      <div className="min-h-screen">
        <Header showStartButton={false} />

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Start Reading</h1>
            <p className="text-[var(--muted)]">
              Paste text, enter a URL, or upload a file to begin
            </p>
          </div>

          <TextInput onTextSubmit={handleTextSubmit} isLoading={isLoading} />

          {/* Recent Documents */}
          {recentDocs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} />
                Recent Documents
              </h2>
              <div className="space-y-2">
                {recentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-[var(--card)] rounded-lg p-4 flex items-center justify-between group hover:bg-[var(--border)]/50 transition-colors"
                  >
                    <button
                      onClick={() => {
                        // Find the text from preview (simplified - in production you'd store full text)
                        // For now, we'll just show a message
                        alert('To re-read this document, please paste the text again. Full document storage coming in V2!');
                      }}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium truncate">{doc.title}</div>
                      <div className="text-sm text-[var(--muted)] flex items-center gap-3 mt-1">
                        <span>{doc.wordCount} words</span>
                        <span>•</span>
                        <span>{doc.progress}% complete</span>
                        <span>•</span>
                        <span>{formatTimeAgo(doc.lastRead)}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-2 text-[var(--muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Render reader view
  return (
    <div className="min-h-screen flex flex-col">
      <Header showStartButton={false} />

      {/* Reader info bar */}
      <div className="border-b border-[var(--border)] py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft size={18} />
            New Text
          </button>
          <div className="flex items-center gap-4">
            <FontSizeControl fontSize={fontSize} onFontSizeChange={setFontSize} />
            <div className="text-sm text-[var(--muted)]">
              {words.length} words • ~{Math.ceil(words.length / wpm)} min
            </div>
          </div>
        </div>
      </div>

      {/* Main reader area */}
      <main className="flex-1 flex flex-col justify-center py-8 px-4">
        <div className="space-y-8">
          {/* RSVP Display */}
          <RSVPDisplay word={currentWord} wpm={wpm} fontSize={fontSize} />

          {/* Playback Controls */}
          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onRestart={handleRestart}
            currentIndex={currentIndex}
            totalWords={words.length}
            canGoBack={currentIndex > 0}
            canGoForward={currentIndex < words.length - 1}
          />

          {/* Speed Control */}
          <SpeedControl wpm={wpm} onWpmChange={setWpm} />
        </div>
      </main>
    </div>
  );
}
