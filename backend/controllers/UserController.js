import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import request from "request";
import AdBoard from "../models/AdBoardModel.js";
import Report from "../models/ReportModel.js";
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
  res.render('adManagerQuan',{
      layout:'layoutAdManager',
      adboardDetails:adboardDetails,
      result:result
})
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
  res.render('adLicenseQuan',{
      layout:'layoutAdLicense',
      licenseDetail:licenseDetail,
      result:result
})
});

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
export { login,authUser, logoutUser,showAd,showAdId,showLicense,showLicenseId };
