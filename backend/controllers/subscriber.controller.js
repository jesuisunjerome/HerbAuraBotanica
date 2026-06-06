import { AppError } from "../lib/error.js";
import Subscriber from "../models/Subscriber.js";

export const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("El correo es obligatorio.", 400);
  }

  const existingSubscriber = await Subscriber.findOne({ email }).lean();
  if (existingSubscriber) {
    throw new AppError("El correo ya está suscrito.", 400);
  }

  const newSubscriber = new Subscriber({ email });
  await newSubscriber.save();

  res.status(201).json({ message: "Suscripción exitosa." });
};
