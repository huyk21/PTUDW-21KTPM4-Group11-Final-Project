import express from "express";
const router = express.Router();
import {login,logout,index,showAd,editAdMananger,showLicense,editLicense,deleteLicense,showReport,sendReport} from "../controllers/PhuongController.js";

import { authUser, logoutUser } from "../controllers/UserController.js";
import { protect, sovhtt } from "../middleware/authMiddleware.js";

//xử lý trên trang chủ phường
router.route("/").post(index).get(index);
//Xử lý trên trang bảng quảng cáo
router.route('/adMananger_phuong').get(showAd);
router.route('/adMananger_phuong').put(editAdMananger);
//xử lý trên trang quản lý cấp phép
router.route('/license_phuong').get(showLicense);
router.route('/license_phuong').put(editLicense);
router.route('/license_phuong').delete(deleteLicense);
//xử lý trên trang báo cáo
router.route('/report_phuong').get(showReport);
router.route('/report_phuong').post(sendReport);

router.route('/login').get(login);
router.route('/logout').get(logout);
export default router;