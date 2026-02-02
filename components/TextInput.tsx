'use client';

import { useState, useRef } from 'react';
import { Upload, Link, FileText, Loader2, AlertCircle, Lock } from 'lucide-react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  isLoading?: boolean;
  canUploadFiles?: boolean;
  onUpgradeClick?: () => void;
}

type TabType = 'paste' | 'url' | 'upload';

export default function TextInput({ onTextSubmit, isLoading = false, canUploadFiles = true, onUpgradeClick }: TextInputProps) {
  const [activeTab, setActiveTab] = useState<TabType>('paste');
  const [pasteText, setPasteText] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loading = isLoading || localLoading;

  const handlePasteSubmit = () => {
    if (pasteText.trim()) {
      setError(null);
      onTextSubmit(pasteText.trim());
    } else {
      setError('Please enter some text to read');
    }
  };

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      setError(null);
      setLocalLoading(true);

      // Check if we're in a Capacitor native app (no API routes available)
      const isNativeApp = typeof window !== 'undefined' &&
        (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();

      if (isNativeApp) {
        throw new Error('URL extraction is not available in the mobile app. Please copy and paste the article text instead.');
      }

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from URL');
      }

      if (data.text) {
        onTextSubmit(data.text);
      } else {
        throw new Error('No text content found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URL');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLocalLoading(true);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'txt' || extension === 'md') {
        // Plain text files
        const text = await file.text();
        onTextSubmit(text);
      } else if (extension === 'pdf') {
        // PDF files - use API route
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/extract', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to parse PDF');
        }

        onTextSubmit(data.text);
      } else if (extension === 'epub') {
        // EPUB files - parse on client
        const arrayBuffer = await file.arrayBuffer();
        const { parseEpub } = await import('@/lib/parseEpub');
        const text = await parseEpub(arrayBuffer);
        onTextSubmit(text);
      } else {
        throw new Error(`Unsupported file type: .${extension}. Supported: PDF, EPUB, TXT, MD`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLocalLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const tabs = [
    { id: 'paste' as TabType, label: 'Paste', icon: FileText, locked: false },
    { id: 'url' as TabType, label: 'URL', icon: Link, locked: false },
    { id: 'upload' as TabType, label: 'Upload', icon: Upload, locked: !canUploadFiles },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-[var(--card)] rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[var(--border)]">
        {tabs.map(({ id, label, icon: Icon, locked }) => (
          <button
            key={id}
            onClick={() => {
              if (locked && onUpgradeClick) {
                onUpgradeClick();
              } else if (!locked) {
                setActiveTab(id);
                setError(null);
              }
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-[var(--background)] text-primary-500 border-b-2 border-primary-500 -mb-px'
                : locked
                ? 'text-[var(--muted)] opacity-60 cursor-pointer'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {locked ? <Lock size={14} /> : <Icon size={18} />}
            {label}
            {locked && <span className="text-xs">(Pro)</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-3">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full h-40 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
            />
            <button
              onClick={handlePasteSubmit}
              disabled={loading || !pasteText.trim()}
              className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              Start Reading
            </button>
          </div>
        )}

        {activeTab === 'url' && (
          <div className="space-y-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
            />
            <p className="text-xs text-[var(--muted)]">
              Enter a URL to extract and read the article content
            </p>
            <button
              onClick={handleUrlSubmit}
              disabled={loading || !url.trim()}
              className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              Extract & Read
            </button>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-3">
            {canUploadFiles ? (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-primary-500/50 transition-colors"
                >
                  <Upload size={40} className="mx-auto mb-3 text-[var(--muted)]" />
                  <p className="font-medium mb-1">Drop files here or click to upload</p>
                  <p className="text-sm text-[var(--muted)]">
                    Supports PDF, EPUB, TXT files (max 50MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.epub,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {loading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
                    <Loader2 size={18} className="animate-spin" />
                    Processing file...
                  </div>
                )}
              </>
            ) : (
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
                <Lock size={40} className="mx-auto mb-3 text-[var(--muted)]" />
                <p className="font-medium mb-1">File uploads are a Premium feature</p>
                <p className="text-sm text-[var(--muted)] mb-4">
                  Upgrade to upload PDF, EPUB, and TXT files directly
                </p>
                <button
                  onClick={onUpgradeClick}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
