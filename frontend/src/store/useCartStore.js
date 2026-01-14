import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) => {
    const exists = get().items.find((i) => i.productId === item.productId);
    if (exists) return;

    set((state) => ({
      items: [...state.items, { ...item, quantity: 1 }],
    }));
  },
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== itemId),
    })),
  clearCart: () => set({ items: [] }),
}));
