import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/UserModel.js";
import request from "request";
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

const captcha = (req, res, next) => {
  const secretKey = "6LeRskYpAAAAAA2ZKC4CsakLG8cn7u47Lje7OucN";
  if (!req.body.captcha) {
    return res.json({
      success: false,
      msg: "Captcha token is undefined",
    });
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;

  request(verifyUrl, (err, response, body) => {
    if (err) {
      console.log("hello");
      return res.status(500).json({
        success: false,
        msg: "Internal Server Error",
      });
    }

    try {
      body = JSON.parse(body);

      if (!body.success || body.score < 0.4) {
        return res.json({
          success: false,
          msg: "You might be a robot, sorry!!!",
          score: body.score,
        });
      }

      res.json({
        success: true,
        msg: "Login successfully!!!",
        score: body.score,
      });
    } catch (parseError) {
      console.error(parseError);
      res.status(500).json({
        success: false,
        msg: "Error parsing response from reCAPTCHA",
      });
    }
  });
};

// User must be an admin
const sovhtt = (req, res, next) => {
  if (req.user && req.user.isSo) {
    next();
  } else {
    res.status(401);
    throw new Error("Khong phai can bo so vh tt");
  }
};
// User must be an admin
const phuong = (req, res, next) => {
  if (req.user && req.user.isPhuong) {
    next();
  } else {
    res.status(401);
    throw new Error("Khong phai can bo phuong");
  }
};
const quan = (req, res, next) => {
  if (req.user && req.user.isQuan) {
    next();
  } else {
    res.status(401);
    throw new Error("Khong phai can bo quan");
  }
};
export { captcha, protect, sovhtt, phuong, quan };
