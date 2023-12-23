import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/UserModel.js";

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// User must be an admin
const sovhtt = (req, res, next) => {
  if (req.user && req.user.isSo) {
    next();
  } else {
    res.status(401);
    throw new Error("Khong can bo so vh tt");
  }
};
const quanvhtt = (req, res, next) => {
  if (req.user && req.user.isQuan) {
    next();
  } else {
    res.status(401);
    throw new Error("Khong can bo quan vh tt");
  }
};

export { protect, sovhtt ,quanvhtt};
