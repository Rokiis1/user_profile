import { countriesModel } from "../models/index.mjs";

const validateCountry = async (req, res, next) => {
  const { country } = req.body;
  try {
    const countries = await countriesModel.getCountries();

    if (!countries.includes(country)) {
      return res.status(400).json({ error: "Invalid country" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default validateCountry;
