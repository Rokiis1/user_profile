import express from "express";
import authController from "../controllers/authController.mjs";
import { userValidationSchema } from "../schemas/index.mjs";
import { schemaValidator } from "../middlewares/index.mjs";

const router = express.Router();

router.post(
  "/login",
  schemaValidator(userValidationSchema.loginSchema, "body"),
  authController.login,
);

export default router;
