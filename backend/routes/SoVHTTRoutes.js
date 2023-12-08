import express from "express";
const router = express.Router();
import { index, login } from "../controllers/SoVHTTController.js";

router.route("/").post(index).get(login);

export default router;
