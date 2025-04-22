const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { BannerDataModel } = require("../model/model");


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.cwd(), "public", "banner_images");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.fieldname + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: "thumbnail_image", maxCount: 1 },
  { name: "title_image", maxCount: 1 },
  { name: "banner_image", maxCount: 1 },
]);

const addBanner = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const { title, description,product_color} = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success:false,
          message: "title and description are required",
        });
      }

      const newBanner = new BannerDataModel({
        title,
        description,
        product_color,
        title_image: req.files["title_image"]?.[0] ? `banner_images/${req.files["title_image"][0].filename}` : "",
        thumbnail_image: req.files["thumbnail_image"]?.[0] ? `banner_images/${req.files["thumbnail_image"][0].filename}` : "",
        banner_image: req.files["banner_image"]?.[0] ? `banner_images/${req.files["banner_image"][0].filename}` : "",
      });
      await newBanner.save();

      res.status(201).json({
        success:true,
        message: "Banner created successfully",
        data: {
          banner_id: newBanner._id,
          title: newBanner.title,
          product_color:newBanner.product_color,
          description: newBanner.description,
          title_image:newBanner.title_image,
          thumbnail_image: newBanner.thumbnail_image,
          banner_image: newBanner.banner_image,
        },
      });
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({
        success:false,
        message: "Error creating banner",
        error: error.message,
      });
    }
  });
};

const updateBanner = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {

      const { banner_id, title, description ,product_color } = req.body;

      if (!banner_id) {
        return res.status(400).json({
          success:false,
          message: "banner_id is required",
        });
      }

      const banner = await BannerDataModel.findById(banner_id);
      if (!banner) {
        return res.status(404).json({
          success:false,
          message: "Banner not found",
        });
      }
     
      banner.title = title || banner.title;
      banner.description = description || banner.description;
      banner.product_color= product_color || banner.product_color;
      banner.title_image = req.files["title_image"]?.[0] ? `banner_images/${req.files["title_image"][0].filename}` : banner.title_image;
      banner.thumbnail_image = req.files["thumbnail_image"]?.[0] ? `banner_images/${req.files["thumbnail_image"][0].filename}` : banner.thumbnail_image;
      banner.banner_image = req.files["banner_image"]?.[0] ? `banner_images/${req.files["banner_image"][0].filename}` : banner.banner_image;
    
      await banner.save();

      res.status(200).json({
        success:true,
        message: "Banner updated successfully",
        data: {
          banner_id: banner._id,
          title: banner.title,
          description: banner.description,
          product_color:banner.product_color,
          title_image: banner.title_image,
          thumbnail_image: banner.thumbnail_image,
          banner_image: banner.banner_image,
        },
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({
        success:false,
        message: "Error updating banner",
        error: error.message,
      });
    }
  });
};

const getAllBanners = async (req, res) => {
  try {
    const banners = await BannerDataModel.find();
    res.status(200).json({
      data: banners.map(banner => ({
        banner_id: banner._id,
        title: banner.title,
        description: banner.description,
        product_color:banner.product_color,
        title_image: banner.title_image,
        thumbnail_image: banner.thumbnail_image,
        banner_image: banner.banner_image,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      success:false,
      message: "Error fetching banners",
      error: error.message,
    });
  }
};

const getBannerById = async (req, res) => {
  try {
    const { banner_id } = req.params;
    if (!banner_id) {
      return res.status(400).json({
        success:false,
        message: "banner_id is required in params",
      });
    }

    const banner = await BannerDataModel.findById(banner_id);
    if (!banner) {
      return res.status(404).json({
        success:false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      data: {
        banner_id: banner._id,
        title: banner.title,
        description: banner.description,
        product_color:banner.product_color,
        title_image: banner.title_image,
        thumbnail_image: banner.thumbnail_image,
        banner_image: banner.banner_image,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching banner by ID:", error);
    res.status(500).json({
      success:false,
      message: "Error fetching banner by ID",
      error: error.message,
    });
  }
};



module.exports = {
    addBanner,
    updateBanner,
    getAllBanners,
    getBannerById
};