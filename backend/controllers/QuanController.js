import asyncHandler from "../middleware/asyncHandler.js";
import AdBoard from "../models/AdBoardModel.js";
import Report from "../models/ReportModel.js";
import ReportSolution from "../models/ReportSolutionModel.js";
import LicenseRequest from "../models/LicenseRequest.js";
import AdjustBoard from "../models/AdjustBoardModel.js";
import Location from "../models/LocationModel.js";
import Ward from "../models/WardModel.js";
import District from "../models/DistrictModel.js";

//xử lý trên trang chủ quận

const index = asyncHandler(async (req, res) => {
  const idQuan = "65817cd245551b56b68d8a57";
  const district = await District.findById(idQuan);
  const ward = await Ward.find({ districtID: idQuan });
  res.render("Quan", {
    layout: "layoutQuan",
    district: district,
    ward: ward,
  });
});

// const editAd = asyncHandler(async (req, res) => {
//   const { type, location, properties, geometry } = req.body;
//   const adboard = await AdBoard.findById(req.params.id);
//   if (adboard) {
//     adboard.type = type;
//     const updateAdboard = await adboard.save();
//     res.json(updateAdboard);
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
//   res.send("Ad edited");
// });

//xử lý trên trang quản lý bảng quảng cáo
const showAd = asyncHandler(async (req, res) => {
  const idQuan = "65817cd245551b56b68d8a57";
  const idPhuong = req.params.idPhuong;
  const district = await District.findById(idQuan);
  const ward = await Ward.findById(idPhuong);
  const adboards = await AdBoard.find({});
  const adboardDetail = await Promise.all(
    adboards.map(async (adboard) => {
      const locationDetails = await Location.findById(adboard.location);
      const districtDetails = await District.findById(locationDetails.district);
      const wardDetail = await Ward.findById(locationDetails.ward);
      return {
        adboard,
        locationDetails,
        districtDetails,
        wardDetail,
      };
    })
  );
  const adboardDetails = adboardDetail.filter(
    (details) =>
      details.districtDetails._id.toString() === idQuan.toString() &&
      details.wardDetail._id.toString() === idPhuong.toString()
  );

  res.render("adManagerQuan", {
    layout: "layoutAdManager",
    adboardDetails: adboardDetails,
    district: district,
    ward: ward,
    idPhuong: idPhuong,
  });
});
const showAdId = asyncHandler(async (req, res) => {
  const adboards = await AdBoard.find({});
  const adboardDetail = await Promise.all(
    adboards.map(async (adboard) => {
      const locationDetails = await Location.findById(adboard.location);
      const districtDetails = await District.findById(locationDetails.district);
      const wardDetail = await Ward.findById(locationDetails.ward);
      return {
        adboard,
        locationDetails,
        districtDetails,
        wardDetail,
      };
    })
  );
  const id = req.params.adId;
  const result = adboardDetail.find(
    (details) => details.adboard._id.toString() === id.toString()
  );
  const idQuan = result.districtDetails._id;
  const idPhuong = result.wardDetail._id;
  const district = await District.findById(idQuan);
  const ward = await Ward.findById(idPhuong);
  const adboardDetails = adboardDetail.filter(
    (details) =>
      details.districtDetails._id.toString() === idQuan.toString() &&
      details.wardDetail._id.toString() === idPhuong.toString()
  );
  res.render("adManagerQuan2", {
    layout: "layoutAdManager",
    adboardDetails: adboardDetails,
    result: result,
    district:district,
    ward:ward
  });
});
const store = asyncHandler(async (req, res) => {
  const adjustBoard = new AdjustBoard({
    for: "Biển quảng cáo",
    forID: req.body.id,
    newQuantity: req.body.quantity,
    newBoardType: req.body.boardType,
    newSize: req.body.size,
    newExpirationDate: "2024-01-02",
    adjustDate: req.body.time,
    reason: req.body.reason,
  });
  const adboards = await AdBoard.find({});
  const adboardDetail = await Promise.all(
    adboards.map(async (adboard) => {
      const locationDetails = await Location.findById(adboard.location);
      const districtDetails = await District.findById(locationDetails.district);
      const wardDetail = await Ward.findById(locationDetails.ward);
      return {
        adboard,
        locationDetails,
        districtDetails,
        wardDetail,
      };
    })
  );
  const id = req.body.id;
  const result = adboardDetail.find(
    (details) => details.adboard._id.toString() === id.toString()
  );
  const idQuan = result.districtDetails._id;
  const idPhuong = result.wardDetail._id;
  const createAdjustBoard = await adjustBoard.save();
  res.status(201).redirect(`/api/quan/adManager/${idPhuong}`);
});
//xử lý trên trang yêu cầu cấp phép
const showLicense = asyncHandler(async (req, res) => {
  const idQuan = "65817cd245551b56b68d8a57";
  const idPhuong = req.params.idPhuong;
  const dictrict = await District.findById(idQuan);
  const ward = await Ward.findById(idPhuong);
  const licenses = await LicenseRequest.find({});
  const licenseDetails = await Promise.all(
    licenses.map(async (license) => {
      const location = await Location.findById(license.for);
      const ward = await Ward.findById(location.ward);
      const dictrict = await District.findById(location.district);
      return {
        license,
        location,
        ward,
        dictrict,
      };
    })
  );
  const licenseDetail = licenseDetails.filter(
    (details) =>
      details.dictrict._id.toString() === idQuan.toString() &&
      details.ward._id.toString() === idPhuong.toString()
  );
  res.render("adLicenseQuan", {
    layout: "layoutAdLicense",
    licenseDetail: licenseDetail,
    dictrict: dictrict,
    ward: ward,
    idPhuong: idPhuong,
  });
});
const showLicenseId = asyncHandler(async (req, res) => {
  const licenses = await LicenseRequest.find({});
  const licenseDetails = await Promise.all(
    licenses.map(async (license) => {
      const location = await Location.findById(license.for);
      const ward = await Ward.findById(location.ward);
      const dictrict = await District.findById(location.district);
      return {
        license,
        location,
        ward,
        dictrict,
      };
    })
  );
  const id = req.params.liId;
  const result = licenseDetails.find(
    (details) => details.license._id.toString() === id.toString()
  );

  const idQuan = result.dictrict._id;
  const idPhuong = result.ward._id;
  const dictrict = await District.findById(idQuan);
  const ward = await Ward.findById(idPhuong);
  const licenseDetail = licenseDetails.filter(
    (details) =>
      details.dictrict._id.toString() === idQuan.toString() &&
      details.ward._id.toString() === idPhuong.toString()
  );

  res.render("adLicenseQuan2", {
    layout: "layoutAdLicense",
    licenseDetail: licenseDetail,
    result: result,
    dictrict: dictrict,
    ward: ward,
    idPhuong: idPhuong,
  });
});
const createLicense = asyncHandler(async (req, res) => {
  const idPhuong = req.body.id;
  const idQuan = "65817cd245551b56b68d8a57";
  const location = await Location.find({});
  const locations = await Promise.all(
    location.map(async (location) => {
      const ward = await Ward.findById(location.ward);
      const dictrict = await District.findById(location.district);
      return {
        location,
        ward,
        dictrict,
      };
    })
  );
  const findLocation = locations.find(
    (details) =>
      details.dictrict._id.toString() === idQuan.toString() &&
      details.ward._id.toString() === idPhuong.toString()
  );

  const licenseRequest = new LicenseRequest({
    for: findLocation.location._id,
    adContent: req.body.adContent,
    companyInfo: req.body.companyInfo,
    companyEmail: req.body.companyEmail,
    companyPhone: req.body.companyPhone,
    companyAddress: req.body.companyAddress,
    startDate: req.body.startDate,
    expirationDate: req.body.endDate,
    processStatus: "Đang xử lý",
  });
  const createLicenseRequest = await licenseRequest.save();
  res.status(201).redirect(`/api/quan/license/${idPhuong}`);
});
const deleteLicense = asyncHandler(async (req, res) => {
  const license = await LicenseRequest.findById(req.params.liId);
  const licenses = await LicenseRequest.find({});
  const licenseDetails = await Promise.all(
    licenses.map(async (license) => {
      const location = await Location.findById(license.for);
      const ward = await Ward.findById(location.ward);
      const dictrict = await District.findById(location.district);
      return {
        license,
        location,
        ward,
        dictrict,
      };
    })
  );
  const id = req.params.liId;
  const result = licenseDetails.find(
    (details) => details.license._id.toString() === id.toString()
  );

  const idQuan = result.dictrict._id;
  const idPhuong = result.ward._id;
  if (license) {
    await LicenseRequest.deleteOne({ _id: license._id });
    res.redirect(`/api/quan/license/${idPhuong}`);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
//xử lý trên trang báo cáo
const showReport = asyncHandler(async (req, res) => {
  const idQuan = "65817cd245551b56b68d8a57";
  const idPhuong = req.params.idPhuong;
  const dictrict = await District.findById(idQuan);
  const ward = await Ward.findById(idPhuong);
  const reports = await Report.find({});
  const reportDetails = await Promise.all(
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
  const reportDetail = reportDetails.filter(
    (details) =>
      details.dictrict._id.toString() === idQuan.toString() &&
      details.ward._id.toString() === idPhuong.toString()
  );
  res.render("reportManagerQuan", {
    layout: "layoutReportManager",
    reportDetail: reportDetail,
    dictrict: dictrict,
    ward: ward,
    idPhuong: idPhuong,
  });
});
const showReportId = asyncHandler(async (req, res) => {
  const reports = await Report.find({});
  const reportDetails = await Promise.all(
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
  const result = reportDetails.find(
    (details) => details.report._id.toString() === reportId.toString()
  );
  const idQuan = result.dictrict._id;
  const idPhuong = result.ward._id;
  const dictrict = await District.findById(idQuan);
  const ward = await Ward.findById(idPhuong);
  const reportDetail = reportDetails.filter(
    (details) =>
      details.dictrict._id.toString() === idQuan.toString() &&
      details.ward._id.toString() === idPhuong.toString()
  );
  const report = await Report.findById(reportId);
  res.render("reportManagerQuan2", {
    layout: "layoutReportManager",
    reportDetail: reportDetail,
    report: report,
    dictrict: dictrict,
    ward: ward,
    idPhuong: idPhuong,
  });
});
const editReport = asyncHandler(async (req, res) => {
  const reports = await Report.find({});
  const reportDetails = await Promise.all(
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
  const result = reportDetails.find(
    (details) => details.report._id.toString() === reportId.toString()
  );
  const idQuan = result.dictrict._id;
  const idPhuong = result.ward._id;
  const reportSolution = await ReportSolution.updateOne(
    { for: req.params.reportId },
    {
      method: req.body.method,
      status: req.body.processed,
    }
  );
  res.redirect(`/api/quan/report/${idPhuong}`);
});

export {
  index,
  showAd,
  showAdId,
  store,
  showLicense,
  createLicense,
  showLicenseId,
  deleteLicense,
  showReport,
  showReportId,
  editReport,
};
