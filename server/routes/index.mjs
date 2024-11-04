import express from "express";

import healthRoutes from "./healthRoutes.mjs";
import usersRoutes from "./usersRoutes.mjs";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/users", usersRoutes);

export default router;
