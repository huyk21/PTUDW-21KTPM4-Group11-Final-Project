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
  danhSachYeuCauChinhSuaQuangCao,
  approveDanhSachYeuCauChinhSuaQuangCao,
  duyetYeuCauChinhSuaQuangCao,
  danhSachLoaiDiemDat,
  danhSachHinhThucBaoCao,
  danhSachHinhThucQuangCao,
  thongKeBaoCao,
  thongKeBaoCaoQuan,
  thongKeBaoCaoPhuong,
} from "../controllers/SoVHTTController.js";

import { authUser, logoutUser } from "../controllers/UserController.js";
import { protect, sovhtt } from "../middleware/authMiddleware.js";

router.route("/").get(index);
// router.route("/database").post(dbGenerator).get(dbGenerator);

//Danh sách các Quận
router.route("/danh-sach-quan/editDistrict/:id").get(editDanhSachQuan);
router.route("/danh-sach-quan/addDistrict").get(addDanhSachQuan);
// router.route("/danh-sach-quan/store").post(themQuan);
router.route("/danh-sach-quan/:id").put(chinhSuaQuan).delete(xoaQuan);
router.route("/danh-sach-quan").get(danhSachQuan).post(themQuan);

router.route("/danh-sach-phuong/:idQuan/addWard").get(addDanhSachPhuong);
router
  .route("/danh-sach-phuong/:idQuan/editWard/:idPhuong")
  .get(editDanhSachPhuong);
//Danh sách các Phường của quận theo id quận
router
  .route("/danh-sach-phuong/:idQuan/:idPhuong")
  .put(chinhSuaPhuong)
  .delete(xoaPhuong);
router.route("/danh-sach-phuong/:idQuan").post(themPhuong).get(danhSachPhuong);

//Danh sách điểm đặt
//router.route("/danh-sach-diem-dat").post(danhSachDiemDat).get(danhSachDiemDat);

router
  .route("/danh-sach-diem-dat/:idPhuong/addLocation")
  .get(addDanhSachDiemDatCuaPhuong);
router
  .route("/danh-sach-diem-dat/:idPhuong/editLocation/:idDiemDat")
  .get(editDanhSachDiemDatCuaPhuong);

router
  .route("/danh-sach-diem-dat/:idPhuong/:idDiemDat")
  .put(chinhSuaDiemDat)
  .delete(xoaDiemDat);
//Danh sách điểm đặt theo id phường
router
  .route("/danh-sach-diem-dat/:idPhuong")
  .post(themDiemDat)
  .get(danhSachDiemDatCuaPhuong);

//Danh sách bảng quảng cáo theo id điểm đặt
// router
//   .route("/danh-sach-quang-cao")
//   .post(danhSachQuangCao)
//   .get(danhSachQuangCao);

router
  .route("/danh-sach-quang-cao/:idDiemDat/addAdboard")
  .get(addDanhSachQuangCaoCuaDiemDat);
router
  .route("/danh-sach-quang-cao/:idDiemDat/editAdboard/:idQuangCao")
  .get(editDanhSachQuangCaoCuaDiemDat);
router
  .route("/danh-sach-quang-cao/:idDiemDat/:idQuangCao")
  .put(chinhSuaQuangCao)
  .delete(xoaQuangCao);
//Danh sách bảng quảng cáo theo id điểm đặt
router
  .route("/danh-sach-quang-cao/:idDiemDat")
  .post(themQuangCao)
  .get(danhSachQuangCaoCuaDiemDat);

//Danh sách yêu cầu cấp phép quảng cáo
router
  .route("/danh-sach-yeu-cau-cap-phep-quang-cao")
  .post(danhSachYeuCauCapPhepQuangCao)
  .get(danhSachYeuCauCapPhepQuangCao);

//Danh sách yêu cầu chỉnh sửa điểm đặt
router
  .route("/danh-sach-yeu-cau-chinh-sua-diem-dat")
  .post(danhSachYeuCauChinhSuaDiemDat)
  .get(danhSachYeuCauChinhSuaDiemDat);

router
  .route("/danh-sach-yeu-cau-chinh-sua-quang-cao/:idCurrent/approve/:idNew")
  .get(approveDanhSachYeuCauChinhSuaQuangCao);
//Danh sách yêu cầu chỉnh sửa quảng cáo

router
  .route("/danh-sach-yeu-cau-chinh-sua-quang-cao/:idCurrent/:idNew")
  .put(duyetYeuCauChinhSuaQuangCao);
router
  .route("/danh-sach-yeu-cau-chinh-sua-quang-cao")
  .get(danhSachYeuCauChinhSuaQuangCao);

//Thống kê báo cáo
router.route("/thong-ke-bao-cao").post(thongKeBaoCao).get(thongKeBaoCao);

//Thống kê báo cáo của 1 Quận
router
  .route("/thong-ke-bao-cao-quan/:id")
  .post(thongKeBaoCaoQuan)
  .get(thongKeBaoCaoQuan);

//Thống kê báo cáo
router
  .route("/thong-ke-bao-cao-phuong/:id")
  .post(thongKeBaoCaoPhuong)
  .get(thongKeBaoCaoPhuong);

//////
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
