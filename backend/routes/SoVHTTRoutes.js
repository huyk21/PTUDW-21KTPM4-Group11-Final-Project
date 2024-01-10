import express from "express";
const router = express.Router();
import {
  index,
  addLocation,
  updateLocation,
  deleteLocation,
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
  danhSachDiemDatCuaPhuong,
  danhSachYeuCauCapPhepQuangCao,
  danhSachYeuCauChinhSuaDiemDat,
  danhSachYeuCauChinhSuaQuangCao,
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
router.route("/them-diem-dat").post(protect, sovhtt, addLocation);
router.route("/sua-diem-dat/:id").post(updateLocation);
router.route("/xoa-diem-dat/:id").delete(deleteLocation);
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
router.route("/danh-sach-diem-dat").post(danhSachDiemDat).get(danhSachDiemDat);

//Danh sách điểm đặt theo id phường
router
  .route("/danh-sach-diem-dat/:id")
  .post(danhSachDiemDatCuaPhuong)
  .get(danhSachDiemDatCuaPhuong);

//Danh sách bảng quảng cáo theo id điểm đặt
router
  .route("/danh-sach-quang-cao")
  .post(danhSachQuangCao)
  .get(danhSachQuangCao);

//Danh sách bảng quảng cáo theo id điểm đặt
router
  .route("/danh-sach-quang-cao/:id")
  .post(danhSachQuangCaoCuaDiemDat)
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

//Danh sách yêu cầu chỉnh sửa quảng cáo
router
  .route("/danh-sach-yeu-cau-chinh-sua-quang-cao")
  .post(danhSachYeuCauChinhSuaQuangCao)
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
