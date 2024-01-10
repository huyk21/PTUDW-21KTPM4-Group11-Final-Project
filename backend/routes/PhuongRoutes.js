import express from "express";
const router = express.Router();
import {
  index,
  showAd,
  editAd,
  sendRequest,
  showLicense,
  createLicense,
  showConfirm,
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
router.route("/license_phuong/create").post(createLicense)
router.route("/license_phuong/confirmDelete/:id").get(showConfirm)
router.route("/license_phuong/delete/:id").get(deleteLicense)
//xử lý trên trang báo cáo
router.route("/report_phuong").get(showReport);
router.route("/report_phuong/details/:id").get(showReportDetails).post(updateReportStatus)

export default router;
