import express from "express";
const router = express.Router();
import {
  login,
  logout,
  index,
  showAd,
  editAd,
  sendRequest,
  showLicense,
  editLicense,
  deleteLicense,
  showReport,
  showReportDetails,
  updateReportStatus
} from "../controllers/PhuongController.js";

//xử lý trên trang chủ phường
router.route("/").get(index);
//Xử lý trên trang bảng quảng cáo
router.route("/ad_phuong").get(showAd);
router.route("/ad_phuong/edit/:id").get(editAd);
router.route("/ad_phuong/sendRequest").post(sendRequest)
//xử lý trên trang quản lý cấp phép
router.route("/license_phuong").get(showLicense);
router.route("/license_phuong/showLicense/:id")
//xử lý trên trang báo cáo
router.route("/report_phuong").get(showReport);
router.route("/report_phuong/details/:id").get(showReportDetails).post(updateReportStatus)

router.route("/login").get(login);
router.route("/logout").get(logout);
export default router;
