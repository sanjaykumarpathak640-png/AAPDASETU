import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';
import { ClientOfflineBanner } from '@/components/ClientOfflineBanner';
import { AiAssistant } from '@/components/AiAssistant';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AAPDASETU — Flood Alert, Prediction, Rescue and Disaster Management Platform',
  description: 'Warn Early. Navigate Safely. Survive Smarter. Connected full-stack disaster management platform.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0c1322',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen flex flex-col bg-navy-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        <LanguageProvider>
          <ClientOfflineBanner />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <AiAssistant />
          <Footer />
        </LanguageProvider>

        {/* Register Service Worker script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
