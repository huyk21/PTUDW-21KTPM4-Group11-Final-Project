import asyncHandler from "../middleware/asyncHandler.js";
//@desc Register user
//@route POST /api/users
//@access Public

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

const index = asyncHandler(async (req, res) => {
  res.render("index", { layout: "layoutSoVHTT" });
});

const dbGenerator = asyncHandler(async (req, res) => {
  const Users = await User.find({});

  const Locations = await Location.find({});

  const AdBoards = await AdBoard.find({});

  const AdjustBoards = await AdjustBoard.find({});

  const AdjustLocations = await AdjustLocation.find({});

  const Districts = await District.find({});

  const LicenseRequests = await LicenseRequest.find({});

  const Reports = await Report.find({});

  const ReportSolutions = await ReportSolution.find({});

  const Wards = await Ward.find({});
  res.json({
    Users,
    Locations,
    AdBoards,
    AdjustBoards,
    AdjustLocations,
    Districts,
    LicenseRequests,
    Reports,
    ReportSolutions,
  });
});

const danhSachQuan = asyncHandler(async (req, res) => {
  res.send("danh sach quan ne!!!");
});

const danhSachPhuong = asyncHandler(async (req, res) => {
  res.send("danh sach phuong ne!!!");
});

const danhSachQuangCao = asyncHandler(async (req, res) => {
  res.send("danh sach quang cao ne!!!");
});

const danhSachDiemDat = asyncHandler(async (req, res) => {
  res.send("danh sach diem dat ne!!!");
});

const danhSachYeuCauCapPhepQuangCao = asyncHandler(async (req, res) => {
  res.send("danh sach yeu cau cap phep quang cao ne!!!");
});

const danhSachYeuCauChinhSuaDiemDat = asyncHandler(async (req, res) => {
  res.send("danh sach yeu cau chinh sua diem dat ne!!!");
});

const danhSachYeuCauChinhSuaQuangCao = asyncHandler(async (req, res) => {
  res.send("danh sach yeu cau chinh sua quang cao ne!!!");
});

const danhSachLoaiDiemDat = asyncHandler(async (req, res) => {
  res.send("danh sach loai diem dat ne!!!");
});

const danhSachHinhThucBaoCao = asyncHandler(async (req, res) => {
  res.send("danh sach hinh thuc bao cao ne!!!");
});

const danhSachHinhThucQuangCao = asyncHandler(async (req, res) => {
  res.send("danh sach hinh thuc quang cao ne!!!");
});

export {
  index,
  dbGenerator,
  danhSachQuan,
  danhSachPhuong,
  danhSachQuangCao,
  danhSachDiemDat,
  danhSachYeuCauCapPhepQuangCao,
  danhSachYeuCauChinhSuaDiemDat,
  danhSachYeuCauChinhSuaQuangCao,
  danhSachLoaiDiemDat,
  danhSachHinhThucBaoCao,
  danhSachHinhThucQuangCao,
};
