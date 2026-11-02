import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // array of product IDs or slugs
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (id: string) => {
        set((state) => {
          if (state.items.includes(id)) return state;
          return { items: [...state.items, id] };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item !== id),
        }));
      },

      toggleItem: (id: string) => {
        const has = get().hasItem(id);
        if (has) {
          get().removeItem(id);
        } else {
          get().addItem(id);
        }
      },

      hasItem: (id: string) => {
        return get().items.includes(id);
      },

      clearWishlist: () => set({ items: [] }),

      getCount: () => get().items.length,
    }),
    {
      name: 'vernika-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
