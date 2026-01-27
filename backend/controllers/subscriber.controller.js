import Subscriber from "../models/Subscriber.js";

export const subscribe = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email)
      return res.status(400).json({ message: "El correo es obligatorio." });

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber)
      return res.status(400).json({ message: "El correo ya está suscrito." });

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Suscripción exitosa." });
  } catch (error) {
    console.log("Server error in subscribe controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
