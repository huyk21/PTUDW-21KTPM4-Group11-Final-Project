import express from "express";
import { login, authUser, logoutUser
     } from "../controllers/UserController.js";
const router = express.Router();


router.route("/auth").post(login,authUser).get(authUser);
router.route("/login").post(login).get(login);
router.route("/logout").post(logoutUser).get(authUser);
export default router;
