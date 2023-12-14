import mongoose from "mongoose"

const reportSolSchema = new mongoose.Schema({
    for: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Report"},
    method: {type: String, required: true},
    status: {type: String, required: true, default: "Đang xử lý"}
})

const ReportSolution = mongoose.model("ReportSolution", reportSolSchema)
export default ReportSolution