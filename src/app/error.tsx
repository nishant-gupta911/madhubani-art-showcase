'use client';

import React, { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16" style={{ background: 'var(--ivory)' }}>
      <div className="max-w-md bg-white p-8 rounded-lg border border-stone-200 shadow-sm space-y-4">
        <h2 className="font-display font-bold text-2xl text-ink">Something went wrong</h2>
        <p className="text-xs text-ink-muted leading-relaxed">
          An unexpected error occurred while loading this view. Our studio team has been notified.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="btn btn-primary inline-flex items-center gap-2 text-xs"
          >
            <RefreshCw size={14} /> Try Again
          </button>
          <Link
            href="/"
            className="btn btn-outline inline-flex items-center gap-2 text-xs"
          >
            <Home size={14} /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
