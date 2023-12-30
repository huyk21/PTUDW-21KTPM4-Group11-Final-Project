import asyncHandler from "../middleware/asyncHandler.js";
import AdBoard from "../models/AdBoardModel.js";
import Report from "../models/ReportModel.js";
import LicenseRequest from "../models/LicenseRequest.js";
import AdjustBoard from "../models/AdjustBoardModel.js";
import Location from "../models/LocationModel.js";
import Ward from "../models/WardModel.js";
import District from "../models/DistrictModel.js";

//xử lý trên trang chủ quận
const createAdboard = asyncHandler(async (req, res) => {
  const adboard = new AdBoard({
    type: "this is type",
    location: "6581b80e58c250685e4e8072",
    properties: {
      quantity: "this is quantity",
      boardType: "this is boardType",
      size: "this is size",
      expirationDate: "2023-12-21",
    },
    geometry: {
      type: "this is type of geometry",
      coordinates: [107, 10],
    },
  });
  const createAdboard = await adboard.save();
  res.status(201).json(createAdboard);
});
const deleteAd = asyncHandler(async (req, res) => {
  const adboard = await AdBoard.findById(req.params.id);

  if (adboard) {
    await AdBoard.deleteOne({ _id: adboard._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
const index = asyncHandler(async (req, res) => {
  //res.send("this is index");
  //const user=await AdBoard.find({});
  res.render("login", { layout: "layoutLogin" });
  //res.json(user)
});

const editAd = asyncHandler(async (req, res) => {
  const { type, location, properties, geometry } = req.body;
  const adboard = await AdBoard.findById(req.params.id);
  if (adboard) {
    adboard.type = type;
    const updateAdboard = await adboard.save();
    res.json(updateAdboard);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
  res.send("Ad edited");
});

//xử lý trên trang quản lý bảng quảng cáo
const showAd = asyncHandler(async (req, res) => {
  const adjustBoard = await AdjustBoard.find({});
  const adjustedBoardsDetails = await Promise.all(
    adjustBoard.map(async (adjustBoard) => {
      const adBoardDetails = await AdBoard.findById(adjustBoard.forID);
      const locationDetails = await Location.findById(adBoardDetails.location);
      const districtDetails = await District.findById(locationDetails.district);
      const wardDetail = await Ward.findById(locationDetails.ward);
      return {
        adjustBoard,
        adBoardDetails,
        locationDetails,
        districtDetails,
        wardDetail,
      };
    })
  );

  res.render("adManager", {
    layout: "layoutAdManager",
    adjustedBoardsDetails: adjustedBoardsDetails,
  });
});
const editAdMananger = asyncHandler(async (req, res) => {
  res.send("this is edited adMananger");
});
//xử lý trên trang yeu cầu cấp phép
const showLicense = asyncHandler(async (req, res) => {
  res.send("this is adLicense");
});
const editLicense = asyncHandler(async (req, res) => {
  res.send("this is edited License");
});
const deleteLicense = asyncHandler(async (req, res) => {
  res.send("this is delete adLicense");
});
//xử lý trên trang báo cáo của người dân
const showReport = asyncHandler(async (req, res) => {
  const reports = await Report.find({});
  const reportDetail = await Promise.all(
    reports.map(async (report) => {
      const location = await Location.findById(report.locationID);
      const ward = await Ward.findById(location.ward);
      const dictrict = await District.findById(location.district);
      return {
        report,
        location,
        ward,
        dictrict,
      };
    })
  );
  res.render("reportManager", {
    layout: "layoutReportManager",
    reportDetail: reportDetail,
  });
});
const showReportId = asyncHandler(async (req, res) => {
  const reports = await Report.find({});
  const reportDetail = await Promise.all(
    reports.map(async (report) => {
      const location = await Location.findById(report.locationID);
      const ward = await Ward.findById(location.ward);
      const dictrict = await District.findById(location.district);
      return {
        report,
        location,
        ward,
        dictrict,
      };
    })
  );
  const reportId = req.params.reportId;
  const report = await Report.findById(reportId);
  if (!report) {
    // Handle the case where the report with the given ID is not found
    res.status(404).send("Report not found");
    return;
  }
  //res.json(report);
  res.render("reportManager2", {
    layout: "layoutReportManager",
    reportDetail: reportDetail,
    report: report,
  });
});
const sendReport = asyncHandler(async (req, res) => {
  res.send("this is post report");
});

const logout = asyncHandler(async (req, res) => {
  res.send("this is logout");
});
export {
  index,
  editAd,
  showAd,
  editAdMananger,
  showLicense,
  editLicense,
  deleteLicense,
  showReport,
  sendReport,
  createAdboard,
  deleteAd,
};
const logout = asyncHandler(async (req, res) => {
  res.send("this is logout");
});
export {
  showReportId,
  index,
  editAd,
  showAd,
  editAdMananger,
  showLicense,
  editLicense,
  deleteLicense,
  showReport,
  sendReport,
  createAdboard,
  deleteAd,
};
