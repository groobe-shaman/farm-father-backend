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

const AdminAuthRouter=require('./src/Admin/Auth/router/router')
const AdminProductRouter = require("./src/Admin/Home/Product/router/router");
const AdminBannerRouter=require("./src/Admin/Banners/router/router")
const AdminHomeBannerRouter = require("./src/Admin/Home/Banner/router/router");
const AdminContactUsRouter = require("./src/Admin/ContactUs/router/router");
const AdminEssenceRouter = require("./src/Admin/Home/Essence/router/router");
const AdminMadeForRouter = require("./src/Admin/Home/MadeFor/router/router");
const AdminBenefitsRouter=require("./src/Admin/Home/Benefits/router/router")
const AdminOurWallRouter=require("./src/Admin/Home/OurWall/router/router")
const AdminWhyChooseUsRouter=require('./src/Admin/Home/WhyChooseUs/router/router')
const AdminHomeContactUsRouter=require("./src/Admin/Home/ContactUs/router/router")
const AdminSettingsRouter=require("./src/Admin/Home/Settings/router/router")
const AdminAboutUsRouter=require("./src/Admin/Home/AboutUs/router/router")
const AdminHowToUseRouter=require('./src/Admin/Home/HowToUse/router/router')
const AdminOurImpactRouter=require('./src/Admin/Home/OurImpact/router/router')
const AdminPolicyRouter=require("./src/Admin/Home/Policies/router/router")

const BannerRouter = require("./src/Home/Banner/router/router");
const ContactUsRouter = require("./src/ContactUs/router/router");
const ProductRouter = require("./src/Home/Product/router/router");
const EssenceRouter = require("./src/Home/Essence/router/router");
const MadeForRouter=require("./src/Home/MadeFor/router/router")
const BenefitsRouter=require("./src/Home/Benefits/router/router")
const OurWallRouter=require("./src/Home/OurWall/router/router")
const WhyChooseUsRouter=require("./src/Home/WhyChooseUs/router/router")
const HomeContactUsRouter=require("./src/Home/ContactUs/router/router")
const SettingsRouter=require('./src/Home/Settings/router/router')
const AboutUsRouter=require('./src/Home/AboutUs/router/router')
const HowToUseRouter=require('./src/Home/HowToUse/router/router')
const OurImpactRouter=require('./src/Home/OurImpact/router/router')
const PolicyRouter=require("./src/Home/Policies/router/router")
const RecaptchaRouter=require("./src/Recaptcha/router/router")

app.use(
  "/api/v1/admin",
  AdminAuthRouter,
  AdminProductRouter,
  AdminBannerRouter,
  AdminHomeBannerRouter,
  AdminContactUsRouter,
  AdminEssenceRouter,
  AdminMadeForRouter,
  AdminBenefitsRouter,
  AdminOurWallRouter,
  AdminWhyChooseUsRouter,
  AdminHomeContactUsRouter,
  AdminSettingsRouter,
  AdminAboutUsRouter,
  AdminHowToUseRouter,
  AdminOurImpactRouter,
  AdminPolicyRouter
);

app.use("/api/v1/banner", BannerRouter);
app.use("/api/v1/contactus", ContactUsRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/essence", EssenceRouter);
app.use('/api/v1/madefor',MadeForRouter)
app.use('/api/v1/benefits',BenefitsRouter)
app.use('/api/v1/ourwall',OurWallRouter)
app.use('/api/v1/whychooseus',WhyChooseUsRouter)
app.use('/api/v1/home/contactus',HomeContactUsRouter)
app.use("/api/v1/settings",SettingsRouter)
app.use("/api/v1/aboutus",AboutUsRouter)
app.use("/api/v1/howtouse",HowToUseRouter)
app.use("/api/v1/ourimpact",OurImpactRouter)
app.use("/api/v1/policies/",PolicyRouter)
app.use("/api/v1/recaptcha",RecaptchaRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
