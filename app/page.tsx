'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, BookOpen, Upload, Link as LinkIcon, Play, Pause, Timer } from 'lucide-react';
import Header from '@/components/Header';

const DEMO_TEXT = "Speed reading is a technique that allows you to read faster while maintaining good comprehension. The RSVP method presents words one at a time at your chosen speed, eliminating eye movement and reducing subvocalization. With practice, you can dramatically increase your reading speed.";

const DEMO_WORDS = DEMO_TEXT.split(/\s+/);

// ORP calculation
function getORPIndex(word: string): number {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return Math.floor(length / 2);
  if (length <= 9) return Math.floor(length / 2) - 1;
  return Math.floor(length / 3);
}

export default function Home() {
  const router = useRouter();

  // Redirect to reader if running in native app
  useEffect(() => {
    const isNativeApp = typeof window !== 'undefined' &&
      (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();

    if (isNativeApp) {
      router.replace('/reader');
    }
  }, [router]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const wpm = 250;

  const currentWord = DEMO_WORDS[currentWordIndex] || '';
  const orpIndex = getORPIndex(currentWord);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = 60000 / wpm;
    const timer = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev >= DEMO_WORDS.length - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, wpm]);

  const toggleDemo = useCallback(() => {
    if (currentWordIndex >= DEMO_WORDS.length - 1) {
      setCurrentWordIndex(0);
    }
    setIsPlaying((prev) => !prev);
  }, [currentWordIndex]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-500 rounded-full text-sm font-medium mb-6">
            <Clock size={16} />
            Save Hours Every Week
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Time is <span className="text-primary-500">Valuable</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto">
            Cut through information overload. Read articles in minutes, not hours, with our free RSVP speed reader.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reader"
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              <BookOpen size={20} />
              Start Reading
            </Link>
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--card)] hover:bg-[var(--border)] rounded-lg font-medium transition-colors cursor-pointer"
            >
              <Play size={20} />
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 flex justify-center gap-12 md:gap-24">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-500">Save Hours</div>
            <div className="text-sm text-[var(--muted)]">Every Week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-500">Read More</div>
            <div className="text-sm text-[var(--muted)]">In Less Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-500">Stay Focused</div>
            <div className="text-sm text-[var(--muted)]">No Distractions</div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 px-4 scroll-mt-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">See How It Works</h2>
            <p className="text-[var(--muted)]">One word at a time. Maximum focus. Zero distractions.</p>
          </div>

          {/* Demo Reader */}
          <div className="bg-[var(--card)] rounded-2xl p-8 md:p-16 min-h-[250px] flex flex-col items-center justify-center relative">
            {/* Focal point guides */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-primary-500/30" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-primary-500 rounded-full" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-primary-500 rounded-full" />

            {/* Word display */}
            <div className="text-4xl md:text-6xl font-medium tracking-tight select-none">
              {currentWord ? (
                <span>
                  {currentWord.slice(0, orpIndex)}
                  <span className="text-primary-500 font-bold">{currentWord[orpIndex]}</span>
                  {currentWord.slice(orpIndex + 1)}
                </span>
              ) : (
                <span className="text-[var(--muted)]">Ready</span>
              )}
            </div>

            <div className="absolute bottom-4 right-4 text-sm text-[var(--muted)]">
              {wpm} wpm
            </div>
          </div>

          {/* Play button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={toggleDemo}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause' : 'Try It Now'}
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-[var(--card)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Simple, Powerful, Free
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload size={24} className="text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Any Content</h3>
              <p className="text-sm text-[var(--muted)]">
                Paste text, import from URLs, or upload PDF, EPUB and TXT files.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Timer size={24} className="text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Your Pace</h3>
              <p className="text-sm text-[var(--muted)]">
                Adjust from 100 to 1000+ words per minute. Start slow, build up.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <LinkIcon size={24} className="text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Works Anywhere</h3>
              <p className="text-sm text-[var(--muted)]">
                No downloads. No sign-up. Just paste and read.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Stop Wasting Time
          </h2>
          <p className="text-[var(--muted)] mb-8">
            The average person spends 2+ hours reading daily. Cut that in half.
          </p>
          <Link
            href="/reader"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium text-lg transition-colors"
          >
            <Clock size={24} />
            Start Reading Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto text-center text-sm text-[var(--muted)]">
          <p>Read Fast - Free RSVP Speed Reading</p>
        </div>
      </footer>
    </div>
  );
}
