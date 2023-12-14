import mongoose from "mongoose";

const reqsSchema = new mongoose.Schema({
  for: { type: String, required: true, default: "Biển quảng cáo" },
  forID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "AdBoard",
  },
  newQuantity: { type: String, required: true },
  newBoardType: { type: String, required: true },
  newSize: { type: String, required: true },
  newExpirationDate: { type: Date, required: true },
  adjustDate: { type: Date, required: true },
  reason: { type: String, required: true },
});

const AdjustBoard = mongoose.model("AdjustBoard", reqsSchema);
export default AdjustBoard;
