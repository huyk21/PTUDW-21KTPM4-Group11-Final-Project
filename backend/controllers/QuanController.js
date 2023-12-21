import asyncHandler from "../middleware/asyncHandler.js";
import AdBoard from "../models/AdBoardModel.js";
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
    //res.send("this is index");
    const user=await AdBoard.find({});
    res.json(user)
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
export { index, login,logout,editAd,showAd,editAdMananger,
    showLicense,editLicense,deleteLicense,showReport,sendReport,
    createAdboard,deleteAd };
