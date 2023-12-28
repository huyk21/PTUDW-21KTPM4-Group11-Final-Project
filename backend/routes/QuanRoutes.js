import express from "express";
const router = express.Router();
import {index,editAd,showAd,editAdMananger,
    showLicense,editLicense,deleteLicense,showReport,sendReport, 
    createAdboard,deleteAd } from "../controllers/QuanController.js";
import { login,authUser, logoutUser } from "../controllers/UserController.js";
import { protect, quan } from "../middleware/authMiddleware.js";


//xử lý trên trang chủ quận
router.route('/').get(index);
router.route('/login').post(login)
router.post('/auth',authUser);
router.post('/logout',logoutUser)
//router.route('/').get(protect,quan,index);
router.route('/:id').put(editAd);
router.route('/').post(createAdboard)
router.route('/:id').delete(deleteAd);
//xử lý trên trang quản lý bảng quảng cáo
router.route('/ad').get(showAd);
router.route('/ad').put(editAdMananger);
//xử lý trên trang quản lý cấp phép
router.route('/license').get(showLicense);
router.route('/license').put(editLicense);
router.route('/license').delete(deleteLicense);
//xử lý trên trang báo cáo
router.route('/report').get(showReport);
router.route('/report').post(sendReport);


export default router;