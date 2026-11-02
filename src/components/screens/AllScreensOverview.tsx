import React from 'react';
import { ScreenType } from '../../types';
import { 
  Home, 
  Compass, 
  Eye, 
  BookOpen, 
  ShoppingBag, 
  Mail, 
  User, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Layers,
  LayoutGrid
} from 'lucide-react';

interface AllScreensOverviewProps {
  onSelectScreen: (screen: ScreenType) => void;
  cartCount: number;
}

export const AllScreensOverview: React.FC<AllScreensOverviewProps> = ({
  onSelectScreen,
  cartCount,
}) => {
  const screensList: {
    id: ScreenType;
    title: string;
    description: string;
    tag: string;
    icon: React.FC<{ className?: string }>;
    previewImage: string;
    features: string[];
  }[] = [
    {
      id: 'home',
      title: '01. Sanctuary Home',
      description: 'Cinematic full-bleed hero photograph, 4-column telemetry spec cells, Rosso Corsa livery band, 5 Mithila discipline cards, and curated masterpiece showcase.',
      tag: 'HERO SANCTUARY',
      icon: Home,
      previewImage: '/madu/3.jpeg',
      features: ['Full-Bleed Cinema Hero', 'Telemetry Spec Matrix', '5 Lineage Disciplines', 'Curated Masterpiece 4-Up Grid'],
    },
    {
      id: 'shop',
      title: '02. 80 Masterpieces Catalogue',
      description: 'Complete filterable catalogue of 80 original paintings. Live instant search, category filters, style selector, price range, and 3 layout viewing modes.',
      tag: 'COMPLETE 80 ARCHIVE',
      icon: Compass,
      previewImage: '/madu/3.jpeg',
      features: ['All 80 Artworks Loaded', 'Category & Style Filters', 'Instant Search Index', 'Precision Grid, Spotlight & Table Views'],
    },
    {
      id: 'detail',
      title: '03. Artwork Provenance & Detail',
      description: 'High-res zoom inspection lightbox, cultural iconographic provenance, physical specifications, pigment analysis, and related collection works.',
      tag: 'ARTWORK TELEMETRY',
      icon: Eye,
      previewImage: '/madu/24.jpeg',
      features: ['High-Res Scan Lightbox', 'Physical Dimensions & Medium', 'Cultural Legend Provenance', 'Immediate Bag Reservation'],
    },
    {
      id: 'about',
      title: '04. Heritage Craft & Pigments',
      description: '2,500-year historical chronicle of King Janaka royal mandate, botanical pigment alchemy matrix (turmeric, indigo, cinnabar, soot), and horror vacui philosophy.',
      tag: 'HERITAGE & ALCHEMY',
      icon: BookOpen,
      previewImage: '/madu/14.jpeg',
      features: ['Janaka Dynasty Legend', '5 Botanical Pigments Matrix', 'Horror Vacui Philosophy', 'Artisan Lineage Preservation'],
    },
    {
      id: 'cart',
      title: '05. Collection Bag & Checkout',
      description: 'Itemized bag with quantity modifiers, voucher engine (MITHILA10 / ARTISAN15), free air courier shipping, and complete multi-step dispatch checkout.',
      tag: 'ACQUISITION CHECKOUT',
      icon: ShoppingBag,
      previewImage: '/madu/22.jpeg',
      features: ['Item Modifiers & Totals', 'Voucher MITHILA10 & ARTISAN15', 'Courier Destination Details', 'Payment Settlement Protocol'],
    },
    {
      id: 'contact',
      title: '06. Bespoke Atelier Commissions',
      description: 'Custom Madhubani commission request dossier for large-scale wall murals, bridal Kohbar suites, and studio coordinates in Jitwarpur village, Bihar.',
      tag: 'BESPOKE COMMISSIONS',
      icon: Mail,
      previewImage: '/madu/14.jpeg',
      features: ['Custom Canvas & Murals', '3-Stage Commission Execution', 'Studio Address & Phone', 'Direct Intake Dossier'],
    },
    {
      id: 'profile',
      title: '07. Patron Collector Portal',
      description: 'Collector credentials, live shipment telemetry with progress bar, tracking numbers, saved wishlist repository, and collector profile settings.',
      tag: 'PATRON PORTAL',
      icon: User,
      previewImage: '/madu/14.jpeg',
      features: ['Patron Gold Tier Status', 'Live Courier Telemetry', 'Saved Wishlist Gallery', 'Collector Coordinates'],
    },
  ];

  return (
    <div className="min-h-full w-full p-4 sm:p-6 lg:p-8 space-y-10 bg-paper text-ink text-left pb-20">
      {/* 1. Top Architecture Banner */}
      <div className="max-w-7xl mx-auto bg-paper-2 border border-line p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent block">
              EXPERIENCE ARCHITECTURE • 7 ATELIER SCREENS
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-ink uppercase tracking-tight">
              COMPLETE ATELIER INTERFACE ATLAS
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs border border-accent bg-accent/10 text-accent px-2.5 py-1">80 PRODUCTS ACTIVE</span>
            <span className="font-mono text-xs border border-line bg-paper text-ink px-2.5 py-1">ZERO EXTERNAL ASSETS</span>
          </div>
        </div>

        <p className="font-mono text-xs text-ink/70 max-w-3xl leading-relaxed">
          Navigate across the Vernika Enterprises Mithila collection: photography-first surfaces, paper textures, and honest artisan craftsmanship.
        </p>
      </div>

      {/* 2. Screens Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {screensList.map((screen) => {
          const Icon = screen.icon;
          return (
            <div
              key={screen.id}
              className="bg-paper-2 border border-line overflow-hidden group flex flex-col justify-between hover:border-ink hover:shadow-[3px_3px_0_var(--accent)] transition-all"
            >
              <div>
                <div 
                  className="relative aspect-16/10 overflow-hidden bg-paper border-b border-line cursor-pointer"
                  onClick={() => onSelectScreen(screen.id)}
                >
                  <img
                    src={screen.previewImage}
                    alt={screen.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-accent text-paper text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5">
                    {screen.tag}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-accent" />
                    <h3 className="font-display text-lg text-ink uppercase tracking-wide">
                      {screen.title}
                    </h3>
                  </div>

                  <p className="text-xs text-ink/70 leading-relaxed">
                    {screen.description}
                  </p>

                  <div className="pt-2 space-y-1.5">
                    <span className="font-mono text-[10px] text-ink/60 uppercase tracking-wider block">
                      Core Features:
                    </span>
                    <ul className="text-xs text-ink/80 space-y-1 font-mono">
                      {screen.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-accent" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectScreen(screen.id)}
                  className="w-full py-2.5 font-mono text-xs uppercase tracking-widest border border-ink bg-ink text-paper hover:bg-paper hover:text-ink transition-colors cursor-pointer"
                >
                  <span>LAUNCH SCREEN</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
