import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { HeaderBar } from '@/components/HeaderBar';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ivory)' }}>
      <HeaderBar currentScreen="home" cartCount={0} wishlistCount={0} />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <span
          className="font-serif text-8xl md:text-9xl font-bold opacity-15 select-none"
          style={{ color: 'var(--vermilion)' }}
        >
          404
        </span>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink mt-[-2rem] mb-3">
          Artwork Not Found
        </h1>
        <p className="text-body-sm text-ink-muted max-w-md mx-auto mb-8">
          The artwork or page you are looking for may have been moved, renamed, or is currently with a private collector.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Search size={16} /> Explore the Gallery
          </Link>
          <Link
            href="/"
            className="btn btn-outline inline-flex items-center gap-2"
          >
            <Home size={16} /> Return Home
          </Link>
        </div>
      </main>
    </div>
  );
}
