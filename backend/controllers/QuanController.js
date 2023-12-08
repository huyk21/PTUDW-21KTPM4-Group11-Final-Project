import asyncHandler from "../middleware/asyncHandler.js";
//xử lý trên trang chủ quận
const index = asyncHandler(async (req, res) => {
    res.send("this is index");
  });
  
const editAd=asyncHandler(async (req, res) => {
    res.send("Ad edited");
  });
//xử lý trên trang quản lý bảng quảng cáo
const showAd=asyncHandler(async(req,res)=>{
    res.send("this is adMananger");
});
const editAdMananger=asyncHandler(async(req,res)=>{
    res.send("this is edited adMananger");
});
//xử lý trên trang yeu cầu cấp phép
const showLicense=asyncHandler(async(req,res)=>{
    res.send("this is adLicense");
});
const editLicense=asyncHandler(async(req,res)=>{
    res.send("this is edited License");
});
const deleteLicense=asyncHandler(async(req,res)=>{
    res.send("this is delete adLicense");
});
//xử lý trên trang báo cáo của người dân
const showReport=asyncHandler(async(req,res)=>{
    res.send("this is report");
});
const sendReport=asyncHandler(async(req,res)=>{
    res.send("this is post report");
});
const login = asyncHandler(async (req, res) => {
    res.send("this is login");
  });
const logout= asyncHandler(async(req,res)=>{
    res.send("this is logout");
})
export { index, login,logout,editAd,showAd,editAdMananger,showLicense,editLicense,deleteLicense,showReport,sendReport };
