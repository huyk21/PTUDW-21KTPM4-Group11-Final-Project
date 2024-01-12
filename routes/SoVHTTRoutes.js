import express from "express";
const router = express.Router();
import {
  index,
  danhSachQuan,
  editDanhSachQuan,
  addDanhSachQuan,
  themQuan,
  chinhSuaQuan,
  xoaQuan,
  danhSachPhuong,
  editDanhSachPhuong,
  addDanhSachPhuong,
  themPhuong,
  chinhSuaPhuong,
  xoaPhuong,
  danhSachQuangCao,
  danhSachDiemDat,
  danhSachQuangCaoCuaDiemDat,
  addDanhSachQuangCaoCuaDiemDat,
  editDanhSachQuangCaoCuaDiemDat,
  themQuangCao,
  chinhSuaQuangCao,
  xoaQuangCao,
  danhSachDiemDatCuaPhuong,
  editDanhSachDiemDatCuaPhuong,
  addDanhSachDiemDatCuaPhuong,
  themDiemDat,
  chinhSuaDiemDat,
  xoaDiemDat,
  danhSachYeuCauCapPhepQuangCao,
  danhSachYeuCauChinhSuaDiemDat,
  approveDanhSachYeuCauChinhSuaDiemDat,
  duyetYeuCauChinhSuaDiemDat,
  danhSachYeuCauChinhSuaQuangCao,
  approveDanhSachYeuCauChinhSuaQuangCao,
  duyetYeuCauChinhSuaQuangCao,
  danhSachLoaiDiemDat,
  danhSachHinhThucBaoCao,
  danhSachHinhThucQuangCao,
  thongKeBaoCao,
  thongKeBaoCaoQuan,
  thongKeBaoCaoPhuong,
  chiTietThongKeBaoCaoPhuong,
  trangTaoTaiKhoan,
  taoTaiKhoan,
} from "../controllers/SoVHTTController.js";

import { authUser, logoutUser } from "../controllers/UserController.js";
import { protect, sovhtt } from "../middleware/authMiddleware.js";

router.route("/").get(protect, sovhtt, index);
// router.route("/database").post(dbGenerator).get(dbGenerator);

//Danh sách các Quận
router
  .route("/danh-sach-quan/editDistrict/:id")
  .get(protect, sovhtt, editDanhSachQuan);
router
  .route("/danh-sach-quan/addDistrict")
  .get(protect, sovhtt, addDanhSachQuan);
// router.route("/danh-sach-quan/store").post(themQuan);
router
  .route("/danh-sach-quan/:id")
  .put(protect, sovhtt, chinhSuaQuan)
  .delete(protect, sovhtt, xoaQuan);
router
  .route("/danh-sach-quan")
  .get(protect, sovhtt, danhSachQuan)
  .post(protect, sovhtt, themQuan);

router
  .route("/danh-sach-phuong/:idQuan/addWard")
  .get(protect, sovhtt, addDanhSachPhuong);
router
  .route("/danh-sach-phuong/:idQuan/editWard/:idPhuong")
  .get(protect, sovhtt, editDanhSachPhuong);
//Danh sách các Phường của quận theo id quận
router
  .route("/danh-sach-phuong/:idQuan/:idPhuong")
  .put(protect, sovhtt, chinhSuaPhuong)
  .delete(protect, sovhtt, xoaPhuong);
router
  .route("/danh-sach-phuong/:idQuan")
  .post(protect, sovhtt, themPhuong)
  .get(protect, sovhtt, danhSachPhuong);

//Danh sách điểm đặt
//router.route("/danh-sach-diem-dat").post(danhSachDiemDat).get(danhSachDiemDat);

router
  .route("/danh-sach-diem-dat/:idPhuong/addLocation")
  .get(protect, sovhtt, addDanhSachDiemDatCuaPhuong);
router
  .route("/danh-sach-diem-dat/:idPhuong/editLocation/:idDiemDat")
  .get(protect, sovhtt, editDanhSachDiemDatCuaPhuong);

router
  .route("/danh-sach-diem-dat/:idPhuong/:idDiemDat")
  .put(protect, sovhtt, chinhSuaDiemDat)
  .delete(protect, sovhtt, xoaDiemDat);
//Danh sách điểm đặt theo id phường
router
  .route("/danh-sach-diem-dat/:idPhuong")
  .post(protect, sovhtt, themDiemDat)
  .get(protect, sovhtt, danhSachDiemDatCuaPhuong);

//Danh sách bảng quảng cáo theo id điểm đặt
// router
//   .route("/danh-sach-quang-cao")
//   .post(danhSachQuangCao)
//   .get(danhSachQuangCao);

router
  .route("/danh-sach-quang-cao/:idDiemDat/addAdboard")
  .get(protect, sovhtt, addDanhSachQuangCaoCuaDiemDat);
router
  .route("/danh-sach-quang-cao/:idDiemDat/editAdboard/:idQuangCao")
  .get(protect, sovhtt, editDanhSachQuangCaoCuaDiemDat);
router
  .route("/danh-sach-quang-cao/:idDiemDat/:idQuangCao")
  .put(protect, sovhtt, chinhSuaQuangCao)
  .delete(protect, sovhtt, xoaQuangCao);
//Danh sách bảng quảng cáo theo id điểm đặt
router
  .route("/danh-sach-quang-cao/:idDiemDat")
  .post(protect, sovhtt, themQuangCao)
  .get(protect, sovhtt, danhSachQuangCaoCuaDiemDat);

//Danh sách yêu cầu cấp phép quảng cáo
router
  .route("/danh-sach-yeu-cau-cap-phep-quang-cao")
  .post(protect, sovhtt, danhSachYeuCauCapPhepQuangCao)
  .get(protect, sovhtt, danhSachYeuCauCapPhepQuangCao);

router
  .route("/danh-sach-yeu-cau-chinh-sua-diem-dat/:idCurrent/approve/:idNew")
  .get(protect, sovhtt, approveDanhSachYeuCauChinhSuaDiemDat);

router
  .route("/danh-sach-yeu-cau-chinh-sua-diem-dat/:idCurrent/:idNew")
  .put(protect, sovhtt, duyetYeuCauChinhSuaDiemDat);
//Danh sách yêu cầu chỉnh sửa điểm đặt
router
  .route("/danh-sach-yeu-cau-chinh-sua-diem-dat")
  .get(protect, sovhtt, danhSachYeuCauChinhSuaDiemDat);

router
  .route("/danh-sach-yeu-cau-chinh-sua-quang-cao/:idCurrent/approve/:idNew")
  .get(protect, sovhtt, approveDanhSachYeuCauChinhSuaQuangCao);
//Danh sách yêu cầu chỉnh sửa quảng cáo

router
  .route("/danh-sach-yeu-cau-chinh-sua-quang-cao/:idCurrent/:idNew")
  .put(protect, sovhtt, duyetYeuCauChinhSuaQuangCao);
router
  .route("/danh-sach-yeu-cau-chinh-sua-quang-cao")
  .get(protect, sovhtt, danhSachYeuCauChinhSuaQuangCao);

//Thống kê báo cáo
router.route("/thong-ke-bao-cao").get(protect, sovhtt, thongKeBaoCao);

//Thống kê báo cáo của 1 Quận
router
  .route("/thong-ke-bao-cao-quan/:idQuan")
  .get(protect, sovhtt, thongKeBaoCaoQuan);

//Thống kê báo cáo
router
  .route("/thong-ke-bao-cao-phuong/:idPhuong/detail/:idBaoCao")
  .get(protect, sovhtt, chiTietThongKeBaoCaoPhuong);
router
  .route("/thong-ke-bao-cao-phuong/:idPhuong")
  .get(protect, sovhtt, thongKeBaoCaoPhuong);

//////
router
  .route("/danh-sach-loai-diem-dat")
  .post(protect, sovhtt, danhSachLoaiDiemDat)
  .get(protect, sovhtt, danhSachLoaiDiemDat);
router
  .route("/danh-sach-hinh-thuc-bao-cao")
  .post(protect, sovhtt, danhSachHinhThucBaoCao)
  .get(protect, sovhtt, danhSachHinhThucBaoCao);
router
  .route("/danh-sach-hinh-thuc-quang-cao")
  .post(protect, sovhtt, danhSachHinhThucQuangCao)
  .get(protect, sovhtt, danhSachHinhThucQuangCao);

router
  .route("/tao-tai-khoan")
  .get(protect, sovhtt, trangTaoTaiKhoan)
  .post(protect, sovhtt, taoTaiKhoan);

export default router;
