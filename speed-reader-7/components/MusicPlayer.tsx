'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Lock, ChevronDown } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  category: 'lofi' | 'binaural' | 'ambient';
  url?: string; // URL to audio file - will be added when tracks are available
}

const TRACKS: Track[] = [
  { id: 'lofi-1', name: 'Midnight Pages', category: 'lofi', url: '/audio/lofi-midnight-pages.mp3' },
  { id: 'lofi-2', name: 'Midnight Pages II', category: 'lofi', url: '/audio/lofi-midnight-pages-2.mp3' },
  { id: 'binaural-1', name: 'Alpha Waves (Focus)', category: 'binaural' },
  { id: 'binaural-2', name: 'Beta Waves (Alertness)', category: 'binaural' },
  { id: 'ambient-1', name: 'Rain Sounds', category: 'ambient' },
  { id: 'ambient-2', name: 'Forest Ambience', category: 'ambient' },
];

interface MusicPlayerProps {
  isEnabled: boolean;
  onUpgradeClick?: () => void;
}

export default function MusicPlayer({ isEnabled, onUpgradeClick }: MusicPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && selectedTrack?.url) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedTrack]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
    setIsPlaying(true);
    setIsOpen(false);
  };

  const togglePlay = () => {
    if (selectedTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setIsOpen(true);
    }
  };

  // Locked state for free users
  if (!isEnabled) {
    return (
      <button
        onClick={onUpgradeClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--card)] hover:bg-[var(--border)] transition-colors text-sm"
      >
        <Lock size={16} className="text-[var(--muted)]" />
        <Music size={16} className="text-[var(--muted)]" />
        <span className="text-[var(--muted)]">Music</span>
        <span className="text-xs text-primary-500">Pro</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Audio element */}
      {selectedTrack?.url && (
        <audio ref={audioRef} src={selectedTrack.url} loop />
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
          isPlaying
            ? 'bg-primary-500/10 text-primary-500'
            : 'bg-[var(--card)] hover:bg-[var(--border)]'
        }`}
      >
        <Music size={16} />
        <span className="hidden sm:inline">
          {selectedTrack ? selectedTrack.name : 'Music'}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--card)] rounded-xl shadow-lg border border-[var(--border)] z-50 overflow-hidden">
            {/* Now playing */}
            {selectedTrack && (
              <div className="p-3 border-b border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--muted)]">Now Playing</span>
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-full bg-primary-500 text-white"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>
                <div className="font-medium text-sm">{selectedTrack.name}</div>

                {/* Volume control */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 rounded hover:bg-[var(--border)]"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="flex-1 h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Track categories */}
            {(['lofi', 'binaural', 'ambient'] as const).map((category) => (
              <div key={category} className="p-2">
                <div className="text-xs text-[var(--muted)] px-2 py-1 uppercase">
                  {category === 'lofi' ? 'Lo-Fi Beats' : category === 'binaural' ? 'Binaural Beats' : 'Ambient'}
                </div>
                {TRACKS.filter((t) => t.category === category).map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedTrack?.id === track.id
                        ? 'bg-primary-500/10 text-primary-500'
                        : 'hover:bg-[var(--border)]'
                    }`}
                  >
                    {track.name}
                    {!track.url && (
                      <span className="text-xs text-[var(--muted)] ml-2">(Coming soon)</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
