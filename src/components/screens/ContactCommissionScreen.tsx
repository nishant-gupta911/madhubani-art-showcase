'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ContactCommissionScreen: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'commission',
    dimensions: '18×24 in (Medium)',
    budget: '₹5,000 – ₹10,000',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, email address, and a brief message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Unable to submit your message right now. Please WhatsApp Natasha directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper text-ink min-h-screen">
      {/* Page Header */}
      <div className="bg-ink text-paper border-b border-line py-12">
        <div className="container space-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-accent block font-semibold">
            [ 06 / DIRECT STUDIO ACCESS ]
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-paper uppercase tracking-tight">
            COMMISSIONS &amp; STUDIO INQUIRIES
          </h1>
          <p className="font-mono text-xs text-paper/70 max-w-xl uppercase tracking-wider">
            Commission a bespoke original Mithila painting, discuss custom dimensions, or order bridal trousseau dupattas directly with artist Natasha Gupta.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 sm:p-12 text-center space-y-6 bg-paper-2 border-2 border-ink shadow-[4px_4px_0_var(--ink)]">
                <CheckCircle className="h-14 w-14 text-leaf mx-auto" />
                <h2 className="font-display font-bold text-3xl text-ink uppercase tracking-tight">
                  MESSAGE SENT TO STUDIO
                </h2>
                <p className="font-mono text-xs text-ink/70 max-w-sm mx-auto uppercase tracking-wider leading-relaxed">
                  Natasha Gupta has received your commission details and will review and reply within 24 hours.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'commission',
                      dimensions: '18×24 in (Medium)',
                      budget: '₹5,000 – ₹10,000',
                      message: '',
                    });
                  }}
                  variant="ink"
                  size="md"
                >
                  SEND ANOTHER MESSAGE
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 space-y-6 bg-paper-2 border-2 border-ink shadow-[4px_4px_0_var(--ink)]"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent font-semibold block mb-1">
                    BESPOKE INQUIRY
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink uppercase tracking-tight">
                    SEND A MESSAGE TO NATASHA
                  </h2>
                </div>

                {error && (
                  <div className="p-3 border border-accent bg-paper text-accent font-mono text-xs flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Subject selector */}
                <div className="space-y-2">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold block">
                    Subject
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'commission', label: 'Commission a Painting' },
                      { id: 'apparel', label: 'Custom Dupatta / Apparel' },
                      { id: 'bulk', label: 'Corporate / Bulk Gifting' },
                      { id: 'general', label: 'General Question' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, subject: tab.id })}
                        className={`px-3 py-1.5 font-mono text-xs uppercase border cursor-pointer transition-all ${
                          formData.subject === tab.id
                            ? 'bg-ink text-paper border-ink shadow-[2px_2px_0_var(--accent)] font-semibold'
                            : 'bg-paper text-ink border-line hover:border-ink'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    required
                    placeholder="e.g. Ananya Sen"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    placeholder="e.g. ananya@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <Input
                  label="Mobile / WhatsApp Number (Optional)"
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />

                {formData.subject === 'commission' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold block mb-1">
                        Preferred Dimensions
                      </label>
                      <select
                        value={formData.dimensions}
                        onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                        className="w-full bg-paper border border-line p-3 font-mono text-[16px] text-ink focus:outline-hidden focus:border-ink focus:shadow-[2px_2px_0_var(--accent)]"
                      >
                        <option>12×16 in (Small)</option>
                        <option>18×24 in (Medium)</option>
                        <option>24×36 in (Large)</option>
                        <option>Custom Size (Specify in message)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold block mb-1">
                        Budget Range (₹)
                      </label>
                      <select
                        value={formData.budget}
                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-paper border border-line p-3 font-mono text-[16px] text-ink focus:outline-hidden focus:border-ink focus:shadow-[2px_2px_0_var(--accent)]"
                      >
                        <option>₹2,000 – ₹5,000</option>
                        <option>₹5,000 – ₹10,000</option>
                        <option>₹10,000 – ₹25,000</option>
                        <option>Above ₹25,000</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold block mb-1">
                    Message / Motif Request *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full min-h-[140px] resize-y bg-paper border border-line p-3 font-sans text-[16px] text-ink focus:outline-hidden focus:border-ink focus:shadow-[2px_2px_0_var(--accent)]"
                    placeholder={
                      formData.subject === 'commission'
                        ? 'Describe the theme (Matsya fish, Mayura peacock, Surya sun, Tree of Life) or specific dimensions...'
                        : 'How can we help you?'
                    }
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> SENDING TO NATASHA...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={14} /> SEND MESSAGE TO STUDIO
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info Sidebar */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-paper-2 border-2 border-ink shadow-[4px_4px_0_var(--ink)] space-y-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent font-semibold block mb-1">
                  OFFICIAL CONTACT
                </span>
                <h3 className="font-display font-bold text-2xl text-ink uppercase tracking-tight">
                  STUDIO DIRECT CONTACT
                </h3>
              </div>

              <div className="space-y-5">
                {[
                  { icon: Mail, label: 'Email', val: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
                  { icon: Phone, label: 'Phone / WhatsApp', val: `${siteConfig.contact.displayPhone}`, href: siteConfig.contact.whatsappLink },
                  { icon: MapPin, label: 'Studio Location', val: siteConfig.origin },
                  { icon: Clock, label: 'Studio Hours', val: 'Mon–Sat, 10:00 AM – 7:00 PM IST' },
                  { icon: Globe, label: 'Shipping', val: 'Pan-India Insured Express Courier' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3.5">
                    <div className="p-2 border border-ink bg-paper text-accent shrink-0 mt-0.5 shadow-[1px_1px_0_var(--ink)]">
                      <item.icon size={15} />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink/60">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="font-mono text-xs text-ink hover:text-accent font-semibold underline"
                        >
                          {item.val}
                        </a>
                      ) : (
                        <p className="font-mono text-xs text-ink font-semibold">
                          {item.val}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
