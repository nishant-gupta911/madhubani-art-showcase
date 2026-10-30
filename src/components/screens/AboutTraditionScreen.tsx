import React from 'react';
import { Award, Feather, Leaf, Users, BookOpen, ArrowRight } from 'lucide-react';
import { MithilaMotif, SectionEyebrow } from '../MithilaMotif';

interface AboutTraditionScreenProps {
  onNavigateToShop: () => void;
}

const TIMELINE = [
  { year: '500 BC',      title: 'Royal Commission',        desc: "King Janaka commands the entire Mithila kingdom to be painted for Princess Sita's wedding to Lord Rama, establishing the sacred village art canon." },
  { year: '1934 AD',     title: 'Earthquake Rediscovery',  desc: 'A massive Bihar earthquake destroys homes, exposing the vibrant painted interior walls of Jitwarpur village to British art officer William G. Archer.' },
  { year: '1962 AD',     title: 'Transition to Paper',     desc: 'Pupul Jayakar and Bhaskar Kulkarni introduce paper to Jitwarpur artisans as a drought relief project, transitioning the wall art to a collectible medium.' },
  { year: '1969 AD',     title: 'National Recognition',    desc: "Sita Devi receives the Padma Shri award, honoring Madhubani painters with India's highest civilian recognition for the first time." },
  { year: '2003 AD',     title: 'UNESCO Heritage Listing', desc: 'Madhubani painting is added to the UNESCO Intangible Cultural Heritage list, securing its global value.' },
  { year: 'Present',     title: 'Preserving the Guild',    desc: 'Mithila Atelier connects master artisan families in Bihar directly to collectors worldwide, maintaining zero intermediaries.' },
];

const TECHNIQUES = [
  { icon: Feather, title: 'Bamboo Quill Pens',    desc: 'Thin bamboo twigs wrapped in cotton are the principal tool. Different widths create hairline textures, fill brushes, and double-line borders.' },
  { icon: Leaf,    title: 'Botanical Pigments',   desc: 'Turmeric (yellow), indigo plants (blue), soot (black), marigold (orange), sandalwood (beige), and crushed pomegranate (rose).' },
  { icon: Users,   title: 'Matriarchal Canon',    desc: 'Designs live in the memory of women artisans — no templates or sketches. Transmitted exclusively mother to daughter.' },
  { icon: BookOpen, title: 'Symbolic Language',    desc: 'Every motif carries narrative: lotus for purity, fish for fertility, peacock for divine beauty, and bamboo for the marital bond.' },
];

export const AboutTraditionScreen: React.FC<AboutTraditionScreenProps> = ({ onNavigateToShop }) => {
  return (
    <div style={{ background: 'var(--ivory)', color: 'var(--ink)' }}>

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 'min(78vh, 700px)' }}>
        <div className="absolute inset-0">
          <img
            src="/madu/22.jpeg"
            alt="Kohbar wedding chamber painting"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, var(--ivory) 0%, rgba(250,246,239,0.95) 45%, rgba(250,246,239,0.3) 80%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, var(--ivory) 0%, transparent 60%)',
            }}
          />
        </div>

        <div
          className="relative z-10 container flex flex-col justify-center py-20"
          style={{ minHeight: 'inherit' }}
        >
          <div className="max-w-xl space-y-6 animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px" style={{ background: 'var(--vermilion)' }} />
              <span className="text-eyebrow" style={{ color: 'var(--vermilion)', letterSpacing: '0.18em' }}>
                A Living Cultural Lineage
              </span>
            </div>

            <h1
              className="font-display font-bold leading-none"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', letterSpacing: '-0.02em', color: 'var(--ink)' }}
            >
              The Sacred Heritage of<br />
              <span style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--vermilion)' }}>Mithila Art</span>
            </h1>

            <p className="text-body-lg" style={{ color: 'var(--ink-soft)' }}>
              Born from a royal commission and preserved through unbroken matriarchal inheritance in Bihar, Madhubani painting stands as one of humanity's most resilient living folk traditions.
            </p>

            <button onClick={onNavigateToShop} className="btn btn-primary btn-lg">
              Explore the Archive <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Editorial Quote ────────────────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--ivory-warm)', borderTop: '1px solid var(--hairline-soft)', borderBottom: '1px solid var(--hairline-soft)' }}>
        <div className="container max-w-3xl text-center space-y-4">
          <div className="flex justify-center opacity-30">
            <MithilaMotif type="fish-pair" color="var(--vermilion)" width={80} />
          </div>
          <p
            className="font-display leading-relaxed italic"
            style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)', color: 'var(--ink)' }}
          >
            "Madhubani is not decoration. It is painted theology, ancestral blessing, and illustrated mythology — all encoded into double lines and living earth pigments."
          </p>
          <p className="text-eyebrow" style={{ color: 'var(--ink-muted)' }}>
            — Pupul Jayakar, Art Historian & Cultural Ambassador, 1972
          </p>
        </div>
      </section>

      {/* ─── Timeline ───────────────────────────────────────────────── */}
      <section className="py-24 band-ivory">
        <div className="container space-y-16">
          <div className="text-center">
            <SectionEyebrow
              eyebrow="Historical Record"
              headline="2,500 Years of Continuity"
              align="center"
            />
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline center line (desktop) */}
            <div
              className="absolute left-[3.5rem] md:left-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{ background: 'var(--hairline)' }}
            />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={item.year}
                    className={`flex flex-col md:flex-row items-stretch gap-6 md:gap-12 relative ${
                      isEven ? '' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Year badge */}
                    <div className="md:w-1/2 flex items-center md:justify-end justify-start pr-0 md:pr-6 text-left md:text-right">
                      <div className="space-y-1">
                        <span
                          className="font-display font-bold"
                          style={{ fontSize: '2rem', color: 'var(--vermilion)' }}
                        >
                          {item.year}
                        </span>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-[3.5rem] md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                      <div
                        className="w-3.5 h-3.5 rounded-full border-2"
                        style={{ background: 'var(--ivory)', borderColor: 'var(--vermilion)' }}
                      />
                    </div>

                    {/* Content Box */}
                    <div className="md:w-1/2 pl-0 md:pl-6 flex items-center">
                      <div
                        className="p-6 w-full space-y-2 relative"
                        style={{
                          background: 'var(--ivory-deep)',
                          border: '1px solid var(--hairline-soft)',
                          borderRadius: '4px',
                        }}
                      >
                        <MithilaMotif type="four-corners" color="rgba(176,48,32,0.18)" />
                        <h3 className="font-display font-semibold" style={{ fontSize: '1.25rem', color: 'var(--ink)' }}>
                          {item.title}
                        </h3>
                        <p className="text-body-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Technique Deep-Dive ────────────────────────────────────── */}
      <section
        className="py-24"
        style={{ background: 'var(--night)', color: 'var(--ivory)' }}
      >
        <div className="container space-y-14">
          <SectionEyebrow
            eyebrow="Technical Mastery"
            headline="Tools of the Forest"
            subhead="No chemicals, no machines, no templates. Every brushstroke is made using organic materials and traditional techniques."
            light
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECHNIQUES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="p-6 space-y-4 relative"
                style={{
                  background: 'var(--night-soft)',
                  border: '1px solid rgba(250,246,239,0.08)',
                  borderRadius: '4px',
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-sm"
                  style={{ background: 'rgba(176,48,32,0.2)', border: '1px solid rgba(176,48,32,0.4)' }}
                >
                  <Icon size={18} style={{ color: 'var(--vermilion)' }} />
                </div>
                <h3 className="font-display font-semibold" style={{ fontSize: '1.125rem', color: 'var(--ivory)' }}>
                  {title}
                </h3>
                <p className="text-body-sm leading-relaxed" style={{ color: 'rgba(250,246,239,0.55)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The Making Process ─────────────────────────────────────── */}
      <section className="py-24 band-ivory">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className="relative p-3 bg-ivory-deep"
            style={{ border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
          >
            <MithilaMotif type="four-corners" color="var(--vermilion)" />
            <img
              src="/madu/24.jpeg"
              alt="Godna technique closeup"
              className="w-full h-full object-cover"
              style={{ borderRadius: '2px' }}
            />
          </div>

          <div className="space-y-8">
            <SectionEyebrow
              eyebrow="The Making Process"
              headline="From Earth to Archive"
            />

            <div className="space-y-5">
              {[
                { step: '01', title: 'Paper Preparation',    desc: 'Hand-pressed bamboo pulp sheets are coated in starch water and cow-dung wash, providing natural preservation and character.' },
                { step: '02', title: 'Pigment Extraction',   desc: 'Natural minerals, roots, and soot are simmered and combined with tree gum (gum acacia) binder.' },
                { step: '03', title: 'Border Composition',   desc: 'The iconic border is laid down first, defining the spiritual bounds of the sacred composition.' },
                { step: '04', title: 'Bharni or Kachni Detailing', desc: 'Bold natural ochres are filled in (Bharni) or detailed fine line-hatching is completed (Kachni).' },
                { step: '05', title: 'Curing & Provenance',  desc: 'Paintings dry naturally, then receive standard documentation tags detailing style, origin, and family attribution.' },
              ].map(s => (
                <div key={s.step} className="flex gap-4">
                  <span
                    className="font-display font-semibold text-lg shrink-0"
                    style={{ color: 'var(--vermilion)' }}
                  >
                    {s.step}
                  </span>
                  <div>
                    <h4 className="font-ui font-semibold" style={{ color: 'var(--ink)' }}>{s.title}</h4>
                    <p className="text-body-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────────── */}
      <section
        className="py-24 text-center space-y-6"
        style={{ background: 'var(--ivory-warm)', borderTop: '1px solid var(--hairline-soft)' }}
      >
        <div className="container max-w-xl mx-auto space-y-6">
          <div className="flex justify-center opacity-30">
            <MithilaMotif type="peacock-eye" color="var(--vermilion)" width={36} height={36} />
          </div>
          <h2 className="font-display font-bold text-headline" style={{ color: 'var(--ink)' }}>
            Own a Piece of Living History
          </h2>
          <p className="text-body" style={{ color: 'var(--ink-muted)' }}>
            Every acquisition sustains master artisan families in Bihar directly and guarantees the survival of Mithila's heritage.
          </p>
          <button onClick={onNavigateToShop} className="btn btn-primary btn-lg">
            View all 80 Artworks <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
