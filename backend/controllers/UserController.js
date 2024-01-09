import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import session from "express-session";
// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
//===============================================================
const showLogin = (req, res) => {
  res.render("login", { layout: "layoutLogin" });
};
const authUser = asyncHandler(async (req, res) => {
  const { username, password, rememberme } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    req.session.name = user.name;
    req.session.workWard = user.workWard;
    req.session.workDistrict = user.workDistrict;
    if (rememberme) {
      res.cookie("username", username, {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
        signed: true,
      });
      res.cookie("password", password, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        signed: true,
      });
    }

    if (user.isPhuong) {
      return res.redirect("/api/phuong");
    } else if (user.isQuan) {
      return res.redirect("/api/quan/");
    } else if (user.isSo) {
      return res.redirect("/api/sovhtt/");
    } else {
      return res.redirect("/api/");
    }
  } else {
    res.render("login", {
      layout: "layoutLogin",
      message: "Invalid Username or Password",
    });
  }
});

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error occurred in session destruction");
    } else {
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.status(200).json({ message: "Logged out successfully" });
    }
  });
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
export { authUser, logoutUser, showLogin };
