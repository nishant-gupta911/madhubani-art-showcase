'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { MithilaMotif } from './MithilaMotif';
import { siteConfig } from '../config/site';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{ background: 'var(--night)', color: 'var(--ivory)' }}>
      {/* Motif divider at top */}
      <div className="container pt-2">
        <MithilaMotif type="lotus-divider" color="rgba(250,246,239,0.25)" width="100%" />
      </div>

      {/* ── Newsletter Band ─────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--hairline-dark)' }} className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-3">
              <p className="text-eyebrow" style={{ color: 'var(--vermilion)', letterSpacing: '0.18em' }}>
                The Collector&apos;s Circle
              </p>
              <h2 className="font-display font-bold text-headline" style={{ color: 'var(--ivory)' }}>
                Stories from the Mithila Studio
              </h2>
              <p className="text-body-sm" style={{ color: 'rgba(250,246,239,0.6)', maxWidth: '420px' }}>
                Receive stories behind new original paintings, invitations to studio exhibitions, and private previews before public release.
              </p>
            </div>

            <div>
              {subscribed ? (
                <div
                  className="p-5 rounded flex items-center gap-3 text-body-sm"
                  style={{ background: 'rgba(58,125,68,0.2)', border: '1px solid rgba(58,125,68,0.4)', color: '#86efac' }}
                >
                  <span>✦</span> Welcome to the Collector&apos;s Circle. You will receive private previews and studio stories.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="input flex-1"
                      style={{
                        background: 'rgba(250,246,239,0.08)',
                        borderColor: 'rgba(250,246,239,0.18)',
                        color: 'var(--ivory)',
                      }}
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-primary whitespace-nowrap"
                      style={{ background: 'var(--vermilion)', borderColor: 'var(--vermilion)' }}
                    >
                      Join <ArrowRight size={14} />
                    </button>
                  </div>
                  <p className="text-caption" style={{ color: 'rgba(250,246,239,0.35)' }}>
                    Occasional emails only. Zero spam. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Columns ─────────────────────────────────────── */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="brand-mark">
                <img src="/vernika-enterprises.png" alt="" />
              </div>
              <div>
                <span className="font-display font-bold text-title tracking-wider" style={{ color: 'var(--ivory)' }}>
                  {siteConfig.name}
                </span>
                <p className="text-caption" style={{ color: 'rgba(250,246,239,0.5)' }}>
                  By {siteConfig.artist}
                </p>
              </div>
            </div>

            <p className="text-body-sm leading-relaxed" style={{ color: 'rgba(250,246,239,0.6)', maxWidth: '340px' }}>
              Handpainted Mithila art, preserving ancient village heritage through original framed paintings, tussar dupattas, and handcrafted lifestyle accessories.
            </p>

            <div className="space-y-2 text-body-sm" style={{ color: 'rgba(250,246,239,0.6)' }}>
              <div className="flex items-center gap-2.5">
                <MapPin size={13} style={{ color: 'var(--vermilion)' }} />
                <span>{siteConfig.origin}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={13} style={{ color: 'var(--vermilion)' }} />
                <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {siteConfig.contact.displayPhone} (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={13} style={{ color: 'var(--vermilion)' }} />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: The Art */}
          <div className="space-y-4">
            <p className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.4)', letterSpacing: '0.15em' }}>
              The Collection
            </p>
            <ul className="space-y-2.5 text-body-sm" style={{ color: 'rgba(250,246,239,0.65)' }}>
              <li><Link href="/shop" className="hover:text-ivory transition-colors">All Artworks</Link></li>
              <li><Link href="/shop/category/paintings" className="hover:text-ivory transition-colors">Framed Paintings</Link></li>
              <li><Link href="/shop/category/dupattas" className="hover:text-ivory transition-colors">Dupattas &amp; Angvastras</Link></li>
              <li><Link href="/shop/category/bags_and_files" className="hover:text-ivory transition-colors">Bags, Files &amp; Wall Art</Link></li>
              <li><Link href="/gallery" className="hover:text-ivory transition-colors">Full Artist Portfolio (PDF)</Link></li>
            </ul>
          </div>

          {/* Col 3: Heritage */}
          <div className="space-y-4">
            <p className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.4)', letterSpacing: '0.15em' }}>
              Heritage &amp; Studio
            </p>
            <ul className="space-y-2.5 text-body-sm" style={{ color: 'rgba(250,246,239,0.65)' }}>
              <li><Link href="/about" className="hover:text-ivory transition-colors">About the Art Form</Link></li>
              <li><Link href="/contact" className="hover:text-ivory transition-colors">Custom Commissions</Link></li>
              <li><Link href="/track" className="hover:text-ivory transition-colors">Track Your Order</Link></li>
              <li><Link href="/admin" className="hover:text-ivory transition-colors">Natasha Studio Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div className="space-y-4">
            <p className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.4)', letterSpacing: '0.15em' }}>
              Trust &amp; Policies
            </p>
            <ul className="space-y-2.5 text-body-sm" style={{ color: 'rgba(250,246,239,0.65)' }}>
              <li><Link href="/shipping" className="hover:text-ivory transition-colors">Shipping &amp; Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-ivory transition-colors">Returns &amp; Refunds</Link></li>
              <li><Link href="/cancellation" className="hover:text-ivory transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-ivory transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-ivory transition-colors">Terms of Service</Link></li>
              <li><Link href="/grievance" className="hover:text-ivory transition-colors">Grievance Officer</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────────── */}
      <div
        className="py-6 text-center text-caption"
        style={{
          borderTop: '1px solid var(--hairline-dark)',
          color: 'rgba(250,246,239,0.35)',
        }}
      >
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Vernika Enterprises by Natasha Gupta. Handcrafted in Mithila, Bihar, India.</p>
          <p>Authentic GI-Tagged Cultural Art Form · Insured Delivery Across India</p>
        </div>
      </div>
    </footer>
  );
};
