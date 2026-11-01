import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@/index.css';

export const viewport: Viewport = {
  themeColor: '#FAF6EF',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vernikaenterprises.com'),
  title: 'Vernika Enterprises — Madhubani Art Handpainted by Natasha Gupta',
  description:
    'Original, handpainted Madhubani (Mithila) art directly from the artist Natasha Gupta. GI-tagged heritage art on framed canvases, pure cotton dupattas, and handcrafted lifestyle bags.',
  keywords: [
    'Madhubani art',
    'Mithila painting',
    'Natasha Gupta',
    'Vernika Enterprises',
    'handpainted dupatta',
    'authentic Indian art',
    'GI-tagged art',
  ],
  authors: [{ name: 'Natasha Gupta' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Cormorant+SC:wght@400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
