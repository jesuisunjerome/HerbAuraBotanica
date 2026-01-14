import SEORender from "../layouts/SEORender";
import { useCartStore } from "../store/useCartStore";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCartStore();

  return (
    <>
      <SEORender
        title="Carrito de Compras :: HerbAura Botanica"
        description="Revisa y gestiona los productos en tu carrito de compras en HerbAura Botanica. Tu camino hacia un cabello natural y saludable comienza aquí."
      />
      <h1>Cart Page</h1>
    </>
  );
}
