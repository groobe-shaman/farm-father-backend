const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Knowledge-Base"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("Expires", "0");
  res.set("Pragma", "no-cache");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

require("./databaseConnection/connection");

const AdminProductRouter = require("./src/Admin/Home/Product/router/router");
const AdminBannerRouter = require("./src/Admin/Home/Banner/router/router");
const AdminContactUsRouter = require("./src/Admin/ContactUs/router/router");
const AdminEssenceRouter = require("./src/Admin/Home/Essence/router/router");
const AdminMadeForRouter = require("./src/Admin/Home/MadeFor/router/router");
const AdminBenefitsRouter=require("./src/Admin/Home/Benefits/router/router")
const AdminOurWallRouter=require("./src/Admin/Home/OurWall/router/router")

const BannerRouter = require("./src/Home/Banner/router/router");
const ContactUsRouter = require("./src/ContactUs/router/router");
const ProductRouter = require("./src/Home/Product/router/router");
const EssenceRouter = require("./src/Home/Essence/router/router");
const MadeForRouter=require("./src/Home/MadeFor/router/router")
const BenefitsRouter=require("./src/Home/Benefits/router/router")

app.use(
  "/api/v1/admin",
  AdminProductRouter,
  AdminBannerRouter,
  AdminContactUsRouter,
  AdminEssenceRouter,
  AdminMadeForRouter,
  AdminBenefitsRouter,
  AdminOurWallRouter
);

app.use("/api/v1/banner", BannerRouter);
app.use("/api/v1/contactus", ContactUsRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/essence", EssenceRouter);
app.use('/api/v1/madefor',MadeForRouter)
app.use('/api/v1/benefits',BenefitsRouter)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
