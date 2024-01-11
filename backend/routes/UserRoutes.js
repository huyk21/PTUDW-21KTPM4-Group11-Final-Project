import express from "express";
import {
  authUser,
  logoutUser,
  showLogin,
  showPlace,
} from "../controllers/UserController.js";
import { protect, captcha } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/auth").post(authUser).get(showLogin);
router.route("/captcha").post(captcha);
router.route("/place/:id").get(showPlace);
router.route("/logout").post(logoutUser).get(authUser);
export default router;
