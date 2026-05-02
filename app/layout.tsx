import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: 'Notification System',
  description: 'Frontend notification system built with Next.js, TypeScript, and Material UI.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}