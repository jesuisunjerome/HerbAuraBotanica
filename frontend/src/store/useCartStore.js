import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IVA_RATE } from "../lib/helper";

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

          toast.success("Producto agregado al carrito");
          return;
        }

        set((state) => ({
          cart: [...state.cart, { ...product, quantity: 1 }],
        }));

        toast.success("Producto agregado al carrito");
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

      getCartSubtotal: () => {
        const { cart } = get();
        const subtotal = cart.reduce((total, item) => total + item.price, 0);
        return subtotal;
      },

      getCartTotalWithIVA: () => {
        const { getCartSubtotal } = get();
        return getCartSubtotal() * (1 + IVA_RATE);
      },

      isInCart: (_id) => get().cart.some((p) => p._id === _id),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-herbaura",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
