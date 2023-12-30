import asyncHandler from "../middleware/asyncHandler.js";

import User from "../models/UserModel.js";
import Location from "../models/LocationModel.js";
import AdBoard from "../models/AdBoardModel.js";
import AdjustBoard from "../models/AdjustBoardModel.js";
import AdjustLocation from "../models/AdjustLocationModel.js";
import District from "../models/DistrictModel.js";
import LicenseRequest from "../models/LicenseRequest.js";
import Report from "../models/ReportModel.js";
import ReportSolution from "../models/ReportSolutionModel.js";
import Ward from "../models/WardModel.js";

//xử lý trên trang chủ phường
const index = asyncHandler(async (req, res) => {
  res.render("Phuong", { layout: "layoutPhuong" });
});
//xử lý trên trang quản lý bảng quảng cáo
const showAd = asyncHandler(async (req, res) => {
  res.send("this is adMananger Phuong");
});
const editAdMananger = asyncHandler(async (req, res) => {
  res.send("this is edited adMananger Phuong");
});
//xử lý trên trang yeu cầu cấp phép
const showLicense = asyncHandler(async (req, res) => {
  res.send("this is adLicense Phuong");
});
const editLicense = asyncHandler(async (req, res) => {
  res.send("this is edited License Phuong");
});
const deleteLicense = asyncHandler(async (req, res) => {
  res.send("this is delete adLicense Phuong");
});
//xử lý trên trang báo cáo của người dân
const showReport = asyncHandler(async (req, res) => {
  res.send("this is report Phuong");
});
const sendReport = asyncHandler(async (req, res) => {
  res.send("this is post report Phuong");
});

const login = asyncHandler(async (req, res) => {
  res.send("this is login");
});
const logout = asyncHandler(async (req, res) => {
  res.send("this is logout");
});

export {
  login,
  logout,
  index,
  showAd,
  editAdMananger,
  showLicense,
  editLicense,
  deleteLicense,
  showReport,
  sendReport,
};
