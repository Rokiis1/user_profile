import express from "express";
import { client } from "../config/index.mjs";

const router = express.Router();

router.get("/express", (req, res) => {
  try {
    const healthCheck = {
      status: "OK",
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get("/postgres", async (req, res) => {
  try {
    await client.connect();

    await client.query("SELECT 1");

    await client.end();

    const healthCheck = {
      status: "OK",
      message: "Postgres is healthy",
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    console.error("Postgres health check failed:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Postgres health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
