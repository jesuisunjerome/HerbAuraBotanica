import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const exists = get().cart.find(
          (p) => p.productId === product.productId,
        );
        if (exists) {
          set((state) => ({
            cart: state.cart.map((p) =>
              p.productId === product.productId
                ? { ...p, quantity: p.quantity + 1 }
                : p,
            ),
          }));

          return;
        }

        set((state) => ({
          cart: [...state.cart, { ...product, quantity: 1 }],
        }));
      },

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.productId !== productId),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-herbaura",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
