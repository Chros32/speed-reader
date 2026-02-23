'use client';

import { useState } from 'react';
import { X, Check, Zap, Clock, Upload, Music, Shield } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'speed' | 'upload' | 'music' | 'limit' | 'general';
}

const FEATURES = [
  { icon: Zap, text: 'Unlimited reading speed (up to 1000 WPM)' },
  { icon: Upload, text: 'Upload PDF, EPUB & TXT files' },
  { icon: Music, text: 'Focus music & binaural beats' },
  { icon: Clock, text: 'Unlimited documents per day' },
];

const PLANS = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: '$1.99',
    period: 'week',
    subtitle: '3-day free trial',
    popular: false,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$19',
    period: 'year',
    subtitle: 'Save 82%',
    popular: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$49',
    period: 'one-time',
    subtitle: 'Best Value',
    popular: false,
  },
];

export default function PaywallModal({ isOpen, onClose, trigger = 'general' }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const triggerMessages: Record<string, string> = {
    speed: 'Unlock faster reading speeds',
    upload: 'Upload your own documents',
    music: 'Focus with background music',
    limit: "You've hit your daily limit",
    general: 'Unlock the full experience',
  };

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--background)] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--card)] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{triggerMessages[trigger]}</h2>
          <p className="text-[var(--muted)]">
            Upgrade to Read Fast Premium for the ultimate speed reading experience
          </p>
        </div>

        {/* Features */}
        <div className="px-6 pb-4">
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Icon size={16} className="text-primary-500" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="px-6 pb-4 space-y-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedPlan === plan.id
                  ? 'border-primary-500 bg-primary-500/5'
                  : 'border-[var(--border)] hover:border-[var(--muted)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{plan.price}</span>
                    <span className="text-[var(--muted)]">/ {plan.period}</span>
                    {plan.popular && (
                      <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className={`text-sm mt-1 ${plan.id === 'lifetime' ? 'text-green-500 font-medium' : 'text-[var(--muted)]'}`}>
                    {plan.subtitle}
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-[var(--border)]'
                  }`}
                >
                  {selectedPlan === plan.id && <Check size={14} className="text-white" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="p-6 pt-2">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors"
          >
            {isLoading
              ? 'Processing...'
              : selectedPlan === 'weekly'
                ? 'Start Free Trial'
                : selectedPlan === 'lifetime'
                  ? 'Buy Lifetime Access'
                  : 'Subscribe Now'}
          </button>
          <p className="text-xs text-center text-[var(--muted)] mt-3">
            {selectedPlan === 'weekly'
              ? 'Free for 3 days, then $1.99/week. Cancel anytime.'
              : selectedPlan === 'annual'
                ? '$19 billed annually. Cancel anytime.'
                : 'One-time payment. Yours forever.'}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-[var(--muted)]">
            <Shield size={12} />
            <span>30-day money-back guarantee</span>
          </div>
        </div>

        {/* Footer links */}
        <div className="px-6 pb-6 flex justify-center gap-4 text-xs text-[var(--muted)]">
          <a href="#" className="hover:underline">Terms of Use</a>
          <span>·</span>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>·</span>
          <a href="#" className="hover:underline">Restore Purchase</a>
        </div>
      </div>
    </div>
  );
}
