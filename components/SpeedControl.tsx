'use client';

import { Minus, Plus, Lock } from 'lucide-react';

interface SpeedControlProps {
  wpm: number;
  onWpmChange: (wpm: number) => void;
  maxWpm?: number;
  onUpgradeClick?: () => void;
}

const PRESETS = [
  { value: 200, label: '200', sublabel: 'Beginner' },
  { value: 250, label: '250', sublabel: 'Average' },
  { value: 300, label: '300', sublabel: 'Fast' },
  { value: 450, label: '450', sublabel: 'Advanced', premium: true },
  { value: 600, label: '600', sublabel: 'Expert', premium: true },
];

const MIN_WPM = 100;
const DEFAULT_MAX_WPM = 1000;
const STEP = 50;

export default function SpeedControl({ wpm, onWpmChange, maxWpm = DEFAULT_MAX_WPM, onUpgradeClick }: SpeedControlProps) {
  const effectiveMax = maxWpm;
  const isLimited = maxWpm < DEFAULT_MAX_WPM;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    onWpmChange(Math.min(newValue, effectiveMax));
  };

  const increment = () => {
    const newValue = Math.min(effectiveMax, wpm + STEP);
    onWpmChange(newValue);
  };

  const decrement = () => {
    onWpmChange(Math.max(MIN_WPM, wpm - STEP));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[var(--card)] rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--muted)]">Reading Speed</span>
        <span className="text-2xl font-bold">
          {wpm} <span className="text-sm font-normal text-[var(--muted)]">wpm</span>
        </span>
      </div>

      {/* Slider with +/- buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={decrement}
          disabled={wpm <= MIN_WPM}
          className="p-2 rounded-lg bg-[var(--border)] hover:bg-[var(--muted)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease speed"
        >
          <Minus size={18} />
        </button>

        <input
          type="range"
          min={MIN_WPM}
          max={effectiveMax}
          step={STEP}
          value={wpm}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-primary-500
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary-500
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-thumb]:cursor-pointer"
        />

        <button
          onClick={increment}
          disabled={wpm >= effectiveMax}
          className="p-2 rounded-lg bg-[var(--border)] hover:bg-[var(--muted)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase speed"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2 justify-center flex-wrap">
        {PRESETS.map((preset) => {
          const isLocked = preset.premium && preset.value > effectiveMax;

          return (
            <button
              key={preset.value}
              onClick={() => {
                if (isLocked && onUpgradeClick) {
                  onUpgradeClick();
                } else if (!isLocked) {
                  onWpmChange(preset.value);
                }
              }}
              disabled={isLocked && !onUpgradeClick}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                wpm === preset.value
                  ? 'bg-primary-500 text-white'
                  : isLocked
                  ? 'bg-[var(--border)] opacity-60 cursor-pointer'
                  : 'bg-[var(--border)] hover:bg-[var(--muted)]/20'
              }`}
            >
              {isLocked && <Lock size={12} />}
              <span className="font-medium">{preset.label}</span>
              <span className="hidden sm:inline text-xs ml-1 opacity-70">{preset.sublabel}</span>
            </button>
          );
        })}
      </div>

      {/* Upgrade prompt for limited users */}
      {isLimited && (
        <button
          onClick={onUpgradeClick}
          className="w-full text-center text-xs text-primary-500 hover:text-primary-600 transition-colors"
        >
          Upgrade to Premium for speeds up to 1000 WPM →
        </button>
      )}
    </div>
  );
}
