import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const exists = get().cart.find((p) => p._id === product._id);
        if (exists) {
          set((state) => ({
            cart: state.cart.map((p) =>
              p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p,
            ),
          }));

          return;
        }

        set((state) => ({
          cart: [...state.cart, { ...product, quantity: 1 }],
        }));
      },

      decreaseQuantity: (_id) => {
        const product = get().cart.find((p) => p._id === _id);
        if (product) {
          if (product.quantity === 1) {
            set((state) => ({
              cart: state.cart.filter((p) => p._id !== _id),
            }));
          } else {
            set((state) => ({
              cart: state.cart.map((p) =>
                p._id === _id ? { ...p, quantity: p.quantity - 1 } : p,
              ),
            }));
          }
        }
      },

      removeFromCart: (_id) =>
        set((state) => ({
          cart: state.cart.filter((p) => p._id !== _id),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-herbaura",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
