import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import Report from "../models/ReportModel.js";
import ReportSolution from "../models/ReportSolutionModel.js";
import Location from "../models/LocationModel.js";
import session from "express-session";
import Swal from "sweetalert2";
import MailService from "../backend/html/assets/js/emailService.js";
import bcrypt from "bcryptjs";
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

function generateOTP() {
  // Create an empty string to store the OTP
  let otp = "";

  // Loop 6 times to generate 6 digits
  for (let i = 0; i < 6; i++) {
    // Generate a random number between 0 and 9 using Math.random()
    let randomDigit = Math.floor(Math.random() * 10);

    // Add the random digit to the OTP string
    otp += randomDigit;
  }

  // Return the 6-digit OTP
  return otp;
}

const showChangePassword = asyncHandler(async (req, res) => {
  res.render("changePassword", { layout: "layoutLogin" });
});

const requestOTP = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const pw = req.body.password;
  const pwConfirm = req.body.passwordConfirm;

  if (pw !== pwConfirm) {
    res.redirect("/api/changePassword?success=false");
  } else {
    const OTP = generateOTP();
    MailService.sendOTP(email, OTP);
    req.session.OTP = OTP;
    req.session.userEmail = email;
    req.session.password = pw;
    res.render("confirmOTP", { layout: "layoutLogin" });
  }
});

const showConfirmOTP = asyncHandler(async (req, res) => {
  res.render("confirmOTP", { layout: "layoutLogin" });
});

const confirmOTP = asyncHandler(async (req, res) => {
  const generatedOTP = req.session.OTP;
  const OTP = req.body.otp;
  const password = req.session.password;
  const email = req.session.userEmail;

  if (OTP !== generatedOTP) {
    res.redirect("/api/changePassword/confirmOTP?confirm=false");
  } else {
    const user = await User.findOne({ email: email });

    await user.updateOne({ password: bcrypt.hashSync(password, 10) });
    res.redirect("/api/auth?reset=true");
  }
});

const changePassword = asyncHandler(async (req, res) => {});

const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error occurred in session destruction");
    } else {
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ message: "Logged out successfully" });
    }
  });
});

const showPlace = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id).populate(
    "district",
    "name"
  );

  res.redirect("/");
});

const getReport = asyncHandler(async (req, res) => {
  let body = req.body;
  let locationId = req.body.id; // Use locationID instead of id
  let email = req.body.email;
  let name = req.body.name; // Use reporter instead of name
  let phoneNumber = req.body.phoneNumber; // Use phoneNo instead of phoneNumber
  let reportContent = req.body.reportContent; // Use reportDetails instead of reportContent
  let reportType = req.body.reportType; // Use reportFormat instead of reportType
  const location = await Location.findById(locationId);
  const address = location.address;
  // Format the date as "YY/MM/DD"
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const report = new Report({
    location: address,
    reporter: name,
    email: email,
    phoneNo: phoneNumber,
    reportDetails: reportContent,
    reportFormat: reportType,
    reportDate: formattedDate,
    locationID: locationId,
  });
  const newReport = await report.save();
  const reportSolution = new ReportSolution({
    for: newReport._id,
    method: "Đang chờ xử lý",
    status: "Chưa xử lý",
  });
  const newReportSolution = await reportSolution.save();

  res.status(200).json({ body });
});

const uploadImage = asyncHandler(async (req, res) => {
  res.status(200).json({ body });
});
const showIndex = asyncHandler(async (req, res) => {
  res.render("index.hbs", { layout: "layoutDan" });
});
export {
  showPlace,
  authUser,
  logoutUser,
  showLogin,
  showChangePassword,
  requestOTP,
  changePassword,
  confirmOTP,
  showConfirmOTP,
  getReport,
  uploadImage,
  showIndex,
};
