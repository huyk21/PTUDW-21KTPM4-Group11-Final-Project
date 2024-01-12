import express from "express";
const router = express.Router();
import {
  index,
  showAd,
  showAdId,
  store,
  showLicense,
  createLicense,
  showLicenseId,
  deleteLicense,
  showReport,
  showReportId,
  editReport,
} from "../controllers/QuanController.js";

import { protect, quan } from "../middleware/authMiddleware.js";

//xử lý trên trang chủ quận
router.route("/").get(protect, quan, index);
// router.route('/login').post(login)
// router.post('/auth',authUser);
// router.post('/logout',logoutUser)
//router.route('/').get(protect,quan,index);

//xử lý trên trang quản lý bảng quảng cáo
router.route("/adManager/:idPhuong").get(protect, quan,showAd);
router.route("/adManager/showAdId/:adId").get(protect, quan,showAdId);
router.route("/adManager/store").post(protect, quan,store);
//xử lý trên trang quản lý cấp phép
router.route("/license/:idPhuong").get(protect, quan,showLicense);
router.route("/license/showLiId/:liId").get(protect, quan,showLicenseId);
router.route("/license/store").post(protect, quan,createLicense);
router.route("/license/delete/:liId").get(protect, quan,deleteLicense);
//xử lý trên trang báo cáo
router.route("/report/:idPhuong").get(protect, quan,showReport);
router.route("/report/show/:reportId").get(protect, quan,showReportId);
router.route("/report/show/:reportId").put(protect, quan,editReport);

export default router;
