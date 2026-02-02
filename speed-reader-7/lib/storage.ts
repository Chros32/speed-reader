'use client';

export interface RecentDocument {
  id: string;
  title: string;
  preview: string;
  wordCount: number;
  lastRead: number;
  progress: number; // 0-100
}

const STORAGE_KEY = 'speedreader_recent_docs';
const MAX_RECENT_DOCS = 10;

export function getRecentDocuments(): RecentDocument[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveDocument(text: string, progress: number = 0): RecentDocument {
  const docs = getRecentDocuments();

  // Generate a simple hash for the document ID
  const id = generateId(text);

  // Check if document already exists
  const existingIndex = docs.findIndex(d => d.id === id);

  const words = text.split(/\s+/).filter(w => w.length > 0);
  const title = generateTitle(text);
  const preview = text.slice(0, 100).trim() + (text.length > 100 ? '...' : '');

  const doc: RecentDocument = {
    id,
    title,
    preview,
    wordCount: words.length,
    lastRead: Date.now(),
    progress,
  };

  if (existingIndex >= 0) {
    // Update existing document
    docs[existingIndex] = doc;
  } else {
    // Add new document at the beginning
    docs.unshift(doc);
  }

  // Keep only the most recent documents
  const trimmed = docs.slice(0, MAX_RECENT_DOCS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage might be full, try removing oldest
    const reduced = trimmed.slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
  }

  return doc;
}

export function updateDocumentProgress(id: string, progress: number): void {
  const docs = getRecentDocuments();
  const index = docs.findIndex(d => d.id === id);

  if (index >= 0) {
    docs[index].progress = progress;
    docs[index].lastRead = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  }
}

export function deleteDocument(id: string): void {
  const docs = getRecentDocuments();
  const filtered = docs.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllDocuments(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function generateId(text: string): string {
  // Simple hash function
  let hash = 0;
  const sample = text.slice(0, 500);
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function generateTitle(text: string): string {
  // Try to extract a title from the first line or first few words
  const firstLine = text.split('\n')[0].trim();

  if (firstLine.length > 0 && firstLine.length <= 60) {
    return firstLine;
  }

  // Use first few words as title
  const words = text.split(/\s+/).slice(0, 6).join(' ');
  return words.length > 50 ? words.slice(0, 50) + '...' : words;
}
