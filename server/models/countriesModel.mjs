import { pool } from "../configs/postgresSettings.mjs";

const countriesModel = {
  getCountries: async () => {
    let client;
    try {
      client = await pool.connect();
      const query = "SELECT country_name FROM countries;";
      const result = await client.query(query);

      if (result.rows.length === 0) {
        throw new Error("No countries found");
      }

      return result.rows.map((row) => row.country_name);
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },
};

export default countriesModel;
