import mongoose from "mongoose";

const wardSchema = new mongoose.Schema(
  {
    districtID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true,
    },
    name: { type: String, required: true, unique: true },
  }
);

const Ward = mongoose.model("Ward", wardSchema);
export default Ward;
