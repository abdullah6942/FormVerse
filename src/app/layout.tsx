import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FormVerse - Intelligent Research Forms That Adapt To You',
  description: 'Create dynamic research forms powered by AI. Our intelligent agent interviews you, generates custom forms, and conducts comprehensive research tailored to your location and needs.',
  keywords: ['AI research', 'dynamic forms', 'intelligent forms', 'market research', 'AI agents'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased">
        <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
