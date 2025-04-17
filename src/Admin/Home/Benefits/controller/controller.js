const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { HomePageDataModel } = require("../../../../Home/model/model");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.cwd(), "public","home","benefits_image");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        Date.now() + "-" + "benefits_image" + path.extname(file.originalname)
      );
    },
  }),
}).single("benefits_image");

const addBenefits = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const { section_title } = req.body;
      const image = req.file ? `home/benefits_image/${req.file.filename}` : "";

      const existingBenefits = await HomePageDataModel.findOne({
        structure_type: "benefits",
      });
      if (existingBenefits) {
        return res.status(400).json({
          success:false,
          message: "Benefits section already exists. Please update it instead.",
        });
      }

      const newBenefits = new HomePageDataModel({
        structure_type: "benefits",
        content: {
          benefits: {
            image,
            section_title: section_title || "",
          },
        },
      });

      await newBenefits.save();

      res.status(201).json({
        success:true,
        message: "Benefits data added successfully",
        data: {
            image: newBenefits.content.benefits.image,
            section_title: newBenefits.content.benefits.section_title,
          },
      });
    } catch (error) {
      console.error("Error adding benefits data:", error);
      res.status(500).json({
        success:false,
        message: "Error adding benefits data",
        error: error.message,
      });
    }
  });
};

const updateBenefits = async (req, res) => {
    upload(req, res, async function (error) {
      if (error instanceof multer.MulterError || error) {
        return res.status(400).json({
          message: "File upload error",
          error: error.message,
        });
      }
  
      try {
        const { section_title } = req.body;
        const benefits = await HomePageDataModel.findOne({ structure_type: "benefits" });
        if (!benefits) {
          return res.status(404).json({
            success:false,
            message: "Benefits section not found",
          });
        }
  
        const image = req.file ? `home/benefits_image/${req.file.filename}` : benefits.content.benefits.image;
  
        benefits.content.benefits.image = image;
        benefits.content.benefits.section_title = section_title !== undefined ? section_title : benefits.content.benefits.section_title;
  
        await benefits.save();
  
        res.status(200).json({
          success:true,
          message: "Benefits data updated successfully",
          data: {
            image: benefits.content.benefits.image,
            section_title: benefits.content.benefits.section_title,
          },
        });
      } catch (error) {
        console.error("Error updating benefits data:", error);
        res.status(500).json({
          success:false,
          message: "Error updating benefits data",
          error: error.message,
        });
      }
    });
  };

  const getBenefits = async (req, res) => {
    try {
      const benefits = await HomePageDataModel.findOne({ structure_type: "benefits" });
      if (!benefits || !benefits.content.benefits) {
        return res.status(404).json({
          success:false,
          message: "Benefits section not found",
        });
      }
  
      res.status(200).json({
        success:true,
        data: {
          image: benefits.content.benefits.image,
          section_title: benefits.content.benefits.section_title,
        },
      });
    } catch (error) {
      console.error("Error fetching benefits data:", error);
      res.status(500).json({
        success:false,
        message: "Error fetching benefits data",
        error: error.message,
      });
    }
  };
module.exports = {
  addBenefits,
  updateBenefits,
  getBenefits
};
