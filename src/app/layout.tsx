import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from 'next/font/google';
import '@/styles/tokens.css';
import '@/index.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FBF3E2',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vernikaenterprises.com'),
  title: 'Vernika Enterprises — Madhubani Art Handpainted by Natasha Gupta',
  description:
    'Original, handpainted Madhubani (Mithila) art directly from artist Natasha Gupta. Archival gallery prints, framed paintings, pure cotton dupattas, and handcrafted lifestyle bags.',
  keywords: [
    'Madhubani art',
    'Mithila painting',
    'Natasha Gupta',
    'Vernika Enterprises',
    'handpainted dupatta',
    'authentic Indian art',
    'traditional art',
  ],
  authors: [{ name: 'Natasha Gupta' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="paper-grain-bg text-ink bg-paper antialiased min-h-screen flex flex-col font-sans selection:bg-accent selection:text-paper">
        {children}
      </body>
    </html>
  );
}
