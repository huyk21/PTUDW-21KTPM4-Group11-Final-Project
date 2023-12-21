import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
    reportFormat: {type: String, required: true},
    reporter: {type: String, required: true},
    email: {type: String, required: true},
    phoneNo: {type: String, required: true},
    reportDetails: {type: String, required: true},
    reportDate: {type: Date, required: true},
    location: {type: String, required: true},
    locationID: {type: mongoose.Schema.Types.ObjectId, req: true, ref: "Location"}
})

const Report = mongoose.model("Report", reportSchema)
export default Report