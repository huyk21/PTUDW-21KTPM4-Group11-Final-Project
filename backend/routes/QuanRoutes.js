import express from "express";
const router = express.Router();
import { index,login,editAd,showAd,editAdMananger,showLicense,editLicense,deleteLicense,showReport,sendReport, logout } from "../controllers/QuanController.js";
//xử lý trên trang chủ quận
router.route('/').get(index);
router.route('/').put(editAd);
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

router.route('/login').get(login);
router.route('/logout').get(logout)
export default router;