'use client';

import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingBag, DollarSign, Clock, Truck, CheckCircle2,
  AlertCircle, Download, Plus, Search, Filter, RefreshCw, LogOut,
  ChevronRight, ExternalLink, Calculator, Layers, Settings, Eye,
  Lock, ArrowRight, ShieldCheck, Phone, Mail, MapPin, Tag
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface OrderItem {
  productId?: string;
  name: string;
  pricePaise: number;
  qty: number;
  variant?: string;
  image?: string;
}

interface OrderData {
  _id: string;
  orderId: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'in_preparation' | 'shipped' | 'delivered' | 'cancelled';
  totalPaise: number;
  subtotalPaise: number;
  shippingFeePaise: number;
  codFeePaise: number;
  payment: {
    method: 'prepaid' | 'cod';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    razorpayOrderId?: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  tracking?: {
    courier?: string;
    number?: string;
    url?: string;
  };
  items: OrderItem[];
  giftWrap?: {
    requested: boolean;
    note?: string;
  };
}

interface ProductData {
  _id: string;
  ref: string;
  name: string;
  category: string;
  price: number; // in paise
  stock: number;
  type: string;
  images: { url: string; isHero: boolean }[];
  dimensions?: { displayString: string };
  isActive: boolean;
}

const CATEGORY_BANDS = [
  { label: 'Painting — Miniature (6-8 in)', minPrice: 1499 },
  { label: 'Painting — Slim Strip', minPrice: 1799 },
  { label: 'Painting — Medium Mandala', minPrice: 3499 },
  { label: 'Painting — Deity / Figure', minPrice: 4499 },
  { label: 'Painting — Large Statement', minPrice: 5999 },
  { label: 'Dupatta — Classic Border', minPrice: 1299 },
  { label: 'Dupatta — Heavy Pallu', minPrice: 1999 },
  { label: 'Dupatta — Premium Jaal', minPrice: 2999 },
  { label: 'Angvastra — Men’s Stole', minPrice: 1199 },
  { label: 'Bags — File Folder', minPrice: 599 },
  { label: 'Bags — Zipper Pouch', minPrice: 399 },
  { label: 'Bags — Canvas Tote', minPrice: 899 },
  { label: 'Bags — Handbag / Leather Base', minPrice: 1299 },
  { label: 'Bags — Padded Laptop Bag', minPrice: 1499 },
  { label: 'Bags — Wall Hanging Organizer', minPrice: 1199 },
];

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'add-product' | 'inventory' | 'price-helper' | 'settings'>('orders');

  // Orders State
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // Status Update state for selected order
  const [newStatus, setNewStatus] = useState<string>('');
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  // Quick-Add Product State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'paintings',
    subCategory: 'fish',
    priceRupees: '',
    dimensions: '',
    imageUrl: '',
    stock: '1',
    leadTimeDays: '0',
    type: 'original_painting',
    description: '',
    story: '',
  });
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  // Inventory State
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Price Helper State
  const [costInput, setCostInput] = useState<string>('600');
  const [selectedBandMin, setSelectedBandMin] = useState<number>(1499);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(1499);

  // Check Auth on Mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      setIsAuthenticated(data.authenticated === true);
      if (data.authenticated) {
        fetchOrders();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      setIsAuthenticated(true);
      fetchOrders();
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      let url = `/api/admin/orders?status=${orderFilterStatus}`;
      if (orderSearch.trim()) {
        url += `&search=${encodeURIComponent(orderSearch.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'inventory') fetchProducts();
    }
  }, [isAuthenticated, activeTab, orderFilterStatus]);

  // Price helper calculation: max(bandMin, cost * 2.2)
  useEffect(() => {
    const cost = parseFloat(costInput) || 0;
    const computed = Math.max(selectedBandMin, Math.round(cost * 2.2));
    setCalculatedPrice(computed);
  }, [costInput, selectedBandMin]);

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdatingOrder(true);
    setOrderSuccessMsg('');

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          status: newStatus || selectedOrder.status,
          courier: courierName,
          trackingNumber: trackingNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');

      setOrderSuccessMsg('Order updated! Notification triggered.');
      setSelectedOrder(data.order);
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleQuickAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    setProductSuccessMsg('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      setProductSuccessMsg(`Product published successfully! Ref: ${data.product.ref}`);
      setProductForm({
        name: '',
        category: 'paintings',
        subCategory: 'fish',
        priceRupees: '',
        dimensions: '',
        imageUrl: '',
        stock: '1',
        leadTimeDays: '0',
        type: 'original_painting',
        description: '',
        story: '',
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Metrics
  const totalRevenuePaise = orders
    .filter(o => o.payment.status === 'paid')
    .reduce((sum, o) => sum + o.totalPaise, 0);
  const pendingOrdersCount = orders.filter(o => ['confirmed', 'in_preparation', 'pending'].includes(o.status)).length;
  const shippedOrdersCount = orders.filter(o => o.status === 'shipped').length;

  // 1. Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ivory)' }}>
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-vermilion" size={32} />
          <p className="font-display font-medium text-ink">Opening Natasha's Studio Admin...</p>
        </div>
      </div>
    );
  }

  // 2. Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--ivory)' }}>
        <div className="w-full max-w-md p-8 rounded-lg shadow-sm border border-ivory-dimmed" style={{ background: '#FAF6EF' }}>
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: 'var(--vermilion-tint)', color: 'var(--vermilion)' }}>
              <Lock size={22} />
            </div>
            <h1 className="font-display font-bold text-2xl text-ink">Vernika Enterprises</h1>
            <p className="text-xs uppercase tracking-widest text-ink-muted mt-1">Natasha Gupta Studio Portal</p>
          </div>

          {authError && (
            <div className="p-3 mb-5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="vernikaenterprises14@gmail.com"
                required
                className="w-full px-3 py-2.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-vermilion"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3 py-2.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-vermilion"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              style={{ background: 'var(--vermilion)' }}
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-ink-muted mt-6">
            Default credentials configured in <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code>
          </p>
        </div>
      </div>
    );
  }

  // 3. Full Studio Admin Interface
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5EE' }}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-ivory-dimmed px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-sm" style={{ background: 'var(--night)', color: 'var(--ivory)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm bg-vermilion text-white">
            VE
          </div>
          <div>
            <h2 className="font-display font-semibold text-sm leading-tight text-ivory">Vernika Admin</h2>
            <p className="text-[10px] tracking-widest uppercase opacity-65">Natasha Gupta • {siteConfig.sellerCity}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            download
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Download size={14} />
            <span>Export Orders (CSV)</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-red-200 hover:text-white hover:bg-red-950/60 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-header / Tabs */}
      <div className="border-b border-gray-200 bg-white px-4 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {[
            { id: 'orders', label: 'Orders & Shipments', icon: Package },
            { id: 'add-product', label: 'Quick-Add Product', icon: Plus },
            { id: 'inventory', label: 'Catalog Stock', icon: Layers },
            { id: 'price-helper', label: 'Price Helper (2.2x)', icon: Calculator },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-3 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-50 text-red-800 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
        {/* Warning Banner if Seller City not configured */}
        {!siteConfig.isSellerCityConfigured && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-300 flex items-start gap-3 shadow-sm text-amber-900">
            <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-semibold text-sm">Action Required: Seller City Not Configured</strong>
              <p>
                Currently displaying placeholder <code>"{siteConfig.sellerCity}"</code> in official communications.
                Please configure <code>NEXT_PUBLIC_SELLER_CITY</code> and <code>NEXT_PUBLIC_SELLER_STATE</code> in your deployment environment variables (e.g. Vercel dashboard or <code>.env.local</code>) to reflect Natasha's dispatch studio.
              </p>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Paid Revenue</span>
              <DollarSign size={16} className="text-emerald-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-display text-gray-900">
              ₹{(totalRevenuePaise / 100).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
              <ShoppingBag size={16} className="text-blue-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-display text-gray-900">
              {orders.length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">To Fulfill</span>
              <Clock size={16} className="text-amber-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-display text-amber-700">
              {pendingOrdersCount}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Dispatched</span>
              <Truck size={16} className="text-indigo-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-display text-indigo-700">
              {shippedOrdersCount}
            </div>
          </div>
        </div>

        {/* ── TAB 1: ORDERS & FULFILLMENT ───────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search order ID (VE-...), phone, or name..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchOrders()}
                  className="w-full text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={orderFilterStatus}
                  onChange={e => setOrderFilterStatus(e.target.value)}
                  className="text-xs sm:text-sm border border-gray-200 rounded px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_preparation">In Preparation</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={fetchOrders}
                  className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
                  title="Refresh orders"
                >
                  <RefreshCw size={16} className={isLoadingOrders ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Orders Table & Detail Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* List */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider flex justify-between">
                  <span>Customer Orders ({orders.length})</span>
                  <span>Click to Manage</span>
                </div>

                {isLoadingOrders ? (
                  <div className="p-10 text-center text-sm text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="p-10 text-center text-sm text-gray-500">
                    No orders found matching filters.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                    {orders.map(order => {
                      const isSelected = selectedOrder?.orderId === order.orderId;
                      return (
                        <div
                          key={order.orderId}
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                            setCourierName(order.tracking?.courier || 'Shiprocket');
                            setTrackingNumber(order.tracking?.number || '');
                            setOrderSuccessMsg('');
                          }}
                          className={`p-4 cursor-pointer transition-colors hover:bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            isSelected ? 'bg-amber-50 border-l-4 border-vermilion' : ''
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs sm:text-sm text-gray-900">
                                {order.orderId}
                              </span>
                              <span
                                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : order.status === 'in_preparation'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {order.status}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 uppercase text-gray-600 font-medium">
                                {order.payment.method} ({order.payment.status})
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 mt-1">
                              <strong>{order.customer.name}</strong> • {order.customer.phone} • {order.shippingAddress.city}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                            <span className="font-display font-bold text-sm text-gray-900">
                              ₹{(order.totalPaise / 100).toLocaleString('en-IN')}
                            </span>
                            <ChevronRight size={16} className="text-gray-400 mt-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Detail & Action Panel */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
                {selectedOrder ? (
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-vermilion">
                          {selectedOrder.orderId}
                        </span>
                        <a
                          href={`/api/orders/track?orderId=${selectedOrder.orderId}&phone=${selectedOrder.customer.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Public Tracking Page <ExternalLink size={12} />
                        </a>
                      </div>
                      <h4 className="font-display font-bold text-lg text-gray-900 mt-1">
                        {selectedOrder.customer.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {selectedOrder.customer.phone} • {selectedOrder.customer.email}
                      </p>
                    </div>

                    {/* Shipping Address */}
                    <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100">
                      <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
                        <MapPin size={12} /> Shipping Address:
                      </p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      {selectedOrder.shippingAddress.landmark && <p>Near: {selectedOrder.shippingAddress.landmark}</p>}
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold text-gray-800 mb-1.5">Ordered Items:</p>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {selectedOrder.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                            <span className="text-gray-700">
                              {it.qty}x {it.name}
                            </span>
                            <span className="font-medium text-gray-900">
                              ₹{(it.pricePaise * it.qty / 100).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gift Option Note */}
                    {selectedOrder.giftWrap?.requested && (
                      <div className="text-xs bg-amber-50 border border-amber-200 p-2 rounded text-amber-900">
                        <strong>🎁 Gift Wrap Requested:</strong>
                        <p className="italic mt-0.5">"{selectedOrder.giftWrap.note || 'No note provided'}"</p>
                      </div>
                    )}

                    {/* Quick Action: Confirm COD Order */}
                    {selectedOrder.payment.method === 'cod' && selectedOrder.status === 'pending' && (
                      <div className="p-3 rounded bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2">
                        <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                          <CheckCircle2 size={15} />
                          <span>Pending COD Verification</span>
                        </div>
                        <p className="text-[11px] text-amber-700">
                          Verify customer on +91 {selectedOrder.customer.phone} and click below to confirm:
                        </p>
                        <button
                          type="button"
                          onClick={async () => {
                            setNewStatus('confirmed');
                            const res = await fetch('/api/admin/orders', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                orderId: selectedOrder.orderId,
                                status: 'confirmed',
                                note: 'COD order confirmed manually by Admin Natasha',
                              }),
                            });
                            if (res.ok) {
                              const d = await res.json();
                              setSelectedOrder(d.order);
                              setOrderSuccessMsg('COD Order confirmed successfully!');
                              fetchOrders();
                            }
                          }}
                          className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-sm"
                        >
                          ✓ Confirm COD Order Now
                        </button>
                      </div>
                    )}

                    {/* Status & Fulfillment Form */}
                    <form onSubmit={handleUpdateOrderStatus} className="pt-2 border-t border-gray-100 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Update Order Status:
                        </label>
                        <select
                          value={newStatus}
                          onChange={e => setNewStatus(e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded p-2 bg-white"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="in_preparation">In Preparation</option>
                          <option value="shipped">Shipped (Triggers Customer Email)</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">Courier Partner:</label>
                          <input
                            type="text"
                            value={courierName}
                            onChange={e => setCourierName(e.target.value)}
                            placeholder="e.g. BlueDart / Delhivery"
                            className="w-full text-xs border border-gray-300 rounded p-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">Tracking AWB #:</label>
                          <input
                            type="text"
                            value={trackingNumber}
                            onChange={e => setTrackingNumber(e.target.value)}
                            placeholder="e.g. 1420583921"
                            className="w-full text-xs border border-gray-300 rounded p-1.5"
                          />
                        </div>
                      </div>

                      {orderSuccessMsg && (
                        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded">
                          {orderSuccessMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isUpdatingOrder}
                        className="w-full py-2 bg-vermilion hover:bg-vermilion-dark text-white rounded text-xs font-medium transition-colors"
                      >
                        {isUpdatingOrder ? 'Updating...' : 'Update & Notify Customer'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400 text-xs">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    Select an order from the list to view customer shipping address, ordered items, and dispatch tracking details.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: MOBILE QUICK-ADD PRODUCT ──────────────────────────────── */}
        {activeTab === 'add-product' && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-100 pb-4 mb-5">
              <h3 className="font-display font-bold text-xl text-gray-900">
                Quick-Add Handpainted Artwork
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Designed for Natasha to photograph and list a finished piece in 60 seconds from her phone.
              </p>
            </div>

            {productSuccessMsg && (
              <div className="p-3 mb-5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{productSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleQuickAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Artwork Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sacred Kohbar Lotus Mandalas"
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-vermilion"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                  >
                    <option value="paintings">Madhubani Paintings (Framed)</option>
                    <option value="dupattas">Dupattas & Angvastras</option>
                    <option value="bags_and_files">Bags & Files</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Listing Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2499"
                    value={productForm.priceRupees}
                    onChange={e => setProductForm({ ...productForm, priceRupees: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-vermilion"
                  />
                  <span className="text-[10px] text-gray-400">Stored in database as integer paise</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Dimensions / Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18 x 14 cm or 2.5 m"
                    value={productForm.dimensions}
                    onChange={e => setProductForm({ ...productForm, dimensions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Product Type
                  </label>
                  <select
                    value={productForm.type}
                    onChange={e => setProductForm({ ...productForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                  >
                    <option value="original_painting">Original Painting (Unique 1 of 1)</option>
                    <option value="made_to_order">Made to Order (Lead Time)</option>
                    <option value="stock_item">In Stock Item</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    value={productForm.leadTimeDays}
                    onChange={e => setProductForm({ ...productForm, leadTimeDays: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Image Path / Cloudinary URL
                </label>
                <input
                  type="text"
                  placeholder="/products/1.webp or https://res.cloudinary.com/..."
                  value={productForm.imageUrl}
                  onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <span className="text-[10px] text-gray-400">Defaults to catalog asset if left empty</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Artisan Story & Heritage Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the motif symbolism, colors used, or inspiration..."
                  value={productForm.story}
                  onChange={e => setProductForm({ ...productForm, story: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProduct}
                className="w-full py-3 bg-vermilion hover:bg-vermilion-dark text-white rounded font-medium text-sm transition-colors shadow-sm"
              >
                {isSavingProduct ? 'Publishing Artwork...' : 'Publish to Website Catalog'}
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 3: INVENTORY MANAGEMENT ───────────────────────────────────── */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900">Active Catalog Inventory</h3>
                <p className="text-xs text-gray-500">Live products in the database</p>
              </div>
              <button
                onClick={fetchProducts}
                className="p-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw size={14} className={isLoadingProducts ? 'animate-spin' : ''} />
              </button>
            </div>

            {isLoadingProducts ? (
              <div className="p-10 text-center text-sm text-gray-500">Loading catalog items...</div>
            ) : products.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">
                No products found in database. Run <code className="bg-gray-100 px-1 py-0.5 rounded">npm run seed</code> to populate the 66 catalog items.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Artwork Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price (INR)</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-vermilion">{p.ref}</td>
                        <td className="p-3 font-medium text-gray-900 max-w-xs truncate">{p.name}</td>
                        <td className="p-3 capitalize text-gray-600">{p.category}</td>
                        <td className="p-3 font-bold text-gray-900">₹{(p.price / 100).toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${p.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {p.stock > 0 ? `${p.stock} in stock` : 'Sold Out'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">{p.type}</td>
                        <td className="p-3">
                          <span className="text-emerald-700 font-medium">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: PRICING HELPER (max(bandMin, cost * 2.2)) ──────────────── */}
        {activeTab === 'price-helper' && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-100 pb-3 mb-5">
              <div className="flex items-center gap-2 text-vermilion mb-1">
                <Calculator size={20} />
                <h3 className="font-display font-bold text-lg text-gray-900">Natasha's Artisan Price Helper</h3>
              </div>
              <p className="text-xs text-gray-500">
                Rule: <code className="bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded font-mono">Recommended Price = max(Category Minimum, Direct Cost × 2.2)</code>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  1. Select Category / Product Band:
                </label>
                <select
                  value={selectedBandMin}
                  onChange={e => setSelectedBandMin(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm bg-white"
                >
                  {CATEGORY_BANDS.map(band => (
                    <option key={band.label} value={band.minPrice}>
                      {band.label} (Floor: ₹{band.minPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  2. Natasha's Direct Production Cost (Materials + Labor Hours in ₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={costInput}
                    onChange={e => setCostInput(e.target.value)}
                    placeholder="e.g. 750"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Includes canvas/fabric, framing, paints/soot, packaging, and Natasha's painting hours.
                </span>
              </div>

              {/* Calculated Result Card */}
              <div className="mt-6 p-5 rounded-lg border border-amber-200 bg-amber-50/70 text-center">
                <span className="text-xs uppercase font-semibold text-amber-900 tracking-wider">
                  Recommended Selling Price
                </span>
                <div className="text-3xl font-bold font-display text-vermilion mt-1">
                  ₹{calculatedPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                  <p>Category Band Floor: <strong>₹{selectedBandMin}</strong></p>
                  <p>Cost × 2.2 Multiplier: <strong>₹{Math.round((parseFloat(costInput) || 0) * 2.2)}</strong></p>
                  <p className="text-[11px] text-emerald-700 font-medium pt-1">
                    ✓ Protects Natasha's living wage & covers packaging/free shipping overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: STORE SETTINGS ─────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-xl text-gray-900">Store Settings & Business Rules</h3>
              <p className="text-xs text-gray-500 mt-1">
                Centrally configured in <code className="bg-gray-100 px-1 py-0.5 rounded">src/config/site.ts</code>
              </p>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Brand Name:</span>
                <span className="font-medium text-gray-900">{siteConfig.name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Founder & Artist:</span>
                <span className="font-medium text-gray-900">{siteConfig.artist}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Seller Location:</span>
                <span className="font-medium text-gray-900">{siteConfig.origin}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Phone & WhatsApp:</span>
                <span className="font-medium text-gray-900">{siteConfig.contact.displayPhone}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Official Email:</span>
                <span className="font-medium text-gray-900">{siteConfig.contact.email}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Free Shipping Minimum:</span>
                <span className="font-medium text-gray-900">₹{siteConfig.shipping.freeShippingThresholdPaise / 100} (Free on all framed paintings)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">COD Fee:</span>
                <span className="font-medium text-gray-900">₹{siteConfig.shipping.codConvenienceFeePaise / 100} (Max cart ₹3,000)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Gift Wrapping Charge:</span>
                <span className="font-medium text-gray-900">₹{siteConfig.shipping.giftWrappingFeePaise / 100}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
