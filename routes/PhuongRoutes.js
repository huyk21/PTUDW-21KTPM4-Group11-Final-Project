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

import { protect, phuong } from "../middleware/authMiddleware.js"

//xử lý trên trang chủ phường
router.route("/").get(protect, phuong, index);
//Xử lý trên trang bảng quảng cáo
router.route("/ad_phuong").get(protect, phuong, showAd);
router.route("/ad_phuong/edit/:id").get(protect, phuong, editAd);
router.route("/ad_phuong/sendRequest").post(protect, phuong, sendRequest)
//xử lý trên trang quản lý cấp phép
router.route("/license_phuong").get(protect, phuong, showLicense);
router.route("/license_phuong/create").post(protect, phuong, createLicense)
router.route("/license_phuong/confirmDelete/:id").get(protect, phuong, showConfirm)
router.route("/license_phuong/delete/:id").get(protect, phuong, deleteLicense)
//xử lý trên trang báo cáo
router.route("/report_phuong").get(protect, phuong, showReport);
router.route("/report_phuong/details/:id").get(protect, phuong, showReportDetails).post(protect, phuong, updateReportStatus)

export default router;
