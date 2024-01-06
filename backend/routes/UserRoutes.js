import express from "express";
import { authUser, logoutUser } from "../controllers/UserController.js";
import { protect, captcha } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/auth").post(authUser);
router.route("/captcha").post(captcha);
router.route("/logout").post(logoutUser).get(authUser);
export default router;
