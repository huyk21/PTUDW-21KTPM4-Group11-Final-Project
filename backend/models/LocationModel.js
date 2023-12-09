import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
  ward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true,
  },
  locationType: { type: String, required: true },
  adFormat: { type: String, required: true },
  status: { type: String, required: true },
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
