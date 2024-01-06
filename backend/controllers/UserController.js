import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import request from "request";

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
//===============================================================
const login = (req, res,next) => {
  const secretKey = '6LeRskYpAAAAAA2ZKC4CsakLG8cn7u47Lje7OucN';
  if(!req.body.captcha){
      res.json({
          'success': false,
          'msg': 'Captcha token is undefined'
      });
  }
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
  request(verifyUrl, (err, response, body) =>{
      if(err){
          console.log(err);
          res.status(500).json({ 
              success: false, 
              msg: 'Internal Server Error' 
          });
      }

      body = JSON.parse(body);

      if(!body.success || body.score < 0.4){
          res.json({
              'success': false,
              'msg': 'You might be a robot, sorry!!!', 
              'score': body.score          
          });
      }

      res.json({
          'success': true,
          'msg': 'Login successfully!!!', 
          'score': body.score
      });
      
  })
};
const authUser = asyncHandler(async (req, res) => {
  const { username, password, rememberme } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    //req.session.user = user;
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
      return res.redirect("/api/phuong")
    }
    else if (user.isQuan) {
      return res.redirect("/api/quan/")
    }
    else if (user.isSo) {
      return res.redirect("/api/sovhtt/")
    }
    else {
      return res.redirect("/api/")
    }
  } else {
    res.render("login", {layout: "layoutLogin", message: "Invalid Username or Password"})
  }
});
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
export { login,authUser, logoutUser };
