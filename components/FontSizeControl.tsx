'use client';

type FontSize = 'small' | 'medium' | 'large' | 'xl';

interface FontSizeControlProps {
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
}

const SIZES: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
  { value: 'xl', label: 'XL' },
];

export default function FontSizeControl({ fontSize, onFontSizeChange }: FontSizeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--muted)]">Font:</span>
      <div className="flex gap-1">
        {SIZES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFontSizeChange(value)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              fontSize === value
                ? 'bg-primary-500 text-white'
                : 'bg-[var(--border)] hover:bg-[var(--muted)]/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
