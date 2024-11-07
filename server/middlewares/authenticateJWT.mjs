import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "your_jwt_secret", (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token has expired" });
        }

        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid token" });
        }

        if (err.name === "NotBeforeError") {
          return res.status(401).json({ message: "Token not yet valid" });
        }

        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Authorization header missing" });
  }
};

export default authenticateJWT;
