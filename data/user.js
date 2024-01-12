import bcrypt from "bcryptjs";
import bcrypt from "bcryptjs";

const accounts = [
  {
    name: "Phạm Quốc Duy",
    isPhuong: true,
    isQuan: false,
    isSo: false,
    workDistrict: "65817cd245551b56b68d8a57",
    workWard: "6581882f45551b56b68d8b6c",
    dateOfBirth: "1998-05-12",
    email: "phamquocduy3112003@gmail.com",
    phoneNo: "0903309930",
    username: "pqduy.phuong",
    password: bcrypt.hashSync("CanBoPhuong", 10),
  },
  {
    name: "Lưu Đình Huy",
    isPhuong: true,
    isQuan: false,
    isSo: false,
    workDistrict: "65817cd245551b56b68d8a57",
    workWard: "6581882f45551b56b68d8b6b",
    dateOfBirth: "2001-11-20",
    email: "ldhuy21@clc.fitus.edu.vn",
    phoneNo: "0909990112",
    username: "ldhuy.phuong",
    password: bcrypt.hashSync("CanBoPhuong", 10),
  },
  {
    name: "Nguyễn Thành Luân",
    isPhuong: false,
    isQuan: true,
    isSo: false,
    workDistrict: "65817cd245551b56b68d8a57",
    workWard: null,
    dateOfBirth: "1998-12-12",
    email: "nguyenthanhluan@gmail.com",
    phoneNo: "0908808808",
    username: "ntluan.quan",
    password: bcrypt.hashSync("CanBoQuan", 10),
  },
  {
    name: "Nguyễn Văn A",
    isPhuong: false,
    isQuan: true,
    isSo: false,
    workDistrict: "65817cd245551b56b68d8a62",
    workWard: null,
    dateOfBirth: "2003-11-11",
    email: "nguyenvana@gmail.com",
    phoneNo: "0122123321",
    username: "nva.quan",
    password: bcrypt.hashSync("CanBoQuan", 10),
  },
  {
    name: "Nguyễn Thành Đạt",
    isPhuong: false,
    isQuan: false,
    isSo: true,
    workDistrict: null,
    workWard: null,
    dateOfBirth: "2000-03-28",
    email: "ntdat@gmail.com",
    phoneNo: "0902820028",
    username: "ntdat.soVHTT",
    password: bcrypt.hashSync("CanBoSoVHTT", 10),
  },
];

export default accounts;

export default accounts;