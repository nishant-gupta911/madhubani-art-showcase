'use client';

import React, { useState } from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { CartCheckoutScreen } from '@/components/screens/CartCheckoutScreen';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { useCartStore } from '@/store/cart-store';
import { MadhubaniProduct } from '@/types';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [orderSuccess, setOrderSuccess] = useState<{ number: string; total: number } | null>(null);

  // Map CartStore items to CartCheckoutScreen format
  const mappedCart = items.map((it) => ({
    product: {
      id: it.product.id,
      ref: it.product.ref,
      name: it.product.name,
      title: it.product.name,
      slug: it.product.slug,
      filename: 'cart-item.webp',
      price: Math.round(it.product.pricePaise / 100),
      image: it.product.image,
      dimensions: 'Standard',
      style: 'Bharni' as const,
      stock: 5,
      category: it.product.category,
      categoryName: it.product.category === 'paintings' ? 'Paintings' : 'Apparel',
      categoryShort: it.product.category === 'paintings' ? 'Painting' : 'Apparel',
      medium: 'Handpainted',
      galleryImages: [it.product.image],
      shortDescription: it.product.name,
      longDescription: it.product.name,
      description: it.product.name,
      story: '',
      tags: [],
      isFeatured: false,
      isNew: true,
      material: 'Handmade paper / cotton',
    } as unknown as MadhubaniProduct,
    quantity: it.qty,
    framing: it.framing as any,
  }));

  const handleCheckoutSuccess = (orderInfo: { number: string; total: number }) => {
    clearCart();
    setOrderSuccess(orderInfo);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
      <HeaderBar
        cartCount={items.reduce((s, i) => s + i.qty, 0)}
        wishlistCount={0}
        currentScreen="cart"
      />

      <main className="pt-2">
        <CartCheckoutScreen
          cart={mappedCart}
          orders={[]}
          onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
          onRemoveItem={(id) => removeItem(id)}
          onCheckout={handleCheckoutSuccess}
          onNavigateToShop={() => {
            if (typeof window !== 'undefined') window.location.href = '/shop';
          }}
          onSelectProduct={(p) => {
            if (typeof window !== 'undefined') window.location.href = `/shop/${p.slug || p.id}`;
          }}
        />
      </main>

      {orderSuccess && (
        <OrderSuccessModal
          orderNumber={orderSuccess.number}
          total={orderSuccess.total}
          onClose={() => setOrderSuccess(null)}
          onContinueShopping={() => {
            if (typeof window !== 'undefined') window.location.href = '/shop';
          }}
          onViewOrders={() => {
            if (typeof window !== 'undefined') window.location.href = `/track?orderId=${orderSuccess.number}`;
          }}
        />
      )}
    </div>
  );
}
