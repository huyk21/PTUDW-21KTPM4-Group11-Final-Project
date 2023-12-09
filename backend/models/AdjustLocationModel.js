import mongoose from "mongoose";

const reqsSchema = new mongoose.Schema({
  for: { type: String, required: true, default: "Điểm đặt quảng cáo" },
  forID: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  newAddress: {type: String, required: true},
  newLocationType: {type: String, required: true},
  newAdFormat: {type: String, required: true},
  newStatus: {type: String, required: true},
  adjustDate: {type: Date, required: true},
  reason: {type: String, required: true}
});

const AdjustLocation = mongoose.model("AdjustLocation", reqsSchema);
export default AdjustLocation;
