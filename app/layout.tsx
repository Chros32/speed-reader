import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Read Fast - Read Faster, Comprehend More',
  description: 'Free speed reading app using RSVP technology. Upload books, articles, and documents to read at speeds up to 1000+ WPM.',
  keywords: ['speed reading', 'RSVP', 'reading app', 'fast reading', 'productivity'],
  openGraph: {
    title: 'Read Fast - Read Faster, Comprehend More',
    description: 'Free speed reading app using RSVP technology.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="safe-area-inset">
        <ThemeProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
