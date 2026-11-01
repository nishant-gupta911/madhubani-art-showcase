'use client';

import React, { useState } from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { Package, Search, Truck, Clock, CheckCircle2, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ivory)' }}>
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="home"
      />

      <main className="flex-1 container max-w-2xl py-12 px-4">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-vermilion font-semibold">
            Real-Time Fulfillment
          </span>
          <h1 className="font-display font-bold text-3xl text-ink mt-1">Track Your Artwork</h1>
          <p className="text-xs text-ink-muted mt-2">
            Enter your 12-character order reference (format: <code className="bg-amber-50 px-1 py-0.5 rounded text-amber-900">VE-YYMMDD-####</code>) and registered phone number.
          </p>
        </div>

        {/* Tracking Query Form */}
        <div className="bg-white p-6 rounded-lg border border-ivory-dimmed shadow-sm mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-ink mb-1">
                Order Reference *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. VE-261031-1042"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full text-sm p-2.5 border border-gray-300 rounded focus:outline-none focus:border-vermilion font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile number used at checkout"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm p-2.5 border border-gray-300 rounded focus:outline-none focus:border-vermilion"
              />
            </div>

            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-vermilion hover:bg-vermilion-dark text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? 'Locating Shipment...' : 'Track Shipment Status'}
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Order Tracking Result View */}
        {orderData && (
          <div className="bg-white p-6 rounded-lg border border-ivory-dimmed shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
              <div>
                <span className="font-mono font-bold text-lg text-vermilion">{orderData.orderId}</span>
                <p className="text-xs text-ink-muted">Placed on {new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  orderData.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                  orderData.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  orderData.status === 'in_preparation' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {orderData.status}
                </span>
              </div>
            </div>

            {/* Courier Dispatch Banner */}
            {orderData.tracking?.number && (
              <div className="p-4 rounded border border-blue-200 bg-blue-50/70 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <Truck size={16} /> Dispatched via {orderData.tracking.courier || 'Express Courier'}
                  </span>
                  {orderData.tracking.url && (
                    <a
                      href={orderData.tracking.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline flex items-center gap-1 font-medium"
                    >
                      Courier Portal <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <p className="text-blue-800">
                  AWB Tracking Number: <strong className="font-mono">{orderData.tracking.number}</strong>
                </p>
              </div>
            )}

            {/* Status Timeline */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-ink-muted tracking-wider mb-3">
                Tracking History
              </h4>
              <div className="space-y-4 border-l-2 border-vermilion/30 ml-2 pl-4">
                {orderData.statusHistory?.map((step: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-vermilion" />
                    <p className="text-xs font-semibold text-ink capitalize">{step.status}</p>
                    <p className="text-[11px] text-ink-muted">{step.note}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(step.at).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Items summary */}
            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold uppercase text-ink-muted tracking-wider mb-2">
                Order Items ({orderData.items?.length})
              </h4>
              <div className="space-y-2">
                {orderData.items?.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs text-ink">
                    <span>{it.qty}x {it.name}</span>
                    <span className="font-semibold">₹{(it.pricePaise * it.qty / 100).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
