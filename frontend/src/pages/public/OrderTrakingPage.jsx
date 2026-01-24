import { useParams } from "react-router";

export default function OrderTrakingPage() {
  const { orderId } = useParams();
  const orderDetails = null; // TODO: Fetch order details using orderId

  if (!orderId) return <p>Order ID is missing.</p>;

  if (!orderDetails) return <p>No order details found.</p>;

  return (
    <section>
      {/* Date of purchase */}
      {/* Order status: Pending, Shipped, Delivered, Canceled */}
      {/* Payment info: method and status */}
      {/* Shipping info: method (standard, express) and address */}
      {/* List of products with quantities and prices */}
    </section>
  );
}
