import express from "express";
import { login, authUser, logoutUser,showAd,showAdId,showLicense,showLicenseId } from "../controllers/UserController.js";
const router = express.Router();
//xử lý trên trang bảng quảng cáo
router.route("/adManager").get(showAd);
router.route("/adManager/:adId").get(showAdId);
//xủ lý trên trang yêu cầu cấp phếp
router.route("/license").get(showLicense);
router.route("/license/:liId").get(showLicenseId);


router.route("/auth").post(authUser).get(authUser);
router.route("/login").post(login).get(login);
router.post("/logout", logoutUser);
export default router;
