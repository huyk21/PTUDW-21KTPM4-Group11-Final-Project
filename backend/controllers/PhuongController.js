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
  const name = req.session.name
  res.render("Phuong", { layout: "layoutPhuong", name: name });
});
//xử lý trên trang quản lý bảng quảng cáo
const showAd = asyncHandler(async (req, res) => {
  try {
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

    const workWard = req.session.workWard

    const ward = await Ward.findById(workWard)
    
    res.locals.adboard = adboard.filter((ad) => ad.ward._id.toString() === workWard)
    res.render("adManager", {layout: "layoutAdManager", wardname: ward})
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

  const workWard = req.session.workWard

  const ward = await Ward.findById(workWard)

  const result = adboard.filter((ad) => ad.ward._id.toString() === workWard)
  const details = adboard.filter((ad) => ad.location._id.toString() === adID.toString())
  res.render("adManager_modal", {layout: "layoutAdManager", adboard: result, details: details[0], wardname: ward})
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
  res.redirect("/api/phuong/ad_phuong?success=true")
})

//xử lý trên trang yeu cầu cấp phép
const showLicense = asyncHandler(async (req, res) => {
  try {
    const license = await LicenseRequest.aggregate([
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
          "location.district": 0
        }
      }
    ])

    const workWard = req.session.workWard
    const ward = await Ward.findById(workWard)
    res.locals.license = license.filter((li) => li.location.ward.toString() === workWard)
    res.render("adLicense", {layout: "layoutAdLicense", ward: ward})
  }
  catch(error) {
    console.error(error)
  }
});

const createLicense = asyncHandler(async (req, res) => {
  const address = req.body.ad
  const location = await Location.findOne({address: address})
  
  const license = new LicenseRequest({
    for: location._id,
    adContent: req.body.adContent,
    companyInfo: req.body.companyInfo,
    companyEmail: req.body.companyEmail,
    companyPhone: req.body.companyPhone,
    companyAddress: req.body.companyAddress,
    startDate: req.body.startDate,
    expirationDate: req.body.endDate,
    processStatus: "Đang xử lý"
  })
  
  await LicenseRequest.collection.insertOne(license)
  res.redirect("/api/phuong/license_phuong?success=true")
});

const showConfirm = asyncHandler(async (req, res) => {
  const id = req.params.id

  const licenses = await LicenseRequest.aggregate([
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
        "location.district": 0
      }
    }
  ])

  const workWard = req.session.workWard
  const ward = await Ward.findById(workWard)

  const wardLicenses = licenses.filter((li) => li.location.ward.toString() === workWard)
  const results = licenses.filter((li) => li._id.toString() === id)
  res.render("adLicense_modal", {layout: "layoutAdLicense", license: wardLicenses, selected: results[0], ward: ward})
})

const deleteLicense = asyncHandler(async (req, res) => {
  const id = req.params.id

  await LicenseRequest.deleteOne({_id: id})

  res.redirect("/api/phuong/license_phuong?delete=true")
});

//xử lý trên trang báo cáo của người dân
const showReport = asyncHandler(async (req, res) => {
  try {
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
        $project: {
          _id: 1,
          "location._id": 0,
          "location.ward": 0,
          "ward.districtID": 0,
        },
      }
    ]);

    const workWard = req.session.workWard
    const ward = await Ward.findById(workWard)

    res.locals.report = report.filter((rp) => rp.ward._id.toString() === workWard)
    res.render("reportManager", {
      layout: "layoutReportManager", ward: ward
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
    }
  ]);

  const workWard = req.session.workWard
  const ward = await Ward.findById(workWard)
  const result = report.filter((rp) => rp.ward._id.toString() === workWard)
  const details = report.filter((rp) => rp._id.toString() === reportID.toString())
  res.render("reportManager_modal", {layout: "layoutReportManager", report: result, details: details[0], ward: ward})
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

  res.redirect("/api/phuong/report_phuong?success=true")
})

export {
  index,
  showAd,
  editAd,
  sendRequest,
  showLicense,
  createLicense,
  showConfirm,
  deleteLicense,
  showReport,
  showReportDetails,
  updateReportStatus,
};
