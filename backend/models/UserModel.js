import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isPhuong: { type: Boolean, required: true, default: true },
  isQuan: { type: Boolean, required: true, default: false },
  isSo: { type: Boolean, required: true, default: false },
  workDistrict: { type: mongoose.Schema.Types.ObjectId, ref: "District", default: null},
  workWard: {type: mongoose.Schema.Types.ObjectId, ref: "Ward", default: null},
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
