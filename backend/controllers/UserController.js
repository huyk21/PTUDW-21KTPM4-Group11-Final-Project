import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import request from "request";

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
// const index = asyncHandler(async (req, res) => {
//   res.render("login", { layout: "layoutLogin" });
// });

const login = asyncHandler(async (req, res) => {
  // //recaptcha
  // const secretKey = "6LfLbz4pAAAAAL0dWHhc4aPbNsAPrNvsdSkAX1CF";
  // if (!req.body.captcha) {
  //   return res.json({
  //     success: false,
  //     msg: "Captcha token is undefined",
  //   });
  // }
  // const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
  // request(verifyUrl, (err, response, body) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).json({
  //       success: false,
  //       msg: "Internal Server Error",
  //     });
  //   }

  //   body = JSON.parse(body);

  //   if (!body.success || body.score < 0.4) {
  //     return res.json({
  //       success: false,
  //       msg: "You might be a robot, sorry!!!",
  //       score: body.score,
  //     });
  //   }

  //   return res.json({
  //     success: true,
  //     msg: "Login successfully!!!",
  //     score: body.score,
  //   });
  // });
  // throw new Error("Invalid email or password");

  res.json("chay captcha");
});

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export { login, authUser, logoutUser };
