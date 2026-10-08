const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Login required",
    });
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error("JWT_SECRET missing"));
  }

  let payload;

  try {
    payload = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  if (
    typeof payload !== "object" ||
    !mongoose.isObjectIdOrHexString(payload.sub)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  try {
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}


module.exports = authMiddleware;
