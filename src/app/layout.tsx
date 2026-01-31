import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ResearchForm AI - Intelligent Research Forms That Adapt To You',
  description: 'Create dynamic research forms powered by AI. Our intelligent agent interviews you, generates custom forms, and conducts comprehensive research tailored to your location and needs.',
  keywords: ['AI research', 'dynamic forms', 'intelligent forms', 'market research', 'AI agents'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
