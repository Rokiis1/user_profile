import { pool } from "../configs/index.mjs";

export const postgresConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
  } catch (err) {
    console.error("Connection error", err.stack);
    throw err;
  }
};
