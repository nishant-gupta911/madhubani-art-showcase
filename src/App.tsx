import React, { useState } from 'react';
import { CartItem, MadhubaniProduct, MithilaStyle, Order, ScreenType } from './types';
import madhubaniData from './data/madhubaniProducts.json';
import { HeaderBar } from './components/HeaderBar';
import { HomeScreen } from './components/screens/HomeScreen';
import { ShopGalleryScreen } from './components/screens/ShopGalleryScreen';
import { ProductDetailScreen } from './components/screens/ProductDetailScreen';
import { AboutTraditionScreen } from './components/screens/AboutTraditionScreen';
import { CartCheckoutScreen } from './components/screens/CartCheckoutScreen';
import { ContactCommissionScreen } from './components/screens/ContactCommissionScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AllScreensOverview } from './components/screens/AllScreensOverview';
import { QuickViewModal } from './components/QuickViewModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AuthModal } from './components/AuthModal';
import { MithilaMotif } from './components/MithilaMotif';
import { ArrowRight, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const ALL_PRODUCTS  = madhubaniData.products as MadhubaniProduct[];
const ALL_CATEGORIES = madhubaniData.categories;
const ALL_STYLES    = madhubaniData.styles as MithilaStyle[];

// ─── Premium Footer ───────────────────────────────────────────────────────────
const Footer: React.FC<{ onNavigate: (s: ScreenType) => void }> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
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
                The Collector's Circle
              </p>
              <h3
                className="font-display font-semibold"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', lineHeight: '1.15', letterSpacing: '-0.01em', color: 'var(--ivory)' }}
              >
                Art that tells a story.<br />
                <span style={{ fontStyle: 'italic', color: 'rgba(250,246,239,0.7)' }}>Curated for those who listen.</span>
              </h3>
              <p className="text-body-sm" style={{ color: 'rgba(250,246,239,0.55)', maxWidth: '420px' }}>
                First access to new arrivals, artisan stories, provenance notes, and exclusive commission slots. No noise. Only art.
              </p>
            </div>
            <div>
              {subscribed ? (
                <div
                  className="border rounded-sm py-6 px-8 text-center"
                  style={{ borderColor: 'var(--leaf)', background: 'rgba(58,107,58,0.15)' }}
                >
                  <p className="text-eyebrow mb-2" style={{ color: 'var(--leaf)' }}>You're on the list</p>
                  <p className="text-body-sm" style={{ color: 'rgba(250,246,239,0.65)' }}>
                    Welcome to the circle. Watch your inbox for something beautiful.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input input-dark flex-1"
                      required
                    />
                    <button type="submit" className="btn btn-primary btn-lg whitespace-nowrap">
                      Join
                    </button>
                  </div>
                  <p className="text-caption" style={{ color: 'rgba(250,246,239,0.35)' }}>
                    Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Links ────────────────────────────────────────── */}
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3"
            >
              <div className="brand-mark" style={{ width: '2.75rem', height: '2.75rem', flexBasis: '2.75rem' }}>
                <img src="/vernika-enterprises.png" alt="" />
              </div>
              <div className="text-left leading-none">
                <div
                  className="font-display font-semibold"
                  style={{ fontSize: '1rem', color: 'var(--ivory)', letterSpacing: '-0.01em' }}
                >
                  Mithila Atelier
                </div>
                <div className="text-eyebrow mt-0.5" style={{ fontSize: '0.5rem', color: 'rgba(250,246,239,0.45)' }}>
                  by Vernika Enterprises
                </div>
              </div>
            </button>
            <p className="text-body-sm leading-relaxed" style={{ color: 'rgba(250,246,239,0.5)', maxWidth: '200px' }}>
              Handmade Madhubani paintings directly from master artisan families in Jitwarpur, Bihar.
            </p>
            <div className="flex items-center gap-2.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: 'var(--leaf)' }}
              />
              <span className="text-caption" style={{ color: 'var(--leaf)' }}>
                100% authentic · Zero intermediaries
              </span>
            </div>
          </div>

          {/* Navigate */}
          <div className="space-y-4">
            <p className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.4)', fontSize: '0.6rem' }}>Navigate</p>
            <ul className="space-y-3">
              {[
                { id: 'shop' as ScreenType,        label: 'Shop All Artworks' },
                { id: 'about' as ScreenType,       label: 'Our Heritage' },
                { id: 'contact' as ScreenType,     label: 'Commissions' },
                { id: 'profile' as ScreenType,     label: 'My Collection' },
                { id: 'cart' as ScreenType,        label: 'Cart' },
                { id: 'all-screens' as ScreenType, label: 'Screen Showcase' },
              ].map(l => (
                <li key={l.id}>
                  <button
                    onClick={() => onNavigate(l.id)}
                    className="text-body-sm transition-colors duration-200"
                    style={{ color: 'rgba(250,246,239,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,246,239,0.55)')}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <p className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.4)', fontSize: '0.6rem' }}>Information</p>
            <ul className="space-y-3">
              {['Provenance & Certification', 'Shipping Policy', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service', 'FAQs'].map(l => (
                <li key={l}>
                  <button
                    className="text-body-sm transition-colors duration-200"
                    style={{ color: 'rgba(250,246,239,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,246,239,0.55)')}
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.4)', fontSize: '0.6rem' }}>Contact</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail size={13} style={{ color: 'var(--vermilion)', marginTop: '2px', flexShrink: 0 }} />
                <span className="text-body-sm" style={{ color: 'rgba(250,246,239,0.55)' }}>
                  studio@mithilaatelier.com
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={13} style={{ color: 'var(--vermilion)', marginTop: '2px', flexShrink: 0 }} />
                <span className="text-body-sm" style={{ color: 'rgba(250,246,239,0.55)' }}>
                  +91 92345 67890
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={13} style={{ color: 'var(--vermilion)', marginTop: '2px', flexShrink: 0 }} />
                <span className="text-body-sm leading-relaxed" style={{ color: 'rgba(250,246,239,0.55)' }}>
                  Jitwarpur, Madhubani<br />Bihar 847226, India
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(250,246,239,0.6)' }}
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--hairline-dark)' }}>
        <div className="container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-caption" style={{ color: 'rgba(250,246,239,0.35)' }}>
              © 2026 Mithila Atelier by Vernika Enterprises. All artworks are one-of-one originals.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-caption" style={{ color: 'rgba(250,246,239,0.3)' }}>
                Handcrafted in Bihar
              </span>
              <span style={{ color: 'rgba(250,246,239,0.2)' }}>·</span>
              <span className="text-caption" style={{ color: 'rgba(250,246,239,0.3)' }}>
                Delivered Worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentScreen,     setCurrentScreen]     = useState<ScreenType>('home');
  const [selectedProduct,   setSelectedProduct]   = useState<MadhubaniProduct>(ALL_PRODUCTS[0]);
  const [shopInitialCategory, setShopInitialCategory] = useState<string>('all');
  const [shopInitialStyle,  setShopInitialStyle]  = useState<MithilaStyle | undefined>(undefined);

  const [cart,      setCart]     = useState<CartItem[]>([]);
  const [wishlist,  setWishlist] = useState<string[]>([ALL_PRODUCTS[0].id, ALL_PRODUCTS[5].id]);
  const [orders,    setOrders]   = useState<Order[]>([
    {
      id: 'MITHILA-ORD-9481',
      date: 'Aug 12, 2026',
      status: 'Shipped',
      total: 4890,
      trackingNumber: 'BLUE-DART-IN-884102',
      estimatedDelivery: 'Tomorrow by 3:00 PM',
      items: [{ product: ALL_PRODUCTS[2], quantity: 1 }],
    },
  ]);

  const [quickViewProduct, setQuickViewProduct] = useState<MadhubaniProduct | null>(null);
  const [orderSuccess,     setOrderSuccess]     = useState<{ number: string; total: number } | null>(null);
  const [user,             setUser]             = useState<{ name: string; email: string } | null>(null);
  const [isAuthOpen,       setIsAuthOpen]       = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const addToCart = (p: MadhubaniProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === p.id);
      if (existing) return prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product: p, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.product.id !== id)); return; }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.product.id !== id));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const navigateToShop = (category?: string, style?: MithilaStyle) => {
    setShopInitialCategory(category ?? 'all');
    setShopInitialStyle(style);
    setCurrentScreen('shop');
  };

  const handleSelectProduct = (p: MadhubaniProduct) => {
    setSelectedProduct(p);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    const orderNum = `MITHILA-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = cartTotal + (cartTotal >= 1999 ? 0 : 149) + Math.round(cartTotal * 0.05);
    setOrders(prev => [{
      id: orderNum,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Processing',
      total,
      items: [...cart],
      trackingNumber: '',
      estimatedDelivery: '5–7 business days',
    }, ...prev]);
    setCart([]);
    setOrderSuccess({ number: orderNum, total });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            products={ALL_PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onNavigateToShop={navigateToShop}
            onNavigateToAbout={() => setCurrentScreen('about')}
            onAddToCart={addToCart}
            onQuickView={setQuickViewProduct}
          />
        );
      case 'shop':
        return (
          <ShopGalleryScreen
            products={ALL_PRODUCTS}
            categories={ALL_CATEGORIES}
            styles={ALL_STYLES}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            onAddToCart={addToCart}
            onQuickView={setQuickViewProduct}
            onToggleWishlist={toggleWishlist}
            initialCategory={shopInitialCategory}
            initialStyle={shopInitialStyle}
          />
        );
      case 'detail':
        return (
          <ProductDetailScreen
            product={selectedProduct}
            products={ALL_PRODUCTS}
            wishlist={wishlist}
            cartCount={cartCount}
            onBack={() => setCurrentScreen('shop')}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            onSelectProduct={handleSelectProduct}
            onNavigateToContact={() => setCurrentScreen('contact')}
          />
        );
      case 'about':
        return <AboutTraditionScreen onNavigateToShop={() => navigateToShop()} />;
      case 'cart':
        return (
          <CartCheckoutScreen
            cart={cart}
            orders={orders}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
            onNavigateToShop={() => setCurrentScreen('shop')}
            onSelectProduct={handleSelectProduct}
          />
        );
      case 'contact':
        return <ContactCommissionScreen />;
      case 'profile':
        return (
          <ProfileScreen
            wishlist={wishlist}
            products={ALL_PRODUCTS}
            orders={orders}
            onSelectProduct={handleSelectProduct}
            onNavigateToShop={() => navigateToShop()}
            onRemoveFromWishlist={toggleWishlist}
            user={user}
          />
        );
      case 'all-screens':
        return (
          <AllScreensOverview
            onSelectScreen={setCurrentScreen}
            cartCount={cartCount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--ivory)' }}>
      <HeaderBar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setUser(null)}
      />

      <main className="flex-1">
        {renderScreen()}
      </main>

      <Footer onNavigate={setCurrentScreen} />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(name, email) => setUser({ name, email })}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          wishlist={wishlist}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={p => { addToCart(p); setQuickViewProduct(null); }}
          onToggleWishlist={toggleWishlist}
          onViewFull={p => { handleSelectProduct(p); setQuickViewProduct(null); }}
        />
      )}

      {orderSuccess && (
        <OrderSuccessModal
          orderNumber={orderSuccess.number}
          total={orderSuccess.total}
          onClose={() => setOrderSuccess(null)}
          onContinueShopping={() => { setOrderSuccess(null); navigateToShop(); }}
          onViewOrders={() => { setOrderSuccess(null); setCurrentScreen('profile'); }}
        />
      )}
    </div>
  );
}
