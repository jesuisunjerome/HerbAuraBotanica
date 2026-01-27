import { PAYMENT_STATUS } from "../lib/constants.js";
import Checkout from "../models/Checkout.js";
import Order from "../models/Order.js";

// Create a new checkout session
export const createNewCheckoutSession = async (req, res) => {
  const { checkoutItems, shippingDetails, paymentMethod, totalAmount } =
    req.body;

  try {
    console.log("createNewCheckoutSession controller");

    if (!checkoutItems || checkoutItems.length === 0)
      return res
        .status(400)
        .json({ message: "El carrito de compra no puede estar vacío." });

    // TODO: User authentication to get user info

    const newCheckout = await Checkout.create({
      checkoutItems,
      shippingDetails,
      paymentMethod,
      totalAmount,
      paymentStatus: PAYMENT_STATUS.PENDING,
      isPaid: false,
    });

    console.log("Nueva sesión de checkout creada");
    res.status(201).json(newCheckout);
  } catch (error) {
    console.log(
      "Server error in createNewCheckoutSession controller",
      error.message,
    );
    res.status(500).json({ message: error.message });
  }
};

// Update checkout session payment status
export const updateCheckoutPaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, paymentDetails } = req.body;

  try {
    console.log("updateCheckoutPaymentStatus controller");

    const checkout = await Checkout.findById(id);
    if (!checkout)
      return res
        .status(404)
        .json({ message: "Sesión de checkout no encontrada" });

    if (paymentStatus !== PAYMENT_STATUS.PAID)
      return res.status(400).json({ message: "Estado de pago inválido" });

    checkout.isPaid = true;
    checkout.paymentStatus = paymentStatus;
    checkout.paidAt = new Date();
    checkout.paymentDetails = paymentDetails;

    const updatedCheckout = await checkout.save();
    res.status(200).json(updatedCheckout);
  } catch (error) {
    console.log(
      "Server error in updateCheckoutPaymentStatus controller",
      error.message,
    );
    res.status(500).json({ message: error.message });
  }
};

// Finalize checkout after successful payment
export const finalizeCheckoutSession = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("finalizeCheckoutSession controller");

    const checkout = await Checkout.findById(id);
    if (!checkout)
      return res
        .status(404)
        .json({ message: "Sesión de checkout no encontrada" });

    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await Order.create({
        shippingDetails: checkout.shippingDetails,
        orderItems: checkout.checkoutItems,
        totalAmount: checkout.totalAmount,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentMethod: checkout.paymentMethod,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = new Date();
      await checkout.save();

      return res.status(201).json(finalOrder);
    }

    if (checkout.isFinalized)
      return res
        .status(400)
        .json({ message: "La sesión de checkout ya ha sido finalizada." });

    return res
      .status(400)
      .json({ message: "La sesión de checkout no ha sido pagada aún." });
  } catch (error) {
    console.log(
      "Server error in finalizeCheckoutSession controller",
      error.message,
    );
    res.status(500).json({ message: error.message });
  }
};
