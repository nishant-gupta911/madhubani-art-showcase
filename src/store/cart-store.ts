import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { siteConfig } from '@/config/site';

export interface CartProduct {
  id: string;
  ref?: string;
  name: string;
  slug: string;
  image: string;
  pricePaise: number;
  category: string;
  isOriginal?: boolean;
}

export interface CartItem {
  product: CartProduct;
  qty: number;
  framing?: string;
}

interface CartStore {
  items: CartItem[];
  isGiftWrapped: boolean;
  giftNote: string;
  addItem: (product: CartProduct, framing?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  setGiftWrapped: (wrapped: boolean) => void;
  setGiftNote: (note: string) => void;
  clearCart: () => void;
  getSubtotalPaise: () => number;
  getShippingPaise: () => number;
  getTotalPaise: (isCod?: boolean) => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isGiftWrapped: false,
      giftNote: '',

      addItem: (product, framing) => {
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);

          // For original paintings, stock is 1
          if (product.isOriginal) {
            if (existing) return state; // Already in cart
            return { items: [...state.items, { product, qty: 1, framing }] };
          }

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, qty: item.qty + 1, framing } : item
              ),
            };
          }

          return { items: [...state.items, { product, qty: 1, framing }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, qty } : item
          ),
        }));
      },

      setGiftWrapped: (isGiftWrapped) => set({ isGiftWrapped }),
      setGiftNote: (giftNote) => set({ giftNote }),

      clearCart: () => set({ items: [], isGiftWrapped: false, giftNote: '' }),

      getSubtotalPaise: () => {
        return get().items.reduce((total, item) => {
          let unitPrice = item.product.pricePaise;
          if (item.framing === 'rolled') {
            unitPrice = Math.max(10000, unitPrice - 30000);
          }
          return total + unitPrice * item.qty;
        }, 0);
      },

      getShippingPaise: () => {
        const subtotal = get().getSubtotalPaise();
        const hasPainting = get().items.some((i) => i.product.category === 'paintings');

        // Free if contains framed painting or above ₹1,499
        if (hasPainting || subtotal >= siteConfig.shipping.freeShippingThresholdPaise || subtotal === 0) {
          return 0;
        }
        return siteConfig.shipping.standardShippingFeePaise; // ₹79
      },

      getTotalPaise: (isCod = false) => {
        const subtotal = get().getSubtotalPaise();
        if (subtotal === 0) return 0;

        const shipping = get().getShippingPaise();
        const codFee = isCod ? siteConfig.shipping.codConvenienceFeePaise : 0;
        const giftWrap = get().isGiftWrapped ? siteConfig.shipping.giftWrappingFeePaise : 0;

        return subtotal + shipping + codFee + giftWrap;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0);
      },
    }),
    {
      name: 'vernika-cart-v1',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null as any)),
    }
  )
);
