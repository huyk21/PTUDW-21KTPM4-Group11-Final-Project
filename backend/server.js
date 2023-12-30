import express from "express";
import expressHbs from "express-handlebars";

import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import SoVHTTRoutes from "./routes/SoVHTTRoutes.js";
import QuanRoutes from "./routes/QuanRoutes.js";
import PhuongRoutes from "./routes/PhuongRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1);
import handlebars from "handlebars";

handlebars.registerHelper("eq", function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper("eq", function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});
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
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      formatDate: (date) => {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      showIndex: (index) => index + 1,
    },
  })
);

app.set("view engine", "hbs"); // set view engine
app.use("/api/sovhtt", SoVHTTRoutes);
app.use("/api/quan", QuanRoutes);
app.use("/api/phuong", PhuongRoutes);
app.use("/api/", UserRoutes);
// app.get("/", (req, res) => {
//   res.render("index", { layout: "layout2" });
// });
if (process.env.NODE_ENV === "production") {
  // const __dirname = path.resolve();
  // app.use('/uploads', express.static('/var/data/uploads'));
  // app.use(express.static(path.join(__dirname, '/frontend/build')));
  // app.get('*', (req, res) =>
  //   res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  // );
} else {
  const __dirname = path.resolve();
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
