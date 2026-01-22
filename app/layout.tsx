import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'SpeedReader - Read Faster, Comprehend More',
  description: 'Free speed reading app using RSVP technology. Upload books, articles, and documents to read at speeds up to 1000+ WPM.',
  keywords: ['speed reading', 'RSVP', 'reading app', 'fast reading', 'productivity'],
  openGraph: {
    title: 'SpeedReader - Read Faster, Comprehend More',
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
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
