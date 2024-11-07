import jwt from "jsonwebtoken";
import { usersModel } from "../models/index.mjs";

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await usersModel.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Invalid username or password",
        });
      }

      if (password !== user.password) {
        return res.status(401).json({
          status: "error",
          message: "Invalid username or password",
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role_name },
        "your_jwt_secret",
        { expiresIn: "1h" },
      );
      res.json({
        status: "success",
        message: "Login successful",
        token,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(401).json({
          status: "error",
          message: "Invalid username or password",
        });
      }

      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }

      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },
};

export default authController;
