import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { HeaderBar } from '@/components/HeaderBar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <HeaderBar currentScreen="home" cartCount={0} wishlistCount={0} />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-accent mb-2">
          [ 404 / ARCHIVE FOLIO NOT LOCATED ]
        </div>
        <span
          className="font-display text-8xl md:text-9xl font-bold select-none leading-none opacity-20 text-accent"
        >
          404
        </span>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-ink mt-[-1.5rem] mb-3 tracking-tight">
          ARTWORK NOT FOUND
        </h1>
        <p className="font-mono text-xs text-ink/70 max-w-md mx-auto mb-8 uppercase tracking-wider">
          The requested plate or folio is unarchived, relocated, or in the private collection of artist Natasha Gupta.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/shop">
            <Button variant="primary" size="md">
              <Search size={14} className="mr-2" />
              <span>EXPLORE THE GALLERY</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="md">
              <Home size={14} className="mr-2" />
              <span>RETURN HOME</span>
            </Button>
          </Link>
        </div>
      </main>

      <Footer variant="compact" />
    </div>
  );
}
