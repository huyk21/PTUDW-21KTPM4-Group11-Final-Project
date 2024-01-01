import asyncHandler from "../middleware/asyncHandler.js";
import AdBoard from "../models/AdBoardModel.js";
import Report from "../models/ReportModel.js";
import ReportSolution from "../models/ReportSolutionModel.js";
import LicenseRequest from "../models/LicenseRequest.js";
import AdjustBoard from "../models/AdjustBoardModel.js";
import Location from "../models/LocationModel.js";
import Ward from "../models/WardModel.js";
import District from "../models/DistrictModel.js"

//xử lý trên trang chủ quận
const createAdboard=asyncHandler(async(req,res)=>{
    const adboard=new AdBoard({
        type:"this is type",
        location:"6581b80e58c250685e4e8072",
        properties:{
            quantity:"this is quantity",
            boardType:"this is boardType",
            size:"this is size",
            expirationDate:"2023-12-21",
        },
        geometry:{
            type:"this is type of geometry",
            coordinates:[
                107,10
            ]
        }
    });
    const createAdboard=await adboard.save();
    res.status(201).json(createAdboard);
});
const deleteAd = asyncHandler(async (req, res) => {
    const adboard = await AdBoard.findById(req.params.id);
  
    if (adboard) {
      await AdBoard.deleteOne({ _id: adboard._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  });
const index = asyncHandler(async (req, res) => {

    res.render('Quan',{layout:'layoutQuan'})

  });
  
const editAd=asyncHandler(async (req, res) => {
    const {type,location,properties,geometry}=req.body;
    const adboard=await AdBoard.findById(req.params.id);
    if (adboard) {
        adboard.type=type;
        const updateAdboard = await adboard.save();
        res.json(updateAdboard);
      } else {
        res.status(404);
        throw new Error('Product not found');
    }
    res.send("Ad edited");
  });

//xử lý trên trang quản lý bảng quảng cáo
const showAd=asyncHandler(async(req,res)=>{
  const adboards=await AdBoard.find({});
  const adboardDetails = await Promise.all(
      adboards.map(async (adboard) => {
      const locationDetails = await Location.findById(adboard.location);
      const districtDetails= await District.findById(locationDetails.district);
      const wardDetail=await Ward.findById(locationDetails.ward);
      return {
        adboard,
        locationDetails,
        districtDetails,
        wardDetail
      };
    })
  );
    
    res.render('adManagerQuan',{
        layout:'layoutAdManager',
        adboardDetails:adboardDetails
})
});
const showAdId=asyncHandler(async(req,res)=>{
  const adboards=await AdBoard.find({});
  const adboardDetails = await Promise.all(
      adboards.map(async (adboard) => {
      const locationDetails = await Location.findById(adboard.location);
      const districtDetails= await District.findById(locationDetails.district);
      const wardDetail=await Ward.findById(locationDetails.ward);
      return {
        adboard,
        locationDetails,
        districtDetails,
        wardDetail
      };
    })
  );
  const id = req.params.adId;
  const result = adboardDetails.find(details => details.adboard._id.toString() === id.toString());
  res.render('adManagerQuan2',{
      layout:'layoutAdManager',
      adboardDetails:adboardDetails,
      result:result
})
});
const store=asyncHandler(async(req,res)=>{
  const adjustBoard=new AdjustBoard({
    for:"Biển quảng cáo",
    forID:req.body.id,
    newQuantity:req.body.quantity,
    newBoardType:req.body.boardType,
    newSize:req.body.size,
    newExpirationDate:"2024-01-02",
    adjustDate:req.body.time,
    reason:req.body.reason,
});
const createAdjustBoard=await adjustBoard.save();
res.status(201).redirect('/api/quan/adManager');
});
//xử lý trên trang yêu cầu cấp phép
const showLicense=asyncHandler(async(req,res)=>{
  const licenses=await LicenseRequest.find({});
  const licenseDetail = await Promise.all(
      licenses.map(async (license) => {
      const location = await Location.findById(license.for);
      const ward =await Ward.findById(location.ward);
      const dictrict=await District.findById(location.district);
      return {
          license,
          location,
          ward,
          dictrict,
      };
    })
  );

  res.render('adLicenseQuan',{
      layout:'layoutAdLicense',
      licenseDetail:licenseDetail
})
});
const showLicenseId=asyncHandler(async(req,res)=>{
  const licenses=await LicenseRequest.find({});
  const licenseDetail = await Promise.all(
      licenses.map(async (license) => {
      const location = await Location.findById(license.for);
      const ward =await Ward.findById(location.ward);
      const dictrict=await District.findById(location.district);
      return {
          license,
          location,
          ward,
          dictrict,
      };
    })
  );
  const id = req.params.liId;
  const result = licenseDetail.find(details => details.license._id.toString() === id.toString());
  res.render('adLicenseQuan2',{
      layout:'layoutAdLicense',
      licenseDetail:licenseDetail,
      result:result
})
});
const createLicense=asyncHandler(async(req,res)=>{
  const licenseRequest=new LicenseRequest({
    for:"6581b80e58c250685e4e8086",
    adContent:req.body.adContent,
    companyInfo:req.body.companyInfo,
    companyEmail:req.body.companyEmail,
    companyPhone:req.body.companyPhone,
    companyAddress:req.body.companyAddress,
    startDate:req.body.startDate,
    expirationDate:req.body.endDate,
    processStatus:"Đang xử lý",
});
const createLicenseRequest=await licenseRequest.save();
res.status(201).redirect('/api/quan/license');
});
const deleteLicense=asyncHandler(async(req,res)=>{
  const license = await LicenseRequest.findById(req.params.liId);
  if (license) {
    await LicenseRequest.deleteOne({ _id: license._id });
    res.redirect('/api/quan/license');
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
//xử lý trên trang báo cáo
const showReport=asyncHandler(async(req,res)=>{
  const reports=await Report.find({});
  const reportDetail = await Promise.all(
      reports.map(async (report) => {
      const location = await Location.findById(report.locationID);
      const ward =await Ward.findById(location.ward);
      const dictrict=await District.findById(location.district);
      return {
          report,
          location,
          ward,
          dictrict,
      };
    })
  );
  res.render('reportManagerQuan',{
      layout:'layoutReportManager',
      reportDetail:reportDetail,
})
});
const showReportId=asyncHandler(async(req,res)=>{
  const reports=await Report.find({});
  const reportDetail = await Promise.all(
      reports.map(async (report) => {
      const location = await Location.findById(report.locationID);
      const ward =await Ward.findById(location.ward);
      const dictrict=await District.findById(location.district);
      return {
          report,
          location,
          ward,
          dictrict,
      };
    })
  );
  const reportId = req.params.reportId
  const report = await Report.findById(reportId);
  if (!report) {
      // Handle the case where the report with the given ID is not found
      res.status(404).send('Report not found');
      return;
    }
  //res.json(report);
  res.render('reportManagerQuan2',{
      layout:'layoutReportManager',
      reportDetail:reportDetail,
      report:report,
})
});
const editReport=asyncHandler(async (req, res) => {
  const reportSolution = await ReportSolution.updateOne({ for: req.params.reportId },{
    method:req.body.method,
    status:req.body.processed
  });
  res.redirect('/api/quan/report');
});

export {index,editAd,
    createAdboard,deleteAd,showAd,showAdId,store,showLicense,createLicense,showLicenseId,
    deleteLicense,showReport,showReportId,editReport};
