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
  try {
    res.locals.adboard = await AdBoard.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: "$location",
      },
      {
        $lookup: {
          from: "districts",
          localField: "location.district",
          foreignField: "_id",
          as: "district",
        },
      },
      {
        $unwind: "$district",
      },
      {
        $lookup: {
          from: "wards",
          localField: "location.ward",
          foreignField: "_id",
          as: "ward",
        },
      },
      {
        $unwind: "$ward",
      },
      {
        $project: {
          type: 1,
          adboard: "$properties", // Rename 'properties' to 'adboard'
          location: 1,
          district: 1,
          ward: 1,
          _id: 1,
        },
      },
    ]);
    res.render("adManager", {layout: "layoutAdManager"})
  } catch (error) {
    console.error(error);
  }
});

const editAd = asyncHandler(async (req, res) => {
  const adID = req.params.id
  const adboard = await AdBoard.aggregate([
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $unwind: "$location",
    },
    {
      $lookup: {
        from: "districts",
        localField: "location.district",
        foreignField: "_id",
        as: "district",
      },
    },
    {
      $unwind: "$district",
    },
    {
      $lookup: {
        from: "wards",
        localField: "location.ward",
        foreignField: "_id",
        as: "ward",
      },
    },
    {
      $unwind: "$ward",
    },
    {
      $project: {
        type: 1,
        adboard: "$properties", // Rename 'properties' to 'adboard'
        location: 1,
        district: 1,
        ward: 1,
        _id: 1,
      },
    },
  ]);
  const details = adboard.filter((ad) => ad.location._id.toString() === adID.toString())
  //res.json(details[0])
  res.render("adManager_modal", {layout: "layoutAdManager", adboard: adboard, details: details[0]})
});

const sendRequest = asyncHandler(async (req, res) => {
  const request = new AdjustBoard({
    for: "Biển quảng cáo",
    forID: req.body.id,
    newQuantity: req.body.quantity,
    newBoardType: req.body.boardType,
    newSize: req.body.size,
    newExpirationDate: req.body.expDate,
    adjustDate: req.body.time,
    reason: req.body.reason
  })

  await AdjustBoard.collection.insertOne(request)
  
  res.redirect("/api/phuong/ad_phuong")
})

//xử lý trên trang yeu cầu cấp phép
const showLicense = asyncHandler(async (req, res) => {
  try {
    res.locals.license = await LicenseRequest.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "for",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: "$location",
      },
      {
        $project: {
          "location._id": 0,
          "location.district": 0,
          "location.ward": 0
        }
      }
    ])
    res.render("adLicense", {layout: "layoutAdLicense"})
  }
  catch(error) {
    console.error(error)
  }
});
const editLicense = asyncHandler(async (req, res) => {
  res.send("this is edited License Phuong");
});
const deleteLicense = asyncHandler(async (req, res) => {
  res.send("this is delete adLicense Phuong");
});
//xử lý trên trang báo cáo của người dân
const showReport = asyncHandler(async (req, res) => {
  try {
    res.locals.report = await Report.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "locationID",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: "$location",
      },
      {
        $lookup: {
          from: "wards",
          localField: "location.ward",
          foreignField: "_id",
          as: "ward",
        },
      },
      {
        $unwind: "$ward",
      },
      {
        $project: {
          _id: 1,
          "location._id": 0,
          "location.ward": 0,
          "ward.districtID": 0,
        },
      },
      {
        $match: {
          "ward.name": "Phường Đa Kao - Q1",
        },
      },
    ]);
    res.render("reportManager", {
      layout: "layoutReportManager",
    });
  } catch (error) {
    console.error(error);
  }
});

const showReportDetails = asyncHandler(async (req, res) => {
  const reportID = req.params.id
  const report = await Report.aggregate([
    {
      $lookup: {
        from: "locations",
        localField: "locationID",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $unwind: "$location",
    },
    {
      $lookup: {
        from: "wards",
        localField: "location.ward",
        foreignField: "_id",
        as: "ward",
      },
    },
    {
      $unwind: "$ward",
    },
    {
      $lookup: {
        from: "adboards",
        localField: "locationID",
        foreignField: "location",
        as: "adboard",
      },
    },
    {
      $unwind: "$adboard",
    },
    {
      $project: {
        _id: 1,
        "location._id": 0,
        "location.ward": 0,
        "ward.districtID": 0,
        "adboard.location": 0
      },
    },
    {
      $match: {
        "ward.name": "Phường Đa Kao - Q1",
      },
    },
  ]);
  const details = report.filter((rp) => rp._id.toString() === reportID.toString())
  res.render("reportManager_modal", {layout: "layoutReportManager", report: report, details: details[0]})
})

const updateReportStatus = asyncHandler(async (req, res) => {

  await ReportSolution.updateOne(
    { for: req.params.id },
    {
      method: req.body.method,
      status: req.body.processed,
    },
    {upsert: true}
  );

  res.redirect("/api/phuong/report_phuong")
})

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
  editAd,
  sendRequest,
  showLicense,
  editLicense,
  deleteLicense,
  showReport,
  showReportDetails,
  updateReportStatus,
};
