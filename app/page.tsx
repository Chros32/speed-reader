'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, BookOpen, Upload, Link as LinkIcon, Play, Pause, Timer, Check, X, ChevronDown, Music, Zap, Shield, Star } from 'lucide-react';
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

      {/* Hero Section with Inline Demo */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-500 rounded-full text-sm font-medium mb-6">
            <Clock size={16} />
            Save Hours Every Week
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Time is <span className="text-primary-500">Valuable</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--muted)] mb-10 max-w-2xl mx-auto">
            Cut through information overload. Read articles in minutes, not hours, with our free RSVP speed reader.
          </p>

          {/* Inline RSVP Demo */}
          <div className="bg-[var(--card)] rounded-2xl p-8 md:p-12 min-h-[200px] flex flex-col items-center justify-center relative max-w-2xl mx-auto mb-6">
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

          {/* Demo controls + CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={toggleDemo}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause Demo' : 'Try It Now'}
            </button>
            <Link
              href="/reader"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--card)] hover:bg-[var(--border)] rounded-lg font-medium transition-colors"
            >
              <BookOpen size={20} />
              Paste Your Own Text
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-8 border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 flex justify-center gap-12 md:gap-24">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-500">500+</div>
            <div className="text-sm text-[var(--muted)]">Readers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-500">1M+</div>
            <div className="text-sm text-[var(--muted)]">Words Read</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold text-primary-500">
              4.8
              <Star size={24} className="fill-primary-500" />
            </div>
            <div className="text-sm text-[var(--muted)]">User Rating</div>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Simple Pricing
          </h2>
          <p className="text-center text-[var(--muted)] mb-12">
            Start free, upgrade when you need more
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Free Plan */}
            <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-[var(--muted)]">forever</span>
              </div>
              <p className="text-sm text-[var(--muted)] mb-6">Perfect for trying it out</p>

              <Link
                href="/reader"
                className="block w-full py-3 text-center bg-[var(--border)] hover:bg-[var(--muted)]/20 rounded-lg font-medium transition-colors mb-6"
              >
                Get Started
              </Link>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span>Up to 400 WPM</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span>3 documents/day</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span>Paste text & URLs</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <X size={16} className="flex-shrink-0" />
                  <span>File uploads</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <X size={16} className="flex-shrink-0" />
                  <span>Focus music</span>
                </li>
              </ul>
            </div>

            {/* Weekly Plan */}
            <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
              <h3 className="text-xl font-bold mb-2">Pro Weekly</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$1.99</span>
                <span className="text-[var(--muted)]">/week</span>
              </div>
              <p className="text-sm text-primary-500 mb-6">3-day free trial</p>

              <Link
                href="/reader"
                className="block w-full py-3 text-center bg-[var(--card)] border border-primary-500 text-primary-500 hover:bg-primary-500/10 rounded-lg font-medium transition-colors mb-6"
              >
                Start Free Trial
              </Link>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <Zap size={16} className="text-primary-500 flex-shrink-0" />
                  <span><strong>Up to 1000 WPM</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span><strong>Unlimited</strong> reading</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Upload size={16} className="text-primary-500 flex-shrink-0" />
                  <span>File uploads</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Music size={16} className="text-primary-500 flex-shrink-0" />
                  <span>Focus music</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <span className="text-xs">Cancel anytime</span>
                </li>
              </ul>
            </div>

            {/* Annual Plan - Most Popular */}
            <div className="bg-[var(--card)] rounded-2xl p-6 border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro Annual</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-[var(--muted)]">/year</span>
              </div>
              <p className="text-sm text-green-500 font-medium mb-6">Save 82%</p>

              <Link
                href="/reader"
                className="block w-full py-3 text-center bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors mb-6"
              >
                Get Pro Annual
              </Link>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <Zap size={16} className="text-primary-500 flex-shrink-0" />
                  <span><strong>Up to 1000 WPM</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span><strong>Unlimited</strong> reading</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Upload size={16} className="text-primary-500 flex-shrink-0" />
                  <span>File uploads</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Music size={16} className="text-primary-500 flex-shrink-0" />
                  <span>Focus music</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-green-500">
                  <span className="text-xs font-medium">Best value — just $1.58/month</span>
                </li>
              </ul>
            </div>

            {/* Lifetime Plan */}
            <div className="bg-[var(--card)] rounded-2xl p-6 border-2 border-green-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                Best Value
              </div>
              <h3 className="text-xl font-bold mb-2">Pro Lifetime</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-[var(--muted)]">one-time</span>
              </div>
              <p className="text-sm text-green-500 font-medium mb-6">Pay once, own forever</p>

              <Link
                href="/reader"
                className="block w-full py-3 text-center bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors mb-6"
              >
                Get Lifetime Access
              </Link>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <Zap size={16} className="text-primary-500 flex-shrink-0" />
                  <span><strong>Up to 1000 WPM</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span><strong>Unlimited</strong> reading</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Upload size={16} className="text-primary-500 flex-shrink-0" />
                  <span>File uploads</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Music size={16} className="text-primary-500 flex-shrink-0" />
                  <span>Focus music</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-green-500">
                  <span className="text-xs font-medium">No subscriptions. Yours forever.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Money-back guarantee */}
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-[var(--muted)]">
            <Shield size={16} />
            <span>30-day money-back guarantee on all paid plans</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-[var(--card)]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "What is RSVP speed reading?",
                a: "RSVP (Rapid Serial Visual Presentation) displays one word at a time in a fixed position, eliminating eye movement. This allows your brain to focus purely on comprehension rather than scanning text, enabling faster reading speeds."
              },
              {
                q: "Will I still understand what I read?",
                a: "Yes! Start at a comfortable speed (200-300 WPM) and gradually increase. Most people find their comprehension stays the same or improves because there are fewer distractions. The key is to find your optimal speed."
              },
              {
                q: "How fast can I realistically read?",
                a: "The average person reads at 200-250 WPM. With practice, most people can comfortably reach 400-500 WPM. Some experienced speed readers achieve 700+ WPM. We recommend starting slower and building up."
              },
              {
                q: "What file types can I upload?",
                a: "Pro users can upload PDF, EPUB, and TXT files. Free users can paste text directly or import from URLs. We extract the text content so you can speed read any document."
              },
              {
                q: "What is the Lifetime plan?",
                a: "The Lifetime plan is a one-time $49 payment that gives you permanent access to all Pro features — unlimited speed, file uploads, focus music, and everything else. No recurring charges, no expiration. Pay once and it's yours forever."
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Absolutely. Cancel anytime with one click — no questions asked. If you're on the weekly plan with a free trial, you won't be charged if you cancel before the trial ends. Lifetime plan holders have permanent access — no cancellation needed."
              },
              {
                q: "What are the focus music options?",
                a: "Pro users get access to lo-fi beats and ambient sounds designed to enhance concentration. Music plays in the background while you read, helping you enter a flow state."
              }
            ].map((faq, i) => (
              <div key={i} className="border border-[var(--border)] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[var(--border)]/50 transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-[var(--muted)]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
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
