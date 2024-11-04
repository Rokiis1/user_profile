import express from "express";

import routes from "./routes/index.mjs";
import { postgresConnection } from "./database/postgresConnection.mjs";

const app = express();
const PORT = 3000;

const initializeDatabase = async () => {
  console.log("Initializing database connection");
  try {
    await postgresConnection();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

const initializeServer = () => {
  app.use(express.json());
  app.use("/api/v1", routes);

  app.listen(PORT, () => {
    console.log(`Web server is running on port ${PORT}`);
  });
};

(async () => {
  await initializeDatabase();
  initializeServer();
})();
