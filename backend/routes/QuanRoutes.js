import express from "express";
const router = express.Router();
import {showReportId,index,editAd,store,
    createLicense,deleteLicense,showReport,sendReport, 
    createAdboard,deleteAd } from "../controllers/QuanController.js";
import { login,authUser, logoutUser } from "../controllers/UserController.js";
import { protect, quan } from "../middleware/authMiddleware.js";


//xử lý trên trang chủ quận
router.route('/').get(index);
router.route('/login').post(login)
router.post('/auth',authUser);
router.post('/logout',logoutUser)
//router.route('/').get(protect,quan,index);
router.route('/:id').put(editAd);
router.route('/').post(createAdboard)
router.route('/:id').delete(deleteAd);
//xử lý trên trang quản lý bảng quảng cáo
// router.route('/ad').get(showAd);
// router.route('/ad/:adId').get(showAdId);
router.route('/ad/store').post(store);//tạo yêu cầu chỉnh sửa mới
//xử lý trên trang quản lý cấp phép
//router.route('/license').get(showLicense);

router.route('/license/store').post(createLicense);//tạo yêu cầu cấp phép mới
router.route('/license/delete/:liId').get(deleteLicense);
//xử lý trên trang báo cáo
router.route('/report').get(showReport);
router.route('/report/:reportId').get(showReportId);
router.route('/report').post(sendReport);


export default router;