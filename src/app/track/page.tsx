'use client';

import React, { useState } from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Truck, Search, AlertCircle, ExternalLink } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError('Please provide both Order Reference (VE-...) and Phone Number');
      return;
    }

    setIsLoading(true);
    setError('');
    setOrderData(null);

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(cleanPhone)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Order not found');
      }

      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || 'Unable to locate order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="home"
      />

      <main className="flex-1 container max-w-2xl py-12 px-4">
        <div className="text-center mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-accent font-semibold block">
            [ LOGISTICS ARCHIVE / DISPATCH TELEMETRY ]
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink mt-1 uppercase tracking-tight">
            TRACK YOUR ARTWORK
          </h1>
          <p className="font-mono text-xs text-ink/70 mt-2 uppercase tracking-wider">
            Enter 12-char order ref (<span className="text-accent font-bold">VE-YYMMDD-####</span>) &amp; phone number
          </p>
        </div>

        {/* Tracking Query Form */}
        <div className="bg-paper-2 p-6 sm:p-8 border-2 border-ink shadow-[4px_4px_0_var(--ink)] mb-8">
          <form onSubmit={handleTrack} className="space-y-5">
            <Input
              label="Order Reference *"
              required
              placeholder="e.g. VE-261031-1042"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="font-mono"
            />

            <Input
              label="Mobile Number *"
              type="tel"
              required
              maxLength={10}
              placeholder="10-digit mobile number used at checkout"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="font-mono"
            />

            {error && (
              <div className="p-3 border border-accent bg-paper text-xs text-accent font-mono flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="md"
              className="w-full"
            >
              {isLoading ? 'Locating Shipment...' : 'TRACK SHIPMENT STATUS'}
              <Search size={14} className="ml-2" />
            </Button>
          </form>
        </div>

        {/* Order Tracking Result View */}
        {orderData && (
          <div className="bg-paper-2 p-6 sm:p-8 border-2 border-ink shadow-[4px_4px_0_var(--ink)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 gap-2">
              <div>
                <span className="font-mono font-bold text-xl text-accent">{orderData.orderId}</span>
                <p className="font-mono text-xs text-ink/70">
                  Placed {new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <span className="px-3 py-1 border border-ink font-mono text-xs uppercase tracking-wider bg-paper text-ink shadow-[2px_2px_0_var(--ink)]">
                  {orderData.status}
                </span>
              </div>
            </div>

            {/* Courier Dispatch Banner */}
            {orderData.tracking?.number && (
              <div className="p-4 border border-ink bg-paper text-xs font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink flex items-center gap-1.5 uppercase">
                    <Truck size={16} className="text-accent" /> Dispatched via {orderData.tracking.courier || 'Express Courier'}
                  </span>
                  {orderData.tracking.url && (
                    <a
                      href={orderData.tracking.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline flex items-center gap-1 font-bold"
                    >
                      Courier Portal <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <p className="text-ink/80">
                  AWB Tracking Number: <strong className="font-bold text-ink">{orderData.tracking.number}</strong>
                </p>
              </div>
            )}

            {/* Status Timeline */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase text-ink/60 tracking-wider mb-4">
                Tracking History
              </h4>
              <div className="space-y-4 border-l-2 border-ink ml-2 pl-4">
                {orderData.statusHistory?.map((step: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 bg-accent border border-ink" />
                    <p className="font-mono text-xs font-bold text-ink uppercase">{step.status}</p>
                    <p className="text-xs text-ink/80">{step.note}</p>
                    <p className="font-mono text-[10px] text-ink/50 mt-0.5">{new Date(step.at).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Items summary */}
            <div className="border-t border-line pt-4">
              <h4 className="font-mono text-xs font-bold uppercase text-ink/60 tracking-wider mb-2">
                Order Items ({orderData.items?.length})
              </h4>
              <div className="space-y-2 font-mono text-xs">
                {orderData.items?.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-ink">
                    <span>{it.qty}x {it.name}</span>
                    <span className="font-bold">₹{(it.pricePaise * it.qty / 100).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer variant="compact" />
    </div>
  );
}
