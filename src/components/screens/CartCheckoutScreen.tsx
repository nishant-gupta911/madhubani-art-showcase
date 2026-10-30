import React, { useState } from 'react';
import { CartItem, MadhubaniProduct, Order } from '../../types';
import { ShoppingBag, Trash2, Package, Truck, ShieldCheck, ChevronRight, ArrowLeft, ArrowRight, X, Check, CreditCard, Smartphone } from 'lucide-react';
import { MithilaMotif } from '../MithilaMotif';

interface CartCheckoutScreenProps {
  cart: CartItem[];
  orders: Order[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onNavigateToShop: () => void;
  onSelectProduct: (p: MadhubaniProduct) => void;
}

type Step = 'cart' | 'address' | 'payment';

export const CartCheckoutScreen: React.FC<CartCheckoutScreenProps> = ({
  cart, orders, onUpdateQuantity, onRemoveItem, onCheckout, onNavigateToShop, onSelectProduct,
}) => {
  const [step, setStep] = useState<Step>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [agreed, setAgreed] = useState(false);

  const subtotal  = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping  = subtotal >= 1999 ? 0 : 149;
  const gst       = Math.round(subtotal * 0.05);
  const total     = subtotal + shipping + gst;

  const STEPS: { id: Step; label: string }[] = [
    { id: 'cart',    label: 'Collection Bag' },
    { id: 'address', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
  ];

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--night)', color: 'var(--ivory)', borderBottom: '1px solid var(--hairline-dark)' }} className="py-10">
        <div className="container space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-px" style={{ background: 'rgba(250,246,239,0.3)' }} />
            <span className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.5)', letterSpacing: '0.18em' }}>
              Checkout
            </span>
          </div>
          <h1 className="font-display font-bold text-headline" style={{ color: 'var(--ivory)' }}>
            Your Curated Collection
          </h1>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 pt-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => step !== 'payment' && setStep(s.id)}
                  className="flex items-center gap-2 text-ui transition-colors text-left"
                  style={{
                    color: step === s.id ? 'var(--ivory)' : 'rgba(250,246,239,0.4)',
                  }}
                  disabled={step === 'payment'}
                >
                  <span
                    className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all"
                    style={{
                      background: step === s.id ? 'var(--vermilion)' :
                        STEPS.indexOf(STEPS.find(x => x.id === step)!) > i ? 'var(--leaf)' : 'rgba(250,246,239,0.1)',
                      color: 'var(--ivory)',
                    }}
                  >
                    {STEPS.indexOf(STEPS.find(x => x.id === step)!) > i ? <Check size={10} /> : i + 1}
                  </span>
                  <span>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <span
                    className="flex-1 h-px max-w-[3rem]"
                    style={{ background: 'rgba(250,246,239,0.15)' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-10">
        {cart.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 space-y-6">
            <div className="flex justify-center opacity-30">
              <MithilaMotif type="lotus-divider" color="var(--vermilion)" width={200} />
            </div>
            <h2 className="font-display font-bold text-title" style={{ color: 'var(--ink)' }}>
              Your collection bag is empty
            </h2>
            <p className="text-body" style={{ color: 'var(--ink-muted)' }}>
              Begin curating your Mithila collection today.
            </p>
            <button onClick={onNavigateToShop} className="btn btn-primary btn-lg">
              Explore Artworks <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">

            {/* ─── Left: Main Content ───────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* STEP: CART */}
              {step === 'cart' && (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-4 relative"
                      style={{
                        background: 'var(--ivory-deep)',
                        border: '1px solid var(--hairline-soft)',
                        borderRadius: '4px',
                      }}
                    >
                      <MithilaMotif type="four-corners" color="rgba(176,48,32,0.08)" />

                      {/* Artwork thumb */}
                      <div
                        className="shrink-0 w-24 h-24 overflow-hidden cursor-pointer"
                        style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)' }}
                        onClick={() => onSelectProduct(item.product)}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-1 min-w-0 flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="badge badge-warm mb-1">{item.product.style}</span>
                              <h4
                                onClick={() => onSelectProduct(item.product)}
                                className="font-display font-semibold line-clamp-2 cursor-pointer hover:text-vermilion transition-colors"
                                style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: '1.3' }}
                              >
                                {item.product.title}
                              </h4>
                            </div>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-ink-muted hover:text-vermilion transition-colors shrink-0 p-1"
                              aria-label="Remove item"
                            >
                              <X size={15} />
                            </button>
                          </div>
                          <p className="text-caption mt-1" style={{ color: 'var(--ink-dim)' }}>
                            {item.product.dimensions}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Qty control */}
                          <div
                            className="flex items-center"
                            style={{ border: '1px solid var(--hairline)', background: 'var(--ivory)', borderRadius: '2px' }}
                          >
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-vermilion hover:text-ivory transition-colors text-base font-light"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-ui font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 flex items-center justify-center hover:bg-vermilion hover:text-ivory transition-colors text-base font-light disabled:opacity-35"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-display font-semibold" style={{ color: 'var(--ink)', fontSize: '1rem' }}>
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button onClick={onNavigateToShop} className="btn btn-outline btn-lg order-2 sm:order-1 flex-1">
                      <ArrowLeft size={14} /> Continue Shopping
                    </button>
                    <button onClick={() => setStep('address')} className="btn btn-primary btn-lg order-1 sm:order-2 flex-1 justify-center">
                      Shipping Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: ADDRESS */}
              {step === 'address' && (
                <div
                  className="p-6 space-y-6 relative"
                  style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                >
                  <MithilaMotif type="four-corners" color="var(--vermilion)" />
                  <h2 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                    Delivery Address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'First Name', placeholder: 'Arjun' },
                      { label: 'Last Name',  placeholder: 'Sharma' },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="input-label">{f.label}</label>
                        <input className="input" placeholder={f.placeholder} />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="input-label">Email Address</label>
                      <input className="input" type="email" placeholder="arjun@example.com" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label">Flat / Building / Street</label>
                      <input className="input" placeholder="B-204, Lotus Apartments, MG Road" />
                    </div>
                    {[
                      { label: 'City',       placeholder: 'Mumbai' },
                      { label: 'PIN Code',   placeholder: '400001' },
                      { label: 'State',      placeholder: 'Maharashtra' },
                      { label: 'Phone',      placeholder: '+91 9876543210' },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="input-label">{f.label}</label>
                        <input className="input" placeholder={f.placeholder} />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setStep('cart')} className="btn btn-outline btn-lg flex-1 justify-center">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={() => setStep('payment')} className="btn btn-primary btn-lg flex-1 justify-center">
                      Payment <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: PAYMENT */}
              {step === 'payment' && (
                <div className="space-y-4">
                  <div
                    className="p-6 space-y-6 relative"
                    style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                  >
                    <MithilaMotif type="four-corners" color="var(--vermilion)" />
                    <h2 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                      Payment Method
                    </h2>

                    <div className="space-y-2">
                      {[
                        { id: 'card', icon: CreditCard, label: 'Credit / Debit Card' },
                        { id: 'upi',  icon: Smartphone, label: 'UPI / Google Pay / PhonePe' },
                        { id: 'cod',  icon: Package,    label: 'Cash on Delivery' },
                      ].map(({ id, icon: Icon, label }) => (
                        <label
                          key={id}
                          className="flex items-center gap-4 p-4 cursor-pointer border transition-all"
                          style={{
                            borderColor: paymentMethod === id ? 'var(--vermilion)' : 'var(--hairline)',
                            background: paymentMethod === id ? 'var(--vermilion-tint)' : 'var(--ivory)',
                            borderRadius: '3px',
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === id}
                            onChange={() => setPaymentMethod(id as any)}
                            className="accent-vermilion"
                          />
                          <Icon size={16} style={{ color: 'var(--ink-muted)' }} />
                          <span className="text-ui font-semibold" style={{ color: 'var(--ink)' }}>{label}</span>
                        </label>
                      ))}
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="input-label">Card Number</label>
                          <input className="input" placeholder="4242 4242 4242 4242" maxLength={19} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="input-label">Expiry</label>
                            <input className="input" placeholder="MM / YY" />
                          </div>
                          <div>
                            <label className="input-label">CVV</label>
                            <input className="input" placeholder="•••" maxLength={4} />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="pt-2">
                        <label className="input-label">UPI ID</label>
                        <input className="input" placeholder="yourname@upi" />
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="badge badge-warm p-3 text-xs leading-normal">
                        ₹50 cash handling fee will be added at delivery.
                      </div>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer text-caption pt-4" style={{ color: 'var(--ink-muted)' }}>
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="accent-vermilion mt-0.5 shrink-0"
                      />
                      <span>I agree to the Terms of Service and understand all sales of original artworks are final.</span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('address')} className="btn btn-outline btn-lg flex-1 justify-center">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      onClick={onCheckout}
                      disabled={!agreed}
                      className="btn btn-primary btn-lg flex-1 justify-center disabled:opacity-40"
                    >
                      <ShieldCheck size={14} /> Place Order · ₹{total.toLocaleString('en-IN')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Right: Order Summary ────────────────────────────── */}
            <aside className="lg:sticky lg:top-24 space-y-4">
              <div
                className="p-5 space-y-5"
                style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
              >
                <h3 className="text-eyebrow" style={{ color: 'var(--ink-muted)' }}>Order Summary</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 shrink-0 overflow-hidden"
                        style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)' }}
                      >
                        <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold line-clamp-1" style={{ color: 'var(--ink)' }}>{item.product.title}</p>
                        <p className="text-caption" style={{ color: 'var(--ink-dim)' }}>Qty: {item.quantity}</p>
                      </div>
                      <p className="text-body-sm font-bold shrink-0" style={{ color: 'var(--ink)' }}>
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <hr style={{ borderColor: 'var(--hairline-soft)' }} />

                <div className="space-y-2 text-body-sm">
                  {[
                    { label: 'Subtotal', val: `₹${subtotal.toLocaleString('en-IN')}` },
                    { label: 'Shipping', val: shipping === 0 ? 'FREE' : `₹${shipping}` },
                    { label: 'GST (5%)', val: `₹${gst.toLocaleString('en-IN')}` },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between" style={{ color: 'var(--ink-muted)' }}>
                      <span>{r.label}</span>
                      <span className={shipping === 0 && r.label === 'Shipping' ? 'text-leaf font-bold' : 'font-semibold'} style={{ color: shipping === 0 && r.label === 'Shipping' ? 'var(--leaf)' : 'var(--ink)' }}>
                        {r.val}
                      </span>
                    </div>
                  ))}
                  <hr style={{ borderColor: 'var(--hairline-soft)' }} />
                  <div className="flex justify-between font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div
                    className="flex items-center gap-2.5 py-2.5 px-3"
                    style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)', borderRadius: '2px' }}
                  >
                    <Truck size={14} style={{ color: 'var(--leaf)', flexShrink: 0 }} />
                    <span className="text-caption font-semibold" style={{ color: 'var(--leaf)' }}>
                      Free express shipping applied
                    </span>
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div
                className="p-4 space-y-3"
                style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
              >
                {[
                  { icon: ShieldCheck, text: '256-bit secure SSL encrypted payment' },
                  { icon: Package,     text: 'Museum-grade archival packing case' },
                  { icon: Truck,       text: 'Blue Dart fully insured express shipping' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon size={14} style={{ color: 'var(--vermilion)', flexShrink: 0 }} />
                    <span className="text-caption" style={{ color: 'var(--ink-muted)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
