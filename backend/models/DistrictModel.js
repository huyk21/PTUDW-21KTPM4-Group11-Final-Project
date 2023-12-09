import mongoose, { Schema } from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    wards: { type: Number, required: true },
    area: { type: Number, required: true },
    code: { type: Number, required: true, unique: true },
  }
);

const District = mongoose.model("District", districtSchema);
export default District;
