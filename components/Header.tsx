'use client';

import { Zap, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  showStartButton?: boolean;
}

export default function Header({ showStartButton = true }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--background)]/80 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl">SpeedReader</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--card)] transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Start Reading button */}
          {showStartButton && (
            <Link
              href="/reader"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              <Zap size={18} />
              Start Reading
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
