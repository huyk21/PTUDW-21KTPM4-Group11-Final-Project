import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from "mongoose";
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
  res.render("SoVHTT", {
    layout: "layoutSoVHTT",
  });
});

const addLocation = asyncHandler(async (req, res) => {
  const location = new Location({
    address: "address example 5",
    district: "65817cd245551b56b68d8a57",
    ward: "6581882f45551b56b68d8b6c",
    locationType: "Đất tư nhân, nhà ở riêng lẻ",
    adFormat: "ad format",
    status: "status",
  });

  const createdLocation = await location.save();

  res.status(201).json(createdLocation);
});

const updateLocation = asyncHandler(async (req, res) => {
  const { address, locationType, adFormat, status } = req.body;

  const location = await Location.findById(req.params.id);

  if (location) {
    location.address = address;
    // location.district = district;
    // location.ward = ward;
    // location.locationType = locationType;
    // location.adFormat = adFormat;
    // location.status = status;

    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } else {
    res.status(404);
    throw new Error("Location not found");
  }
});

const readAdBoardOfLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (location) {
    // location.address = address;
    // location.district = district;
    // location.ward = ward;
    // location.locationType = locationType;
    // location.adFormat = adFormat;
    // location.status = status;

    res.json(location.$getPopulatedDocs());

    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } else {
    res.status(404);
    throw new Error("Location not found");
  }
});

const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (location) {
    await Location.deleteOne({ _id: location._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// const dbGenerator = asyncHandler(async (req, res) => {

//   const Users = await User.find({});

//   const Locations = await Location.find({});

//   const AdBoards = await AdBoard.find({});

//   const AdjustBoards = await AdjustBoard.find({});

//   const AdjustLocations = await AdjustLocation.find({});

//   const Districts = await District.find({});

//   const LicenseRequests = await LicenseRequest.find({});

//   const Reports = await Report.find({});

//   const ReportSolutions = await ReportSolution.find({});

//   const Wards = await Ward.find({});
//   res.json({
//     Users,
//     Locations,
//     AdBoards,
//     AdjustBoards,
//     AdjustLocations,
//     Districts,
//     LicenseRequests,
//     Reports,
//     ReportSolutions,
//   });
// });

//@desc Danh sach các quận
//@route GET /api/svhtt/danh-sach-quan
//@access ...

const danhSachQuan = asyncHandler(async (req, res) => {
  const districts = await District.find({});
  if (districts) {
    // districts = districts.map((district) => district.toObject());
    // res.json({ districts });
    res.render("SoVHTT_DSQuan", {
      layout: "layoutSoVHTT_function",
      // districts: multipleMongooseToObject(districts),
      districts,
    });
  }
});

const danhSachPhuong = asyncHandler(async (req, res) => {
  const district = await District.findById(req.params.id);
  try {
    const districtId = new mongoose.Types.ObjectId(req.params.id);
    const wards = await District.aggregate([
      {
        $match: {
          _id: districtId,
        },
      },
      {
        $lookup: {
          from: "wards", // Replace with the actual name of your Ward collection
          localField: "_id",
          foreignField: "districtID",
          as: "wards",
        },
      },
      {
        $unwind: "$wards",
      },
      {
        $project: {
          _id: "$wards._id",
          name: "$wards.name", // Replace with the actual field names in your "Ward" collection
          // Add other fields as needed
        },
      },
    ]);
    if (wards && district) {
      res.render("SoVHTT_DSPhuong", {
        layout: "layoutSoVHTT_function",
        wards,
        district,
      });
      // res.send({ wards, district });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const danhSachQuangCao = asyncHandler(async (req, res) => {
  try {
    const adboards = await AdBoard.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $unwind: "$locationDetails",
      },
      {
        $lookup: {
          from: "wards",
          localField: "locationDetails.ward",
          foreignField: "_id",
          as: "wardDetails",
        },
      },
      {
        $unwind: "$wardDetails",
      },
      {
        $lookup: {
          from: "districts",
          localField: "locationDetails.district",
          foreignField: "_id",
          as: "districtDetails",
        },
      },
      {
        $unwind: "$districtDetails",
      },
      {
        $project: {
          _id: 1,
          type: 1,
          properties: 1,
          geometry: 1,
          district: "$districtDetails",
          ward: "$wardDetails",
          location: "$locationDetails",
        },
      },
    ]);

    if (adboards) {
      res.render("SoVHTT_DSQCao", {
        layout: "layoutSoVHTT_function",
        adboards,
      });
      // res.send(adboards);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const danhSachQuangCaoCuaDiemDat = asyncHandler(async (req, res) => {
  try {
    const locationId = new mongoose.Types.ObjectId(req.params.id);
    const adboards = await AdBoard.aggregate([
      {
        $match: { location: locationId },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $unwind: "$locationDetails",
      },
      {
        $lookup: {
          from: "wards",
          localField: "locationDetails.ward",
          foreignField: "_id",
          as: "wardDetails",
        },
      },
      {
        $unwind: "$wardDetails",
      },
      {
        $lookup: {
          from: "districts",
          localField: "locationDetails.district",
          foreignField: "_id",
          as: "districtDetails",
        },
      },
      {
        $unwind: "$districtDetails",
      },
      {
        $project: {
          _id: 1,
          type: 1,
          properties: 1,
          geometry: 1,
          district: "$districtDetails",
          ward: "$wardDetails",
          location: "$locationDetails",
        },
      },
    ]);

    if (adboards) {
      res.render("SoVHTT_DSQCao", {
        layout: "layoutSoVHTT_function",
        adboards,
      });
      // res.send(adboards);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const danhSachDiemDat = asyncHandler(async (req, res) => {
  try {
    const locations = await Location.aggregate([
      {
        $lookup: {
          from: "districts",
          localField: "district",
          foreignField: "_id",
          as: "districtDetails",
        },
      },
      {
        $unwind: "$districtDetails",
      },
      {
        $lookup: {
          from: "wards",
          localField: "ward",
          foreignField: "_id",
          as: "wardDetails",
        },
      },
      {
        $unwind: "$wardDetails",
      },
      {
        $lookup: {
          from: "adboards", // Replace with the actual name of your "Pictures" collection
          localField: "_id", // Assuming _id is the location id
          foreignField: "location",
          as: "adboardDetails",
        },
      },
      {
        $unwind: "$adboardDetails",
      },
      {
        $project: {
          _id: 1,
          address: 1,
          adFormat: 1,
          locationType: 1,
          status: 1,
          district: "$districtDetails",
          ward: "$wardDetails",
          adboard: "$adboardDetails",
        },
      },
    ]);

    if (locations) {
      res.render("SoVHTT_DSDiemDat", {
        layout: "layoutSoVHTT_function",
        locations,
      });
      // res.send(locations);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const danhSachDiemDatCuaPhuong = asyncHandler(async (req, res) => {
  try {
    const wardId = new mongoose.Types.ObjectId(req.params.id);
    const locations = await Location.aggregate([
      {
        $match: { ward: wardId },
      },
      {
        $lookup: {
          from: "districts",
          localField: "district",
          foreignField: "_id",
          as: "districtDetails",
        },
      },
      {
        $unwind: "$districtDetails",
      },
      {
        $lookup: {
          from: "wards",
          localField: "ward",
          foreignField: "_id",
          as: "wardDetails",
        },
      },
      {
        $unwind: "$wardDetails",
      },
      {
        $lookup: {
          from: "adboards", // Replace with the actual name of your "Pictures" collection
          localField: "_id", // Assuming _id is the location id
          foreignField: "location",
          as: "adboardDetails",
        },
      },
      {
        $unwind: "$adboardDetails",
      },
      {
        $project: {
          _id: 1,
          address: 1,
          adFormat: 1,
          locationType: 1,
          status: 1,
          district: "$districtDetails",
          ward: "$wardDetails",
          adboard: "$adboardDetails",
        },
      },
    ]);

    if (locations && wardId) {
      res.render("SoVHTT_DSDiemDat", {
        layout: "layoutSoVHTT_function",
        locations,
      });
      // res.send(locations);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const danhSachYeuCauCapPhepQuangCao = asyncHandler(async (req, res) => {
  try {
    const licenserequests = await LicenseRequest.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "for",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $unwind: "$locationDetails",
      },
      {
        $project: {
          adContent: 1,
          companyInfo: 1,
          companyEmail: 1,
          companyPhone: 1,
          companyAddress: 1,
          startDate: 1,
          expirationDate: 1,
          processStatus: 1,
          location: "$locationDetails",
        },
      },
    ]);

    if (licenserequests) {
      res.render("SoVHTT_DSYCCPhepQCao", {
        layout: "layoutSoVHTT_function",
        licenserequests,
      });
      // res.send(adboards);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const danhSachYeuCauChinhSuaDiemDat = asyncHandler(async (req, res) => {
  // const adjustlocations = await AdjustLocation.find({});
  // res.render("SoVHTT_YCCSuaDDat", {
  //   layout: "layoutSoVHTT_function",
  //   adjustlocations,
  // });

  try {
    const adjustlocations = await AdjustLocation.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "forID",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $unwind: "$locationDetails",
      },
      {
        $lookup: {
          from: "wards",
          localField: "locationDetails.ward",
          foreignField: "_id",
          as: "wardOfLocation",
        },
      },
      {
        $unwind: "$wardOfLocation",
      },
      {
        $lookup: {
          from: "districts",
          localField: "locationDetails.district",
          foreignField: "_id",
          as: "districtOfLocation",
        },
      },
      {
        $unwind: "$districtOfLocation",
      },
      {
        $project: {
          for: 1,
          newAddress: 1,
          newLocationType: 1,
          newAdFormat: 1,
          newStatus: 1,
          adjustDate: 1,
          reason: 1,
          location: "$locationDetails",
          ward: "$wardOfLocation",
          district: "$districtOfLocation",
        },
      },
    ]);

    if (adjustlocations) {
      res.render("SoVHTT_YCCSuaDDat", {
        layout: "layoutSoVHTT_function",
        adjustlocations,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const danhSachYeuCauChinhSuaQuangCao = asyncHandler(async (req, res) => {
  // const adjustboards = await AdjustBoard.find({});
  // res.render("SoVHTT_DSYCCSuaQCao", {
  //   layout: "layoutSoVHTT_function",
  //   adjustboards,
  // });

  try {
    const adjustboards = await AdjustBoard.aggregate([
      {
        $lookup: {
          from: "adboards",
          localField: "forID",
          foreignField: "_id",
          as: "adboardDetails",
        },
      },
      {
        $unwind: "$adboardDetails",
      },
      {
        $lookup: {
          from: "locations",
          localField: "adboardDetails.location",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $unwind: "$locationDetails",
      },
      {
        $lookup: {
          from: "wards",
          localField: "locationDetails.ward",
          foreignField: "_id",
          as: "wardOfLocation",
        },
      },
      {
        $unwind: "$wardOfLocation",
      },
      {
        $lookup: {
          from: "districts",
          localField: "locationDetails.district",
          foreignField: "_id",
          as: "districtOfLocation",
        },
      },
      {
        $unwind: "$districtOfLocation",
      },
      {
        $project: {
          for: 1,
          newQuantity: 1,
          newBoardType: 1,
          newSize: 1,
          newExpirationDate: 1,
          adjustDate: 1,
          reason: 1,
          forAdboard: "$adboardDetails",
          location: "$locationDetails",
          ward: "$wardOfLocation",
          district: "$districtOfLocation",
        },
      },
    ]);

    if (adjustboards) {
      res.render("SoVHTT_DSYCCSuaQCao", {
        layout: "layoutSoVHTT_function",
        adjustboards,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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

//Thống kê báo cáo các quận
const thongKeBaoCao = asyncHandler(async (req, res) => {
  // res.render("SoVHTT_TKBaoCao", {
  //   layout: "layoutSoVHTT_function",
  // });
  const status = "Đã xử lý";

  try {
    const districts = await District.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "_id",
          foreignField: "district",
          as: "locations",
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "locations._id",
          foreignField: "locationID",
          as: "reports",
        },
      },
      {
        $lookup: {
          from: "reportsolutions",
          localField: "reports._id",
          foreignField: "for",
          as: "allreportsolutions",
        },
      },
      {
        $lookup: {
          from: "reportsolutions",
          let: { reportIds: "$reports._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$for", "$$reportIds"] },
                    { $eq: ["$status", "Đã xử lý xong"] },
                  ],
                },
              },
            },
            {
              $count: "processedReportsolutionsCount",
            },
          ],
          as: "processedReportsolutionsCount",
        },
      },
      {
        $project: {
          name: 1,
          numberOfReports: { $size: "$reports" },
          numberOfProcessedReportsolutions: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$processedReportsolutionsCount.processedReportsolutionsCount",
                  0,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    if (districts) {
      res.render("SoVHTT_TKBaoCao", {
        layout: "layoutSoVHTT_function",
        districts,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  // const wardName = "Phường Đa Kao - Q1";
  // // console.log(wardName);

  // try {
  //   const districts = await District.aggregate([
  //     {
  //       $lookup: {
  //         from: "wards",
  //         let: { districtId: "$_id" },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ["$districtID", "$$districtId"] },
  //                   { $eq: ["$name", wardName] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //         as: "wards",
  //       },
  //     },
  //     {
  //       $project: {
  //         name: 1,
  //         numberOfReports: { $size: "$wards" },
  //       },
  //     },
  //   ]);

  //   if (districts) {
  //     res.render("SoVHTT_TKBaoCao", {
  //       layout: "layoutSoVHTT_function",
  //       districts,
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
});

const thongKeBaoCaoQuan = asyncHandler(async (req, res) => {
  res.send("danh sach hinh thuc quang cao ne!!!");
});

const thongKeBaoCaoPhuong = asyncHandler(async (req, res) => {
  res.send("danh sach hinh thuc quang cao ne!!!");
});

export {
  index,
  addLocation,
  updateLocation,
  deleteLocation,
  danhSachQuan,
  danhSachPhuong,
  danhSachQuangCao,
  danhSachDiemDat,
  danhSachQuangCaoCuaDiemDat,
  danhSachDiemDatCuaPhuong,
  danhSachYeuCauCapPhepQuangCao,
  danhSachYeuCauChinhSuaDiemDat,
  danhSachYeuCauChinhSuaQuangCao,
  danhSachLoaiDiemDat,
  danhSachHinhThucBaoCao,
  danhSachHinhThucQuangCao,
  thongKeBaoCao,
  thongKeBaoCaoQuan,
  thongKeBaoCaoPhuong,
};
