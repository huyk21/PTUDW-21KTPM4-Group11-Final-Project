import express from "express";
const router = express.Router();
import {
  index,
  addLocation,
  updateLocation,
  deleteLocation,
  danhSachQuan,
  danhSachPhuong,
  danhSachQuangCao,
  danhSachDiemDat,
  danhSachYeuCauCapPhepQuangCao,
  danhSachYeuCauChinhSuaDiemDat,
  danhSachYeuCauChinhSuaQuangCao,
  danhSachLoaiDiemDat,
  danhSachHinhThucBaoCao,
  danhSachHinhThucQuangCao,
} from "../controllers/SoVHTTController.js";

import { authUser, logoutUser } from "../controllers/UserController.js";
import { protect, sovhtt } from "../middleware/authMiddleware.js";

router.route("/").get(index);
router.route("/them-diem-dat").post(protect, sovhtt, addLocation);
router.route("/sua-diem-dat/:id").post(updateLocation);
router.route("/xoa-diem-dat/:id").delete(deleteLocation);
// router.route("/database").post(dbGenerator).get(dbGenerator);
router.route("/danh-sach-quan").post(danhSachQuan).get(danhSachQuan);
router.route("/danh-sach-phuong").post(danhSachPhuong).get(danhSachPhuong);
router
  .route("/danh-sach-quang-cao")
  .post(danhSachQuangCao)
  .get(danhSachQuangCao);
router.route("/danh-sach-diem-dat").post(danhSachDiemDat).get(danhSachDiemDat);
router
  .route("/danh-sach-yeu-cau-cap-phep-quang-cao")
  .post(danhSachYeuCauCapPhepQuangCao)
  .get(danhSachYeuCauCapPhepQuangCao);
router
  .route("/danh-sach-yeu-cau-chinh-sua-diem-dat")
  .post(danhSachYeuCauChinhSuaDiemDat)
  .get(danhSachYeuCauChinhSuaDiemDat);
router
  .route("/danh-sach-yeu-cau-chinh-sua-quang-cao")
  .post(danhSachYeuCauChinhSuaQuangCao)
  .get(danhSachYeuCauChinhSuaQuangCao);
router
  .route("/danh-sach-loai-diem-dat")
  .post(danhSachLoaiDiemDat)
  .get(danhSachLoaiDiemDat);
router
  .route("/danh-sach-hinh-thuc-bao-cao")
  .post(danhSachHinhThucBaoCao)
  .get(danhSachHinhThucBaoCao);
router
  .route("/danh-sach-hinh-thuc-quang-cao")
  .post(danhSachHinhThucQuangCao)
  .get(danhSachHinhThucQuangCao);

export default router;
