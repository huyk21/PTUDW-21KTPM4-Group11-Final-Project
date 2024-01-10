import express from "express";
import methodOverride from "method-override";
import expressHbs from "express-handlebars";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import SoVHTTRoutes from "./routes/SoVHTTRoutes.js";
import QuanRoutes from "./routes/QuanRoutes.js";
import PhuongRoutes from "./routes/PhuongRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";

import AdBoard from "./models/AdBoardModel.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1);
import handlebars from "handlebars";

handlebars.registerHelper("eq", function (a, b, c, d, options) {
  return a === b || a === c || a === d
    ? options.fn(this)
    : options.inverse(this);
});
const port = process.env.PORT || 4000;
connectDB();
const app = express();
app.use(methodOverride("_method"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("wyontlwiblomtswists"));
app.use(express.static(__dirname + "/html"));
app.set("views", path.join(__dirname, "/views"));
app.use("/data", express.static(path.join(__dirname, "/data")));

// Session
app.use(
  session({
    secret: "wyontlwiblontswistsokylhwylhg",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: true, // prevent client side js from reading the cookie
      maxAge: 1000 * 60 * 60, // maximum age 1 hour
    },
  })
);

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
        if (typeof date !== Date) {
          const dateString = String(date);
          const parts = dateString.split("-");
          if (parts.length === 3) {
            const [year, month, day] = parts;
            // Rearrange the parts to the mm-dd-yyyy format
            const formattedDate = `${month}-${day}-${year}`;
            return formattedDate;
          } else {
            return date
              .toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\//g, "-");
          }
        }
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

app.get("/", (req, res) => {
  res.render("index", { layout: "layoutDan" });
});

app.get("/api/loaddata", async (req, res) => {
  try {
    const adboards = await AdBoard.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: "$location",
      },
      {
        $lookup: {
          from: "districts",
          localField: "location.district",
          foreignField: "_id",
          as: "district",
        },
      },
      {
        $unwind: "$district",
      },
      {
        $lookup: {
          from: "wards",
          localField: "location.ward",
          foreignField: "_id",
          as: "ward",
        },
      },
      {
        $unwind: "$ward",
      },
      {
        $project: {
          type: 1,
          adboard: "$properties", // Rename 'properties' to 'adboard'
          geometry: 1,
          location: 1,
          district: 1,
          ward: 1,
          _id: 0,
        },
      },
    ]);

    const workWard = req.session.workWard
    const workDistrict = req.session.workDistrict
    console.log(workWard)
    console.log(workDistrict)

    if ((workWard === undefined && workDistrict === undefined) || (workWard === null && workDistrict === null)) {
      res.locals.adboards = adboards
      res.json(adboards)
    }

    else if (workWard !== null && workDistrict !== null) { //ward
      const result = adboards.filter((ad) => ad.ward._id.toString() === workWard)
      res.locals.adboards = result
      res.json(result)
    }
    else {
      const result = adboards.filter((ad) => ad.district._id.toString() === workDistrict)
      res.locals.adboards = result
      res.json(result)
    }
  } catch (error) {
    console.error(error);
  }
});

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
