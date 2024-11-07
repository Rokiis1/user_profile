import express from "express";

import healthRoutes from "./healthRoutes.mjs";
import usersRoutes from "./usersRoutes.mjs";
import authRoutes from "./authRoutes.mjs";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/users", usersRoutes);
router.use("/auth", authRoutes);

export default router;
