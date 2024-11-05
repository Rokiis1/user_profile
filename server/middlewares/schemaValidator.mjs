import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
addFormats(ajv);

const schemaValidator = (schema, dataSource) => {
  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const data = req[dataSource];
    const valid = validate(data);
    if (!valid) {
      const errors = validate.errors.map((error) => ({
        message: error.message,
        path: error.instancePath,
      }));

      return res.status(400).json({ errors });
    }
    next();
  };
};

export default schemaValidator;
