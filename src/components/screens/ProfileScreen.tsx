import React, { useState } from 'react';
import { MadhubaniProduct, Order } from '../../types';
import {
  User, Package, Heart, Settings, ChevronRight, Star, ShoppingBag, Map, Bell, Edit3, Check
} from 'lucide-react';
import { MithilaMotif } from '../MithilaMotif';

interface ProfileScreenProps {
  wishlist: string[];
  products: MadhubaniProduct[];
  orders: Order[];
  onSelectProduct: (p: MadhubaniProduct) => void;
  onNavigateToShop: () => void;
  onRemoveFromWishlist: (id: string) => void;
  user?: { name: string; email: string } | null;
}

type ProfileTab = 'overview' | 'orders' | 'wishlist' | 'settings';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  wishlist, products, orders, onSelectProduct, onNavigateToShop, onRemoveFromWishlist, user,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const TABS: { id: ProfileTab; label: string; icon: React.FC<any> }[] = [
    { id: 'overview', label: 'Overview',  icon: User },
    { id: 'orders',   label: 'Orders',    icon: Package },
    { id: 'wishlist', label: 'Saved',     icon: Heart },
    { id: 'settings', label: 'Settings',  icon: Settings },
  ];

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--night)', color: 'var(--ivory)', borderBottom: '1px solid var(--hairline-dark)' }} className="py-10">
        <div className="container space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-px" style={{ background: 'rgba(250,246,239,0.3)' }} />
            <span className="text-eyebrow" style={{ color: 'rgba(250,246,239,0.5)', letterSpacing: '0.18em' }}>
              Collector Portal
            </span>
          </div>
          <h1 className="font-display font-bold text-headline" style={{ color: 'var(--ivory)' }}>My Profile</h1>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* ─── Sidebar ──────────────────────────────────────────────── */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Avatar card */}
            <div
              className="p-6 text-center space-y-4 relative"
              style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
            >
              <MithilaMotif type="four-corners" color="rgba(176,48,32,0.08)" />
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'var(--vermilion)' }}
              >
                <span className="text-white text-2xl font-bold">{(user?.name || 'Arjun')[0].toUpperCase()}</span>
                <button
                  className="absolute -bottom-1 -right-1 h-6 w-6 border rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'var(--ivory-deep)', borderColor: 'var(--hairline)' }}
                >
                  <Edit3 size={10} style={{ color: 'var(--ink)' }} />
                </button>
              </div>
              <div>
                <p className="font-display font-semibold text-title" style={{ color: 'var(--ink)', fontSize: '1.25rem' }}>{user?.name || 'Arjun Mehta'}</p>
                <p className="text-caption" style={{ color: 'var(--ink-muted)' }}>{user?.email || 'arjun@example.com'}</p>
              </div>
              <div className="flex justify-center">
                <span className="badge badge-turmeric">PATRON COLLECTOR</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                <div className="py-2" style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)' }}>
                  <p className="font-display font-bold" style={{ fontSize: '1.25rem', color: 'var(--ink)' }}>{orders.length}</p>
                  <p className="text-caption" style={{ color: 'var(--ink-muted)' }}>ORDERS</p>
                </div>
                <div className="py-2" style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)' }}>
                  <p className="font-display font-bold" style={{ fontSize: '1.25rem', color: 'var(--ink)' }}>{wishlist.length}</p>
                  <p className="text-caption" style={{ color: 'var(--ink-muted)' }}>SAVED</p>
                </div>
              </div>
            </div>

            {/* Nav tabs */}
            <nav
              className="overflow-hidden"
              style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
            >
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-ui transition-all text-left"
                    style={{
                      color: isSelected ? 'var(--ivory)' : 'var(--ink-soft)',
                      background: isSelected ? 'var(--vermilion)' : 'transparent',
                      borderBottom: '1px solid var(--hairline-soft)',
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                    <ChevronRight size={12} className="ml-auto" style={{ opacity: isSelected ? 1 : 0.4 }} />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ─── Main Content ─────────────────────────────────────────── */}
          <main className="lg:col-span-3">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div
                  className="p-6 relative space-y-4"
                  style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                >
                  <MithilaMotif type="four-corners" color="rgba(176,48,32,0.08)" />
                  <h2 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>Collector Level</h2>
                  <p className="text-body-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    Thank you for supporting our guild. You have acquired authentic Mithila art directly from rural family cooperatives in Bihar, supporting local community schools and clean drinking water initiatives.
                  </p>
                  <div className="flex gap-4 items-center pt-2">
                    <div
                      className="h-1.5 flex-1 rounded-full overflow-hidden"
                      style={{ background: 'var(--ivory)' }}
                    >
                      <div className="h-full" style={{ width: '60%', background: 'var(--vermilion)' }} />
                    </div>
                    <span className="text-caption" style={{ color: 'var(--ink-muted)' }}>60% to Gold Level</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-5 space-y-3"
                    style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                  >
                    <h3 className="text-ui font-semibold" style={{ color: 'var(--ink)' }}>Primary Address</h3>
                    <p className="text-body-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                      Arjun Mehta<br />
                      B-204, Lotus Apartments, MG Road<br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                  <div
                    className="p-5 space-y-3"
                    style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                  >
                    <h3 className="text-ui font-semibold" style={{ color: 'var(--ink)' }}>Support Contact</h3>
                    <p className="text-body-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                      Have a query about custom commissions, shipping status, or certification?<br />
                      <a href="#" className="font-semibold transition-colors hover:text-vermilion" style={{ color: 'var(--vermilion)' }}>Contact Studio Assistance</a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Package size={36} style={{ color: 'var(--ink-dim)' }} className="mx-auto" />
                    <p className="text-body-sm" style={{ color: 'var(--ink-muted)' }}>No orders placed yet.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div
                      key={order.id}
                      className="p-5 space-y-4 relative"
                      style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                    >
                      <MithilaMotif type="four-corners" color="rgba(176,48,32,0.08)" />
                      <div className="flex items-center justify-between gap-4 flex-wrap border-b pb-3" style={{ borderColor: 'var(--hairline-soft)' }}>
                        <div>
                          <p className="text-caption" style={{ color: 'var(--ink-dim)' }}>Order Reference</p>
                          <p className="text-ui font-semibold" style={{ color: 'var(--ink)' }}>{order.id}</p>
                        </div>
                        <div>
                          <p className="text-caption" style={{ color: 'var(--ink-dim)' }}>Order Date</p>
                          <p className="text-ui font-semibold" style={{ color: 'var(--ink)' }}>{order.date}</p>
                        </div>
                        <div>
                          <p className="text-caption" style={{ color: 'var(--ink-dim)' }}>Total Value</p>
                          <p className="text-ui font-semibold" style={{ color: 'var(--ink)' }}>₹{order.total.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <span
                            className="badge font-semibold"
                            style={{
                              background: order.status === 'Delivered' ? 'var(--leaf-light)' : 'var(--turmeric-tint)',
                              color: order.status === 'Delivered' ? 'var(--leaf)' : 'var(--turmeric)',
                              border: `1px solid ${order.status === 'Delivered' ? 'var(--leaf)' : 'var(--turmeric)'}`
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map(item => (
                          <div key={item.product.id} className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 shrink-0 overflow-hidden cursor-pointer"
                              style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)' }}
                              onClick={() => onSelectProduct(item.product)}
                            >
                              <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                onClick={() => onSelectProduct(item.product)}
                                className="text-body-sm font-semibold line-clamp-1 cursor-pointer hover:text-vermilion transition-colors"
                                style={{ color: 'var(--ink)' }}
                              >
                                {item.product.title}
                              </p>
                              <p className="text-caption" style={{ color: 'var(--ink-dim)' }}>Qty: {item.quantity} · {item.product.style} Style</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.trackingNumber && (
                        <div
                          className="p-3 text-caption flex items-center justify-between"
                          style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)', borderRadius: '2px' }}
                        >
                          <span style={{ color: 'var(--ink-muted)' }}>Tracking Code: {order.trackingNumber}</span>
                          <span style={{ color: 'var(--ink-muted)' }}>Est Delivery: {order.estimatedDelivery}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <Heart size={36} style={{ color: 'var(--ink-dim)' }} className="mx-auto" />
                    <p className="text-body-sm" style={{ color: 'var(--ink-muted)' }}>Your Saved collection is empty.</p>
                    <button onClick={onNavigateToShop} className="btn btn-outline">
                      Browse Artworks
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map(p => (
                      <div
                        key={p.id}
                        className="flex gap-4 p-4 relative"
                        style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
                      >
                        <MithilaMotif type="four-corners" color="rgba(176,48,32,0.06)" />
                        <div
                          className="w-20 h-20 overflow-hidden shrink-0 cursor-pointer"
                          style={{ background: 'var(--ivory)', border: '1px solid var(--hairline-soft)' }}
                          onClick={() => onSelectProduct(p)}
                        >
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4
                              onClick={() => onSelectProduct(p)}
                              className="font-display font-semibold line-clamp-1 cursor-pointer hover:text-vermilion transition-colors"
                              style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: '1.2' }}
                            >
                              {p.title}
                            </h4>
                            <p className="text-caption" style={{ color: 'var(--ink-muted)' }}>{p.style} Style</p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-display font-semibold" style={{ color: 'var(--ink)' }}>₹{p.price.toLocaleString('en-IN')}</span>
                            <button
                              onClick={() => onRemoveFromWishlist(p.id)}
                              className="text-caption font-semibold transition-colors hover:text-vermilion"
                              style={{ color: 'var(--ink-muted)' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div
                className="p-6 relative space-y-6"
                style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '4px' }}
              >
                <MithilaMotif type="four-corners" color="var(--vermilion)" />
                <h2 className="font-display font-semibold text-title" style={{ color: 'var(--ink)' }}>Account Settings</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Full Name</label>
                      <input className="input" defaultValue="Arjun Mehta" />
                    </div>
                    <div>
                      <label className="input-label">Phone Number</label>
                      <input className="input" defaultValue="+91 98765 43210" />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Email Address</label>
                    <input className="input" defaultValue="arjun@example.com" disabled />
                    <p className="text-caption mt-1" style={{ color: 'var(--ink-dim)' }}>Contact support to change your account email.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
};
