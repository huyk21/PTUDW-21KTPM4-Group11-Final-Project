import express from "express";
import { login, authUser, logoutUser,showAd,showAdId,showLicense,
    showLicenseId,store,createLicense,deleteLicense,showReport,showReportId,editReport } from "../controllers/UserController.js";
const router = express.Router();
//xử lý trên trang bảng quảng cáo
router.route("/adManager").get(showAd);
router.route("/adManager/:adId").get(showAdId);
router.route('/adManager/store').post(store);//tạo yêu cầu chỉnh sửa mới
//xủ lý trên trang yêu cầu cấp phếp
router.route("/license").get(showLicense);
router.route("/license/:liId").get(showLicenseId);
router.route('/license/store').post(createLicense);//tạo yêu cầu cấp phép mới
router.route('/license/delete/:liId').get(deleteLicense);

router.route('/report').get(showReport);
router.route('/report/:reportId').get(showReportId);
router.route('/report/:reportId').put(editReport);

router.route("/auth").post(authUser).get(authUser);
router.route("/login").post(login).get(login);
router.post("/logout", logoutUser);
export default router;
