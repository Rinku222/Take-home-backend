const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "Rinku@123";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      result: {
        success: false,
        message:
          "Access token is required. Please provide a token in the Authorization header.",
      },
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        result: {
          success: false,
          message: "Invalid or expired token.",
        },
      });
    }
    req.user = user;
    next();
  });
};

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
};

module.exports = {
  authenticateToken,
  generateToken,
};
