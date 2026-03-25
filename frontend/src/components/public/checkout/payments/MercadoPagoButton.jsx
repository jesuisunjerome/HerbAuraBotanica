import { useCreateOrder } from "../../../../hooks/orders/mutations";
import { COUNTRY_LIST } from "../../../../lib/helper";
import { useCartStore } from "../../../../store/useCartStore";

export default function MercadoPagoButton({ formData, disabled, onSuccess }) {
  const { cart } = useCartStore();
  const { isCreatingOrder, createOrder } = useCreateOrder();

  const handlePayment = async () => {
    try {
      const selectedCountry = COUNTRY_LIST.find(
        (c) => c.value === formData.shippingAddress.country,
      )?.label;

      // 1. Create the order in the backend
      const orderPayload = {
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          image: item.images[0].url,
          price: item.price,
        })),
        customer: formData.customer,
        shippingAddress: {
          ...formData.shippingAddress,
          country: selectedCountry,
        },
        paymentMethod: formData.paymentMethod,
      };

      await createOrder(orderPayload, {
        onSuccess: (data) => {
          if (data.mercadoPago?.initPoint) {
            window.location.href = data.mercadoPago.initPoint;
          }
        },
      });
    } catch (error) {
      console.error("Error al crear el pedido (Mercado Pago):", error);
      throw error;
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={disabled || isCreatingOrder}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isCreatingOrder ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          Procesando...
        </>
      ) : (
        "Pagar"
      )}
    </button>
  );
}
