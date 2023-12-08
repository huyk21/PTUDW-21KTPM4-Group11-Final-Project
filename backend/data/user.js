import bcrypt from "bcryptjs"

const accounts = [
    {
        "name": "Phạm Quốc Duy",
        "isPhuong": true,
        "isQuan": false,
        "isSo": false,
        "dateOfBirth": "1998-05-12",
        "email": "phamquocduy@gmail.com",
        "phoneNo": "0903309930",
        "username": "pqduy.phuong",
        "password": bcrypt.hashSync("CanBoPhuong", 10)
    },
    {
        "name": "Nguyễn Thành Luân",
        "isPhuong": false,
        "isQuan": true,
        "isSo": false,
        "dateOfBirth": "1998-12-12",
        "email": "nguyenthanhluan@gmail.com",
        "phoneNo": "0908808808",
        "username": "ntluan.quan",
        "password": bcrypt.hashSync("CanBoQuan", 10)
    },
    {
        "name": "Nguyễn Thành Đạt",
        "isPhuong": false,
        "isQuan": false,
        "isSo": true,
        "dateOfBirth": "2000-03-28",
        "email": "ntdat@gmail.com",
        "phoneNo": "0902820028",
        "username": "ntdat.soVHTT",
        "password": bcrypt.hashSync("CanBoSoVHTT", 10)
    }
]

export default accounts