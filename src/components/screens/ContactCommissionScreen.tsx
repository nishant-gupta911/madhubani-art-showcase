import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Send, CheckCircle, MessageCircle, Clock, Globe } from 'lucide-react';
import { MithilaMotif } from '../MithilaMotif';

export const ContactCommissionScreen: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('commission');

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--night)', color: 'var(--ivory)', borderBottom: '1px solid var(--hairline-dark)' }} className="py-12">
        <div className="container space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-px" style={{ background: 'rgba(250,246,239,0.3)' }} />
            <span className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.5)', letterSpacing: '0.18em' }}>
              Direct Studio Access
            </span>
          </div>
          <h1 className="font-display font-bold text-headline" style={{ color: 'var(--ivory)' }}>
            Commission &amp; Inquiries
          </h1>
          <p className="text-body-sm" style={{ color: 'rgba(250,246,239,0.6)', maxWidth: '520px' }}>
            Commission a bespoke original painting, enquire about custom framing, or ask about authentication provenance. The studio team responds within 24 hours.
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
                <h2 className="font-display font-bold text-title" style={{ color: 'var(--ink)' }}>Message Sent!</h2>
                <p className="text-body-sm max-w-sm mx-auto" style={{ color: 'var(--ink-soft)' }}>
                  The Mithila Atelier studio has received your message and will reply personally within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div
                className="p-6 space-y-6 relative"
                style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
              >
                <MithilaMotif type="four-corners" color="rgba(176,48,32,0.08)" />
                <h2 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                  Send a Message
                </h2>

                {/* Subject selector */}
                <div className="space-y-2">
                  <label className="input-label">Subject</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'commission', label: 'Commission a Painting' },
                      { id: 'inquiry',    label: 'General Inquiry' },
                      { id: 'framing',    label: 'Framing & Mounting' },
                      { id: 'wholesale',  label: 'Gallery & Wholesale' },
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSubject(s.id)}
                        className="badge transition-colors cursor-pointer"
                        style={{
                          background: subject === s.id ? 'var(--vermilion)' : 'var(--ivory)',
                          color: subject === s.id ? 'var(--ivory)' : 'var(--ink-muted)',
                          border: `1px solid ${subject === s.id ? 'var(--vermilion)' : 'var(--hairline)'}`,
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
                    <label className="input-label">Your Name</label>
                    <input className="input" placeholder="Arjun Sharma" />
                  </div>
                  <div>
                    <label className="input-label">Email Address</label>
                    <input className="input" type="email" placeholder="arjun@example.com" />
                  </div>
                  <div>
                    <label className="input-label">Phone (optional)</label>
                    <input className="input" type="tel" placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="input-label">Country</label>
                    <select className="input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1209\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}>
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Australia</option>
                      <option>Japan</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {subject === 'commission' && (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 relative"
                    style={{
                      background: 'var(--ivory)',
                      border: '1px solid var(--hairline-soft)',
                      borderRadius: '2px',
                    }}
                  >
                    <div>
                      <label className="input-label">Preferred Style</label>
                      <select className="input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1209\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}>
                        <option>Bharni (Bold solid fills)</option>
                        <option>Kachni (Fine parallel lines)</option>
                        <option>Tantrik (Cosmic geometry)</option>
                        <option>Godna (Folk tattoo motifs)</option>
                        <option>Kohbar (Sacred nuptial symbols)</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Desired Dimensions</label>
                      <select className="input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1209\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}>
                        <option>12×16 in (Small)</option>
                        <option>18×24 in (Medium)</option>
                        <option>24×36 in (Large)</option>
                        <option>Custom Size (Specify below)</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Budget Range (₹)</label>
                      <select className="input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1209\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}>
                        <option>₹2,000 – ₹5,000</option>
                        <option>₹5,000 – ₹10,000</option>
                        <option>₹10,000 – ₹25,000</option>
                        <option>Above ₹25,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Delivery Timeline</label>
                      <select className="input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1209\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}>
                        <option>Flexible</option>
                        <option>Within 1 month</option>
                        <option>Within 2 weeks (Rush)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="input-label">Message</label>
                  <textarea
                    className="input min-h-[140px] resize-y"
                    placeholder={subject === 'commission'
                      ? 'Describe the theme, deities, fish, peacocks, or personal story you want painted…'
                      : 'Write your inquiry detail here…'
                    }
                  />
                </div>

                <button
                  onClick={() => setSubmitted(true)}
                  className="btn btn-primary btn-lg w-full justify-center"
                >
                  <Send size={14} /> Send Message to Studio
                </button>
              </div>
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
                Studio Contact
              </h3>

              <div className="space-y-5">
                {[
                  { icon: Mail,    label: 'Email',    val: 'studio@mithilaatelier.com' },
                  { icon: Phone,   label: 'Phone',    val: '+91 92345 67890 (WhatsApp)' },
                  { icon: MapPin,  label: 'Location', val: 'Jitwarpur Village, Madhubani District, Bihar 847226' },
                  { icon: Clock,   label: 'Hours',    val: 'Mon–Sat, 9:00 AM – 6:00 PM IST' },
                  { icon: Globe,   label: 'Ships to', val: 'Worldwide · Archival insured shipping' },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full"
                      style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)' }}
                    >
                      <Icon size={14} style={{ color: 'var(--vermilion)' }} />
                    </div>
                    <div>
                      <p className="text-caption" style={{ color: 'var(--ink-dim)' }}>{label}</p>
                      <p className="text-body-sm font-semibold mt-0.5" style={{ color: 'var(--ink-soft)' }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div
              className="w-full h-48 flex items-center justify-center relative overflow-hidden"
              style={{
                borderRadius: '4px',
                border: '1px solid var(--hairline-soft)',
                background: 'var(--ivory-deep)',
                backgroundImage: 'repeating-linear-gradient(0deg, var(--hairline-soft) 0, var(--hairline-soft) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--hairline-soft) 0, var(--hairline-soft) 1px, transparent 1px, transparent 40px)',
              }}
            >
              <div className="text-center space-y-2 relative z-10">
                <MapPin className="h-8 w-8 mx-auto" style={{ color: 'var(--vermilion)' }} />
                <p className="font-display font-semibold text-body" style={{ color: 'var(--ink)' }}>Jitwarpur, Madhubani</p>
                <p className="text-caption" style={{ color: 'var(--ink-dim)' }}>Bihar, India · 26.36°N, 86.07°E</p>
              </div>
            </div>

            {/* Social Links */}
            <div
              className="p-5 space-y-4"
              style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
            >
              <p className="text-eyebrow" style={{ color: 'var(--ink-muted)' }}>Follow the Studio</p>
              <div className="flex gap-2">
                {[
                  { icon: Instagram, label: 'Instagram', handle: '@mithilaatelier', link: '#' },
                  { icon: Facebook,  label: 'Facebook',  handle: 'mithila.atelier', link: '#' },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.link}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 transition-all duration-200"
                      style={{
                        background: 'var(--ivory)',
                        border: '1px solid var(--hairline)',
                        borderRadius: '3px',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--vermilion)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hairline)'}
                    >
                      <Icon size={16} style={{ color: 'var(--vermilion)' }} />
                      <span className="text-caption font-semibold" style={{ color: 'var(--ink-soft)' }}>{s.label}</span>
                      <span className="text-[10px]" style={{ color: 'var(--ink-dim)' }}>{s.handle}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
