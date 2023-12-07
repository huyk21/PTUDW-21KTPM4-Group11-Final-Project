import express from "express";
import expressHbs from "express-handlebars";

import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import PhuongRoutes from "./routes/PhuongRoutes.js";
import NguoiDanRoutes from "./routes/NguoiDanRoutes.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1);

const port = process.env.PORT || 4000;
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/html"));
app.set("views", path.join(__dirname, "/views"));
app.use("/data", express.static(path.join(__dirname, "/data")));

app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: path.join(__dirname, "/views/layouts"),
    partialsDir: path.join(__dirname, " /views/partials"),
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {},
  })
);

app.set("view engine", "hbs"); // set view engine
app.use("/api/nguoidan", NguoiDanRoutes);
app.get("/", (req, res) => {
  res.render("index", { layout: "layout" });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
