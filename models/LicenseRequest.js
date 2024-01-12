import mongoose from "mongoose"

const reqsSchema = new mongoose.Schema({
    for: {type: mongoose.Schema.Types.ObjectId, req: true, ref: "Location"},
    adContent: {type: String, required: true, unique: true},
    companyInfo: {type: String, required: true},
    companyEmail: {type: String, required: true},
    companyPhone: {type: String, required: true},
    companyAddress: {type: String, required: true},
    startDate: {type: Date, required: true},
    expirationDate: {type: Date, required: true},
    processStatus: {type: String, required: true, default: "Đang xử lý"}
})

const LicenseRequest = mongoose.model("LicenseRequest", reqsSchema)
export default LicenseRequest