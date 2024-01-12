import express from "express";
import {
  authUser,
  logoutUser,
  showChangePassword,
  showConfirmOTP,
  requestOTP,
  changePassword,
  confirmOTP,
  showLogin,
  showPlace,
  getReport,
  uploadImage,
  showIndex,
} from "../controllers/UserController.js";
import { protect, captcha } from "../middleware/authMiddleware.js";
const router = express.Router();
router.route("/").get(showIndex);
router.route("/auth").post(authUser).get(showLogin);
router.route("/changePassword").get(showChangePassword).post(requestOTP);
router.route("/changePassword/confirmOTP").post(confirmOTP).get(showConfirmOTP);
router.route("/captcha").post(captcha);
router.route("/logout").post(logoutUser).get(authUser);
router.route("/report").post(getReport).get(showPlace);
router.route("/uploads").post(uploadImage);
export default router;
