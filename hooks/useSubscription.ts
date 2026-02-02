'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getSubscription,
  setSubscription,
  getUsage,
  updateUsage,
  canReadMore,
  getCurrentLimits,
  getRemainingUsage,
  FREE_LIMITS,
  type SubscriptionTier,
  type UsageData,
} from '@/lib/subscription';

export function useSubscription() {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [usage, setUsage] = useState<UsageData>({ date: '', wordsRead: 0, documentsRead: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load subscription and usage on mount
  useEffect(() => {
    setTier(getSubscription().tier);
    setUsage(getUsage());
    setIsLoaded(true);
  }, []);

  const isPremium = tier === 'premium';
  const limits = getCurrentLimits();
  const remaining = getRemainingUsage();

  // Record that user read a document
  const recordReading = useCallback((wordCount: number) => {
    const updated = updateUsage(wordCount);
    setUsage(updated);
    return updated;
  }, []);

  // Check if user can start reading
  const checkCanRead = useCallback(() => {
    return canReadMore();
  }, []);

  // Activate premium subscription
  const activatePremium = useCallback((durationDays: number = 365, customerId?: string) => {
    const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
    setSubscription('premium', expiresAt, customerId);
    setTier('premium');
  }, []);

  // Get customer ID for portal access
  const customerId = getSubscription().customerId;

  // Open customer portal
  const openPortal = useCallback(async () => {
    if (!customerId) return;

    try {
      const response = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    }
  }, [customerId]);

  // Get max WPM based on tier
  const maxWpm = isPremium ? 1000 : FREE_LIMITS.maxWpm;

  // Check if file upload is allowed
  const canUploadFiles = isPremium || FREE_LIMITS.allowFileUpload;

  // Check if music is allowed
  const canUseMusic = isPremium || FREE_LIMITS.allowMusic;

  return {
    tier,
    isPremium,
    isLoaded,
    usage,
    limits,
    remaining,
    maxWpm,
    canUploadFiles,
    canUseMusic,
    recordReading,
    checkCanRead,
    activatePremium,
    customerId,
    openPortal,
  };
}
