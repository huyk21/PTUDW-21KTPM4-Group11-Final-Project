import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 5000;
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Server is ready");
});
app.get("/", (req, res) => {
  res.send("Server is ready");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
