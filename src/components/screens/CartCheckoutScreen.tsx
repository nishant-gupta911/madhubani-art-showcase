'use client';

import React, { useState } from 'react';
import { CartItem, MadhubaniProduct, Order } from '../../types';
import {
  ShoppingBag, Trash2, Package, Truck, ShieldCheck, ChevronRight,
  ArrowLeft, ArrowRight, X, Check, CreditCard, Smartphone, Gift,
  AlertCircle, RefreshCw, ExternalLink
} from 'lucide-react';
import { MithilaMotif } from '../MithilaMotif';
import { siteConfig } from '../../config/site';

interface CartCheckoutScreenProps {
  cart: CartItem[];
  orders: Order[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (orderInfo: { number: string; total: number }) => void;
  onNavigateToShop: () => void;
  onSelectProduct: (p: MadhubaniProduct) => void;
}

type Step = 'cart' | 'address' | 'payment';

export const CartCheckoutScreen: React.FC<CartCheckoutScreenProps> = ({
  cart,
  orders,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onNavigateToShop,
  onSelectProduct,
}) => {
  const [step, setStep] = useState<Step>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [agreed, setAgreed] = useState(false);

  // Gift options
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Shipping Address Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');

  // Loading & Processing States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // COD OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  // Calculations in Rupees & Paise
  const subtotalPaise = cart.reduce((sum, item) => sum + item.product.price * 100 * item.quantity, 0);
  const hasPainting = cart.some(item => item.product.category === 'paintings');
  const isFreeShipping = hasPainting || subtotalPaise >= siteConfig.shipping.freeShippingThresholdPaise || subtotalPaise === 0;
  const shippingFeePaise = isFreeShipping ? 0 : siteConfig.shipping.standardShippingFeePaise;
  const giftWrapFeePaise = isGiftWrapped ? siteConfig.shipping.giftWrappingFeePaise : 0;
  const codFeePaise = paymentMethod === 'cod' ? siteConfig.shipping.codConvenienceFeePaise : 0;

  const totalPaise = subtotalPaise + shippingFeePaise + giftWrapFeePaise + codFeePaise;

  const subtotal = subtotalPaise / 100;
  const shipping = shippingFeePaise / 100;
  const giftWrap = giftWrapFeePaise / 100;
  const codFee = codFeePaise / 100;
  const total = totalPaise / 100;

  const STEPS: { id: Step; label: string }[] = [
    { id: 'cart', label: 'Art Bag' },
    { id: 'address', label: 'Delivery' },
    { id: 'payment', label: 'Payment & Confirm' },
  ];

  const validateAddress = () => {
    if (!firstName.trim() || !phone.trim() || !email.trim() || !street.trim() || !city.trim() || !stateName.trim() || !pincode.trim()) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !['6', '7', '8', '9'].includes(cleanPhone[0])) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return false;
    }
    const cleanPincode = pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit PIN code.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateAddress()) {
      setStep('payment');
    }
  };

  // ─── CHECKOUT EXECUTION ───────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      setStep('address');
      return;
    }
    if (!agreed) {
      setErrorMessage('Please agree to the Terms of Service to proceed.');
      return;
    }

    if (paymentMethod === 'cod' && subtotalPaise > siteConfig.shipping.codMaxThresholdPaise) {
      setErrorMessage('Cash on Delivery is only available for orders up to ₹3,000. Please select Prepaid.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const cleanPincode = pincode.replace(/\D/g, '');

      const payload = {
        customer: {
          name: `${firstName} ${lastName}`.trim(),
          phone: cleanPhone,
          email: email.trim(),
        },
        shippingAddress: {
          line1: street.trim(),
          line2: landmark.trim() || undefined,
          city: city.trim(),
          state: stateName.trim(),
          pincode: cleanPincode,
        },
        items: cart.map(it => ({
          productId: it.product.ref || it.product.id,
          qty: it.quantity,
          framing: it.framing,
        })),
        paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
        giftWrap: isGiftWrapped,
        giftNote: isGiftWrapped ? giftNote : undefined,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      // CASE 1: CASH ON DELIVERY (Initiate Phone OTP)
      if (paymentMethod === 'cod') {
        setPendingOrderId(data.orderId);
        setIsSendingOtp(true);
        // Request OTP for phone verification
        const otpRes = await fetch('/api/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanPhone, purpose: 'cod_verification' }),
        });
        const otpData = await otpRes.json();
        setIsSendingOtp(false);

        if (otpRes.ok) {
          setShowOtpModal(true);
          setOtpMessage(otpData.devOtp ? `(Test Mode OTP: ${otpData.devOtp})` : 'OTP sent via SMS');
        } else {
          throw new Error(otpData.error || 'Failed to dispatch phone verification OTP');
        }
        return;
      }

      // CASE 2: PREPAID (Razorpay Checkout Modal)
      // Dynamically load Razorpay checkout script only when user proceeds to online payment
      let isRazorpayLoaded = typeof (window as any).Razorpay !== 'undefined';
      if (!isRazorpayLoaded) {
        await new Promise<boolean>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
        isRazorpayLoaded = typeof (window as any).Razorpay !== 'undefined';
      }

      if (isRazorpayLoaded && data.razorpayOrderId && !data.razorpayOrderId.startsWith('order_sim_')) {
        const options = {
          key: data.keyId,
          amount: data.totalPaise,
          currency: 'INR',
          name: siteConfig.name,
          description: `Order ${data.orderId}`,
          image: '/vernika-enterprises.png',
          order_id: data.razorpayOrderId,
          prefill: {
            name: `${firstName} ${lastName}`.trim(),
            email: email.trim(),
            contact: cleanPhone,
          },
          theme: {
            color: '#B03020',
          },
          handler: async (response: any) => {
            // Verify signature on server
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              onCheckout({ number: data.orderId, total });
            } else {
              alert(verifyData.error || 'Payment verification failed');
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Test / Simulated mode fallback
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: data.razorpayOrderId,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: 'test_signature_valid',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          onCheckout({ number: data.orderId, total });
        } else {
          onCheckout({ number: data.orderId, total });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── VERIFY COD OTP ────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      alert('Please enter the 6-digit OTP code');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: otpCode.trim(),
          orderId: pendingOrderId,
          purpose: 'cod_verification',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }
      setShowOtpModal(false);
      onCheckout({ number: pendingOrderId, total });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--night)', color: 'var(--ivory)', borderBottom: '1px solid var(--hairline-dark)' }} className="py-10">
        <div className="container space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-px" style={{ background: 'rgba(250,246,239,0.3)' }} />
            <span className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.5)', letterSpacing: '0.18em' }}>
              Vernika Enterprises Checkout
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
                  onClick={() => setStep(s.id)}
                  className="flex items-center gap-2 text-ui transition-colors text-left"
                  style={{
                    color: step === s.id ? 'var(--ivory)' : 'rgba(250,246,239,0.75)',
                  }}
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
              Your art bag is currently empty
            </h2>
            <p className="text-body" style={{ color: 'var(--ink-muted)' }}>
              Explore Natasha Gupta's handpainted Madhubani originals, dupattas, and handcrafted lifestyle bags.
            </p>
            <button onClick={onNavigateToShop} className="btn btn-primary btn-lg">
              Explore Artworks <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            {/* ─── Left: Main Content ───────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: CART */}
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

                      <div
                        className="shrink-0 w-24 h-24 overflow-hidden cursor-pointer rounded"
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

                  {/* Gift Wrap Option */}
                  <div className="p-4 rounded border border-ivory-dimmed bg-ivory-deep/80 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isGiftWrapped}
                        onChange={e => setIsGiftWrapped(e.target.checked)}
                        className="accent-vermilion w-4 h-4"
                      />
                      <Gift size={16} className="text-vermilion" />
                      <span className="text-xs font-medium text-ink">
                        Add Handcrafted Gift Wrapping & Handwritten Note (+₹99)
                      </span>
                    </label>

                    {isGiftWrapped && (
                      <div>
                        <textarea
                          rows={2}
                          maxLength={200}
                          placeholder="Enter your personal message for the recipient (up to 200 characters)..."
                          value={giftNote}
                          onChange={e => setGiftNote(e.target.value)}
                          className="w-full text-xs p-2.5 rounded border border-gray-300 focus:outline-none focus:border-vermilion"
                        />
                      </div>
                    )}
                  </div>

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

              {/* STEP 2: ADDRESS */}
              {step === 'address' && (
                <div
                  className="p-6 space-y-6 relative"
                  style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                >
                  <MithilaMotif type="four-corners" color="var(--vermilion)" />
                  <h2 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                    Shipping Address (India Delivery)
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">First Name *</label>
                      <input
                        className="input"
                        placeholder="Arjun"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">Last Name</label>
                      <input
                        className="input"
                        placeholder="Sharma"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="input-label">Email Address (for order tracking) *</label>
                      <input
                        className="input"
                        type="email"
                        placeholder="arjun@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="input-label">Mobile Number (10 digits) *</label>
                      <input
                        className="input"
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="input-label">House / Flat / Street Address *</label>
                      <input
                        className="input"
                        placeholder="B-204, Lotus Enclave, MG Road"
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="input-label">City *</label>
                      <input
                        className="input"
                        placeholder="Mumbai"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="input-label">PIN Code (6 digits) *</label>
                      <input
                        className="input"
                        maxLength={6}
                        placeholder="400001"
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="input-label">State *</label>
                      <input
                        className="input"
                        placeholder="Maharashtra"
                        value={stateName}
                        onChange={e => setStateName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="input-label">Landmark (Optional)</label>
                      <input
                        className="input"
                        placeholder="Near City Mall"
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setStep('cart')} className="btn btn-outline btn-lg flex-1 justify-center">
                      <ArrowLeft size={14} /> Back to Bag
                    </button>
                    <button onClick={handleProceedToPayment} className="btn btn-primary btn-lg flex-1 justify-center">
                      Continue to Payment <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT & CONFIRM */}
              {step === 'payment' && (
                <div className="space-y-4">
                  <div
                    className="p-6 space-y-6 relative"
                    style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                  >
                    <MithilaMotif type="four-corners" color="var(--vermilion)" />
                    <h2 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                      Select Payment Method
                    </h2>

                    <div className="space-y-3">
                      {/* Option 1: Prepaid */}
                      <label
                        className="flex items-start gap-4 p-4 cursor-pointer border transition-all rounded"
                        style={{
                          borderColor: paymentMethod === 'razorpay' ? 'var(--vermilion)' : 'var(--hairline)',
                          background: paymentMethod === 'razorpay' ? 'var(--vermilion-tint)' : 'var(--ivory)',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="accent-vermilion mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-ui font-semibold text-ink">Online Payment (UPI, Cards, NetBanking)</span>
                            <span className="text-[10px] font-bold text-leaf bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              RECOMMENDED
                            </span>
                          </div>
                          <p className="text-xs text-ink-muted mt-0.5">
                            Instant confirmation. Zero extra fees. 100% encrypted via Razorpay.
                          </p>
                        </div>
                      </label>

                      {/* Option 2: Cash on Delivery */}
                      <label
                        className="flex items-start gap-4 p-4 cursor-pointer border transition-all rounded"
                        style={{
                          borderColor: paymentMethod === 'cod' ? 'var(--vermilion)' : 'var(--hairline)',
                          background: paymentMethod === 'cod' ? 'var(--vermilion-tint)' : 'var(--ivory)',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-vermilion mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-ui font-semibold text-ink">Cash on Delivery (COD)</span>
                            <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              +₹49 handling fee
                            </span>
                          </div>
                          <p className="text-xs text-ink-muted mt-0.5">
                            Pay in cash or UPI upon delivery. Requires mobile OTP verification. Available for orders up to ₹3,000.
                          </p>
                        </div>
                      </label>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer text-caption pt-3 text-ink-muted">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="accent-vermilion mt-0.5 shrink-0"
                      />
                      <span>
                        I agree to the Terms of Service. Handpainted original pieces are unique works of art crafted with museum-grade care.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('address')} className="btn btn-outline btn-lg flex-1 justify-center">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!agreed || isSubmitting}
                      className="btn btn-primary btn-lg flex-1 justify-center disabled:opacity-40"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="animate-spin" size={14} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          <span>Place Order · ₹{total.toLocaleString('en-IN')}</span>
                        </>
                      )}
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
                        className="w-12 h-12 shrink-0 overflow-hidden rounded"
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
                  <div className="flex justify-between" style={{ color: 'var(--ink-muted)' }}>
                    <span>Subtotal (Taxes Included)</span>
                    <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between" style={{ color: 'var(--ink-muted)' }}>
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-leaf font-bold' : 'font-semibold'} style={{ color: shipping === 0 ? 'var(--leaf)' : 'var(--ink)' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>

                  {isGiftWrapped && (
                    <div className="flex justify-between" style={{ color: 'var(--ink-muted)' }}>
                      <span>Gift Wrapping & Note</span>
                      <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                        ₹{giftWrap}
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between" style={{ color: 'var(--ink-muted)' }}>
                      <span>COD Convenience Fee</span>
                      <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                        ₹{codFee}
                      </span>
                    </div>
                  )}

                  <hr style={{ borderColor: 'var(--hairline-soft)' }} />
                  <div className="flex justify-between font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>
                    <span>Total Due</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {isFreeShipping && (
                  <div
                    className="flex items-center gap-2.5 py-2.5 px-3"
                    style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)', borderRadius: '2px' }}
                  >
                    <Truck size={14} style={{ color: 'var(--leaf)', flexShrink: 0 }} />
                    <span className="text-caption font-semibold" style={{ color: 'var(--leaf)' }}>
                      Free insured express delivery applied
                    </span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div
                className="p-4 space-y-3"
                style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
              >
                {[
                  { icon: ShieldCheck, text: '256-bit SSL encrypted checkout' },
                  { icon: Package,     text: 'Museum-grade protective art packaging' },
                  { icon: Truck,       text: 'Insured courier with SMS tracking updates' },
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

      {/* ─── COD PHONE OTP MODAL ─────────────────────────────────────────── */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-lg shadow-xl border border-gray-200">
            <h3 className="font-display font-bold text-lg text-gray-900 text-center">
              Verify Your Phone for COD
            </h3>
            <p className="text-xs text-gray-500 text-center mt-1">
              Please enter the 6-digit verification code sent to <strong>+91 {phone}</strong> to confirm your Cash on Delivery order.
            </p>
            {otpMessage && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded text-center my-3 font-mono">
                {otpMessage}
              </p>
            )}

            <div className="my-4">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center text-xl tracking-widest font-mono p-2.5 border border-gray-300 rounded focus:outline-none focus:border-vermilion"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otpCode.length !== 6}
                className="flex-1 py-2 text-xs bg-vermilion text-white font-medium rounded hover:bg-vermilion-dark disabled:opacity-40"
              >
                {isVerifyingOtp ? 'Verifying...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
