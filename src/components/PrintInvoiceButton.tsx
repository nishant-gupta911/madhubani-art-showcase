'use client';

import { Printer } from 'lucide-react';

export function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded px-3.5 py-1.5 shadow-sm transition-colors cursor-pointer"
    >
      <Printer size={14} /> Print Invoice
    </button>
  );
}
