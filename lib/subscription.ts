// Subscription and usage tracking for free tier limits

export type SubscriptionTier = 'free' | 'premium';

export interface UsageData {
  date: string; // YYYY-MM-DD
  wordsRead: number;
  documentsRead: number;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  expiresAt?: number; // timestamp for premium expiry
  customerId?: string; // Stripe customer ID for portal access
}

const USAGE_KEY = 'readfast_usage';
const SUBSCRIPTION_KEY = 'readfast_subscription';

// Free tier limits
export const FREE_LIMITS = {
  maxWordsPerDay: 5000,
  maxDocumentsPerDay: 3,
  maxWpm: 400,
  allowFileUpload: false,
  allowMusic: false,
};

export const PREMIUM_LIMITS = {
  maxWordsPerDay: Infinity,
  maxDocumentsPerDay: Infinity,
  maxWpm: 1000,
  allowFileUpload: true,
  allowMusic: true,
};

// Get today's date string
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get current usage
export function getUsage(): UsageData {
  if (typeof window === 'undefined') {
    return { date: getTodayString(), wordsRead: 0, documentsRead: 0 };
  }

  try {
    const stored = localStorage.getItem(USAGE_KEY);
    if (!stored) {
      return { date: getTodayString(), wordsRead: 0, documentsRead: 0 };
    }

    const usage: UsageData = JSON.parse(stored);

    // Reset if it's a new day
    if (usage.date !== getTodayString()) {
      return { date: getTodayString(), wordsRead: 0, documentsRead: 0 };
    }

    return usage;
  } catch {
    return { date: getTodayString(), wordsRead: 0, documentsRead: 0 };
  }
}

// Update usage
export function updateUsage(wordsToAdd: number): UsageData {
  const current = getUsage();
  const updated: UsageData = {
    date: getTodayString(),
    wordsRead: current.wordsRead + wordsToAdd,
    documentsRead: current.documentsRead + 1,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
  }

  return updated;
}

// Get subscription state
export function getSubscription(): SubscriptionState {
  if (typeof window === 'undefined') {
    return { tier: 'free' };
  }

  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY);
    if (!stored) {
      return { tier: 'free' };
    }

    const sub: SubscriptionState = JSON.parse(stored);

    // Check if premium has expired
    if (sub.tier === 'premium' && sub.expiresAt && sub.expiresAt < Date.now()) {
      return { tier: 'free' };
    }

    return sub;
  } catch {
    return { tier: 'free' };
  }
}

// Set subscription (called after successful payment)
export function setSubscription(tier: SubscriptionTier, expiresAt?: number, customerId?: string): void {
  if (typeof window === 'undefined') return;

  const existing = getSubscription();
  const sub: SubscriptionState = {
    tier,
    expiresAt,
    customerId: customerId || existing.customerId // preserve existing customerId
  };
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(sub));
}

// Check if user can read more today
export function canReadMore(): { allowed: boolean; reason?: string } {
  const sub = getSubscription();

  if (sub.tier === 'premium') {
    return { allowed: true };
  }

  const usage = getUsage();

  if (usage.documentsRead >= FREE_LIMITS.maxDocumentsPerDay) {
    return {
      allowed: false,
      reason: `You've reached your daily limit of ${FREE_LIMITS.maxDocumentsPerDay} documents. Upgrade to Premium for unlimited reading.`,
    };
  }

  if (usage.wordsRead >= FREE_LIMITS.maxWordsPerDay) {
    return {
      allowed: false,
      reason: `You've reached your daily limit of ${FREE_LIMITS.maxWordsPerDay.toLocaleString()} words. Upgrade to Premium for unlimited reading.`,
    };
  }

  return { allowed: true };
}

// Get current limits based on subscription
export function getCurrentLimits() {
  const sub = getSubscription();
  return sub.tier === 'premium' ? PREMIUM_LIMITS : FREE_LIMITS;
}

// Get remaining usage for free tier
export function getRemainingUsage() {
  const sub = getSubscription();

  if (sub.tier === 'premium') {
    return {
      wordsRemaining: Infinity,
      documentsRemaining: Infinity,
      isPremium: true,
    };
  }

  const usage = getUsage();

  return {
    wordsRemaining: Math.max(0, FREE_LIMITS.maxWordsPerDay - usage.wordsRead),
    documentsRemaining: Math.max(0, FREE_LIMITS.maxDocumentsPerDay - usage.documentsRead),
    isPremium: false,
  };
}
