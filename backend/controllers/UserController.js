import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import request from "request";
import AdBoard from "../models/AdBoardModel.js";
import Report from "../models/ReportModel.js";
import ReportSolution from "../models/ReportSolutionModel.js";
import LicenseRequest from "../models/LicenseRequest.js";
import AdjustBoard from "../models/AdjustBoardModel.js";
import Location from "../models/LocationModel.js";
import Ward from "../models/WardModel.js";
import District from "../models/DistrictModel.js"
// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
//xử lý trên trang bảng quảng cáo
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
    
    res.render('adManager',{
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
  res.render('adManagerUser',{
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
res.status(201).redirect('/api/adManager');
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

  res.render('adLicense',{
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
  res.render('adLicenseUser',{
      layout:'layoutAdLicense',
      licenseDetail:licenseDetail,
      result:result
})
});
//tạo cấp phép mới
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
res.status(201).redirect('/api/license');
});
const deleteLicense=asyncHandler(async(req,res)=>{
  const license = await LicenseRequest.findById(req.params.liId);
  if (license) {
    await LicenseRequest.deleteOne({ _id: license._id });
    res.redirect('/api/license');
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//xử lý trên trang report
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
  res.render('reportManager',{
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
  res.render('reportManagerUser',{
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
  res.redirect('/api/report');
});
//===============================================================
const login = asyncHandler(async (req, res) => {
  const secretKey = '6Ld51jspAAAAAHTGCUIEF1xOkEFflM0AB08xFJSt';
  if(!req.body.captcha){
      return res.json({
          'success': false,
          'msg': 'Captcha token is undefined'
      });
  }
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
  request(verifyUrl, (err, response, body) =>{
      if(err){
          console.log(err);
          return res.status(500).json({ 
              success: false, 
              msg: 'Internal Server Error' 
          });
      }

      body = JSON.parse(body);

      if(!body.success || body.score < 0.4){
          return res.status(401).json({
              'success': false,
              'msg': 'You might be a robot, sorry!!!', 
              'score': body.score          
          });
      }

      return res.status(200).json({
          'success': true,
          'msg': 'Login successfully!!!', 
          'score': body.score
      });
  })
});
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
export { login,authUser, logoutUser,showAd,showAdId,showLicense,
  showLicenseId,store,createLicense,deleteLicense,showReport,showReportId,editReport };
