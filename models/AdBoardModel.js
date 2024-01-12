import mongoose from "mongoose";

const adboardSchema = new mongoose.Schema({
  type: { type: String, default: "AdBoard", required: true },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  properties: {
    quantity: { type: String, required: true },
    boardType: { type: String, required: true },
    size: { type: String, required: true },
    imageUrl: {type: String, default: "../assets/img/billboard.jpg"},
    expirationDate: { type: Date, required: true },
  },
  geometry: {
    type: { type: String, default: "Point" },
    coordinates: { type: Array, required: true },
  },
});

const AdBoard = mongoose.model("AdBoard", adboardSchema);
export default AdBoard;
