import asyncHandler from "../middleware/asyncHandler.js";
//@desc Register user
//@route POST /api/users
//@access Public

const index = asyncHandler(async (req, res) => {
  res.send("trang chu ne!!!");
});

const danhSachQuan = asyncHandler(async (req, res) => {
  res.send("danh sach quan ne!!!");
});

const danhSachPhuong = asyncHandler(async (req, res) => {
  res.send("danh sach phuong ne!!!");
});

const danhSachQuangCao = asyncHandler(async (req, res) => {
  res.send("danh sach quang cao ne!!!");
});

const danhSachDiemDat = asyncHandler(async (req, res) => {
  res.send("danh sach diem dat ne!!!");
});

const danhSachYeuCauCapPhepQuangCao = asyncHandler(async (req, res) => {
  res.send("danh sach yeu cau cap phep quang cao ne!!!");
});

const danhSachYeuCauChinhSuaDiemDat = asyncHandler(async (req, res) => {
  res.send("danh sach yeu cau chinh sua diem dat ne!!!");
});

const danhSachYeuCauChinhSuaQuangCao = asyncHandler(async (req, res) => {
  res.send("danh sach yeu cau chinh sua quang cao ne!!!");
});

const danhSachLoaiDiemDat = asyncHandler(async (req, res) => {
  res.send("danh sach loai diem dat ne!!!");
});

const danhSachHinhThucBaoCao = asyncHandler(async (req, res) => {
  res.send("danh sach hinh thuc bao cao ne!!!");
});

const danhSachHinhThucQuangCao = asyncHandler(async (req, res) => {
  res.send("danh sach hinh thuc quang cao ne!!!");
});

export {
  index,
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
};
