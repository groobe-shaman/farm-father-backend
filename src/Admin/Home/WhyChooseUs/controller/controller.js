const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { HomePageDataModel } = require("../../../../Home/model/model");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.cwd(), "public","home","why_choose_us_image");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + "why_choose_us_image" + path.extname(file.originalname));
    },
  })
}).single("why_choose_us_image");


const addWhyChooseUs = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {

      const { feature_titles, feature_title_color, description, section_title } = req.body;
      const image = req.file ? `home/why_choose_us_image/${req.file.filename}` : "";

      const existingWhyChooseUs = await HomePageDataModel.findOne({ structure_type: "why_choose_us" });
      if (existingWhyChooseUs) {
        return res.status(400).json({
          success:false,
          message: "Why Choose Us section already exists. Please update it instead.",
        });
      }

      const newWhyChooseUs = new HomePageDataModel({
        structure_type: "why_choose_us",
        content: {
          why_choose_us: {
            feature_titles: feature_titles || [],
            feature_title_color: feature_title_color || "",
            description: description || "",
            image,
            section_title: section_title || "",
          },
        },
      });

      await newWhyChooseUs.save();

      res.status(201).json({
        success:true,
        message: "Why Choose Us data added successfully",
        data: {
          structure: "why_choose_us",
          feature_titles: newWhyChooseUs.content.why_choose_us.feature_titles,
          feature_title_color: newWhyChooseUs.content.why_choose_us.feature_title_color,
          description: newWhyChooseUs.content.why_choose_us.description,
          image: newWhyChooseUs.content.why_choose_us.image,
          section_title: newWhyChooseUs.content.why_choose_us.section_title,
        },
      });
    } catch (error) {
      console.error("Error adding Why Choose Us data:", error);
      res.status(500).json({
        success:false,
        message: "Error adding Why Choose Us data",
        error: error.message,
      });
    }
  });
};

const updateWhyChooseUs = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {

      const { feature_titles, feature_title_color, description, section_title } = req.body;
      const whyChooseUs = await HomePageDataModel.findOne({ structure_type: "why_choose_us" });
      if (!whyChooseUs) {
        return res.status(404).json({
          message: "Why Choose Us section not found",
        });
      }

      const image = req.file ? `home/why_choose_us_image/${req.file.filename}` : whyChooseUs.content.why_choose_us.image;

      whyChooseUs.content.why_choose_us.feature_titles = feature_titles || whyChooseUs.content.why_choose_us.feature_titles;
      whyChooseUs.content.why_choose_us.feature_title_color = feature_title_color !== undefined ? feature_title_color : whyChooseUs.content.why_choose_us.feature_title_color;
      whyChooseUs.content.why_choose_us.description = description || whyChooseUs.content.why_choose_us.description;
      whyChooseUs.content.why_choose_us.image = image;
      whyChooseUs.content.why_choose_us.section_title = section_title || whyChooseUs.content.why_choose_us.section_title;

      await whyChooseUs.save();

      res.status(200).json({
        message: "Why Choose Us data updated successfully",
        data: {
          structure: "why_choose_us",
          feature_titles: whyChooseUs.content.why_choose_us.feature_titles,
          feature_title_color: whyChooseUs.content.why_choose_us.feature_title_color,
          description: whyChooseUs.content.why_choose_us.description,
          image: whyChooseUs.content.why_choose_us.image,
          section_title: whyChooseUs.content.why_choose_us.section_title,
        },
      });
    } catch (error) {
      console.error("Error updating Why Choose Us data:", error);
      res.status(500).json({
        message: "Error updating Why Choose Us data",
        error: error.message,
      });
    }
  });
};

const getWhyChooseUs = async (req, res) => {
  try {
    const whyChooseUs = await HomePageDataModel.findOne({ structure_type: "why_choose_us" });
    if (!whyChooseUs || !whyChooseUs.content.why_choose_us) {
      return res.status(404).json({
        message: "Why Choose Us section not found",
      });
    }

    res.status(200).json({
      data: {
        structure: "why_choose_us",
        feature_titles: whyChooseUs.content.why_choose_us.feature_titles,
        feature_title_color: whyChooseUs.content.why_choose_us.feature_title_color,
        description: whyChooseUs.content.why_choose_us.description,
        image: whyChooseUs.content.why_choose_us.image,
        section_title: whyChooseUs.content.why_choose_us.section_title,
      },
    });
  } catch (error) {
    console.error("Error fetching Why Choose Us data:", error);
    res.status(500).json({
      message: "Error fetching Why Choose Us data",
      error: error.message,
    });
  }
};

module.exports={
    addWhyChooseUs,
    updateWhyChooseUs,
    getWhyChooseUs
}