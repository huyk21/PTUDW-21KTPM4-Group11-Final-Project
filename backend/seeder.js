import dotenv from "dotenv";
import accounts from "./data/users.js";
import connectDB from "./config/db.js";
import User from "./models/UserModel.js";
dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    await User.insertMany(accounts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
