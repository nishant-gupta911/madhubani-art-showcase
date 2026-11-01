'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { MithilaMotif } from '../MithilaMotif';
import { siteConfig } from '../../config/site';

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
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--night)', color: 'var(--ivory)', borderBottom: '1px solid var(--hairline-dark)' }} className="py-12">
        <div className="container space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-px" style={{ background: 'rgba(250,246,239,0.3)' }} />
            <span className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.5)', letterSpacing: '0.18em' }}>
              Direct Artist Studio Access
            </span>
          </div>
          <h1 className="font-display font-bold text-headline" style={{ color: 'var(--ivory)' }}>
            Commissions &amp; Studio Inquiries
          </h1>
          <p className="text-body-sm" style={{ color: 'rgba(250,246,239,0.6)', maxWidth: '520px' }}>
            Commission a bespoke original painting, enquire about custom dimensions, or discuss wedding suites directly with artist Natasha Gupta.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ─── Form ───────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div
                className="p-10 text-center space-y-6 relative"
                style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
              >
                <MithilaMotif type="four-corners" color="var(--vermilion)" />
                <CheckCircle className="h-16 w-16 text-leaf mx-auto" style={{ color: 'var(--leaf)' }} />
                <h2 className="font-display font-bold text-title" style={{ color: 'var(--ink)' }}>Message Sent to Studio!</h2>
                <p className="text-body-sm max-w-sm mx-auto" style={{ color: 'var(--ink-soft)' }}>
                  Natasha Gupta at Vernika Enterprises has received your commission details and will review and reply within 24 hours.
                </p>
                <button
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
                  className="btn btn-outline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 relative"
                style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
              >
                <MithilaMotif type="four-corners" color="rgba(176,48,32,0.08)" />
                <h2 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                  Send a Message to Natasha
                </h2>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Subject selector */}
                <div className="space-y-2">
                  <label className="input-label">Subject</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'commission', label: 'Commission a Painting' },
                      { id: 'inquiry',    label: 'General Inquiry' },
                      { id: 'framing',    label: 'Framing & Mounting' },
                      { id: 'wholesale',  label: 'Corporate & Wedding Gifting' },
                    ].map(s => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setFormData({ ...formData, subject: s.id })}
                        className="badge transition-colors cursor-pointer"
                        style={{
                          background: formData.subject === s.id ? 'var(--vermilion)' : 'var(--ivory)',
                          color: formData.subject === s.id ? 'var(--ivory)' : 'var(--ink-muted)',
                          border: `1px solid ${formData.subject === s.id ? 'var(--vermilion)' : 'var(--hairline)'}`,
                          fontSize: '0.7rem',
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Your Name *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder="e.g. Radhika Sharma"
                    />
                  </div>
                  <div>
                    <label className="input-label">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="radhika@example.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="input-label">Phone / WhatsApp (optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                {formData.subject === 'commission' && (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 relative"
                    style={{
                      background: 'var(--ivory)',
                      border: '1px solid var(--hairline-soft)',
                      borderRadius: '2px',
                    }}
                  >
                    <div>
                      <label className="input-label">Desired Dimensions</label>
                      <select
                        value={formData.dimensions}
                        onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                        className="input"
                      >
                        <option>12×16 in (Small)</option>
                        <option>18×24 in (Medium)</option>
                        <option>24×36 in (Large)</option>
                        <option>Custom Size (Specify in message)</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Budget Range (₹)</label>
                      <select
                        value={formData.budget}
                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                        className="input"
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
                  <label className="input-label">Message / Motif Request *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="input min-h-[140px] resize-y"
                    placeholder={formData.subject === 'commission'
                      ? 'Describe the theme, deities, fish, peacocks, tree of life, or personal story you want painted…'
                      : 'How can we help you?'
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending to Natasha…</>
                  ) : (
                    <><Send size={14} /> Send Message to Studio</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ─── Contact Info ────────────────────────────────────────── */}
          <aside className="lg:col-span-5 space-y-6">
            <div
              className="p-6 space-y-6 relative"
              style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
            >
              <MithilaMotif type="four-corners" color="rgba(176,48,32,0.08)" />
              <h3 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                Studio Contact Details
              </h3>

              <div className="space-y-5">
                {[
                  { icon: Mail,    label: 'Email',    val: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
                  { icon: Phone,   label: 'Phone / WhatsApp', val: `${siteConfig.contact.displayPhone}`, href: siteConfig.contact.whatsappLink },
                  { icon: MapPin,  label: 'Studio Location', val: siteConfig.origin },
                  { icon: Clock,   label: 'Studio Hours',    val: 'Mon–Sat, 10:00 AM – 7:00 PM IST' },
                  { icon: Globe,   label: 'Shipping', val: 'Pan-India Insured Express Courier' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3.5">
                    <div
                      className="p-2 rounded-sm shrink-0 mt-0.5"
                      style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)' }}
                    >
                      <item.icon size={15} style={{ color: 'var(--vermilion)' }} />
                    </div>
                    <div>
                      <p className="text-eyebrow" style={{ color: 'var(--ink-muted)', letterSpacing: '0.12em' }}>
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="font-ui text-body-sm hover:underline font-medium"
                          style={{ color: 'var(--ink)' }}
                        >
                          {item.val}
                        </a>
                      ) : (
                        <p className="font-ui text-body-sm font-medium" style={{ color: 'var(--ink)' }}>
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
