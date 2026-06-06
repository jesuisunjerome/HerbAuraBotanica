import express from "express";
import { subscribe } from "../controllers/subscriber.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { subscribeSchema } from "../schemas/subscriber.schema.js";

const router = express.Router();

router.post("/", validateRequest(subscribeSchema), subscribe);

export default router;
