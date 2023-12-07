import express from "express";

const router = express.Router();
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(registerUser)
  .get(protect, admin, getUsers)
  .detele(protect, admin, deleteUser);
export default router;
