const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { HomePageDataModel } = require("../../../../Home/model/model");


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.cwd(), "public","home","contact_us_images");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + "contact_us_image" + path.extname(file.originalname));
    },
  })
}).array("contact_us_image", 3);


const addContactUsHomepage = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const { section_title } = req.body;
      const images = req.files.map(file => `home/contact_us_images/${file.filename}`);

      if (images.length < 3) {
        return res.status(400).json({
          success:false,
          message: `Need ${3 - images.length} more image(s)`,
        });
      }
      if (images.length > 3) {
        return res.status(400).json({
          success:false,
          message: "Only 3 images can be uploaded",
        });
      }

      const existingContactUs = await HomePageDataModel.findOne({ structure_type: "contact_us" });
      if (existingContactUs) {
        return res.status(400).json({
          success:false,
          message: "Contact Us section already exists. Please update it instead.",
        });
      }

      const newContactUs = new HomePageDataModel({
        structure_type: "contact_us",
        content: {
          contact_us: {
            images,
            section_title: section_title || "",
          },
        },
      });

      await newContactUs.save();

      res.status(201).json({
        success:true,
        message: "Contact Us data added successfully",
        data: {
          structure: "contact_us",
          images: newContactUs.content.contact_us.images,
          section_title: newContactUs.content.contact_us.section_title,
        },
      });
    } catch (error) {
      console.error("Error adding Contact Us data:", error);
      res.status(500).json({
        success:false,
        message: "Error adding Contact Us data",
        error: error.message,
      });
    }
  });
};

const updateContactUsHomepage = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {

      const { existing_images, section_title } = req.body;
      const contactUs = await HomePageDataModel.findOne({ structure_type: "contact_us" });
      if (!contactUs) {
        return res.status(404).json({
          success:false,
          message: "Contact Us section not found",
        });
      }

      const currentImages = existing_images || contactUs.content.contact_us.images;
      const newImages = req.files ? req.files.map(file => `home/contact_us_images/${file.filename}`) : [];

      let updatedImages = [...currentImages];
      if (newImages.length > 0) {
        updatedImages = [...newImages, ...updatedImages.slice(0, 3 - newImages.length)].slice(0, 3);
      }

      if (updatedImages.length < 3) {
        return res.status(400).json({
          success:false,
          message: `Need ${3 - updatedImages.length} more image(s) to maintain three images`,
        });
      }
      if (updatedImages.length > 3) {
        return res.status(400).json({
          success:false,
          message: "Only 3 images can be uploaded",
        });
      }

      contactUs.content.contact_us.images = updatedImages;
      contactUs.content.contact_us.section_title = section_title || contactUs.content.contact_us.section_title;

      await contactUs.save();

      res.status(200).json({
        success:true,
        message: "Contact Us data updated successfully",
        data: {
          structure: "contact_us",
          images: contactUs.content.contact_us.images,
          section_title: contactUs.content.contact_us.section_title,
        },
      });
    } catch (error) {
      console.error("Error updating Contact Us data:", error);
      res.status(500).json({
        success:false,
        message: "Error updating Contact Us data",
        error: error.message,
      });
    }
  });
};

const getContactUsHomepage = async (req, res) => {
  try {
    const contactUs = await HomePageDataModel.findOne({ structure_type: "contact_us" });
    if (!contactUs || !contactUs.content.contact_us) {
      return res.status(404).json({
        success:false,
        message: "Contact Us section not found",
      });
    }

    res.status(200).json({
      success:true,
      data: {
        structure: "contact_us",
        images: contactUs.content.contact_us.images,
        section_title: contactUs.content.contact_us.section_title,
      },
    });
  } catch (error) {
    console.error("Error fetching Contact Us data:", error);
    res.status(500).json({
      success:false,
      message: "Error fetching Contact Us data",
      error: error.message,
    });
  }
};

module.exports={
    addContactUsHomepage,
    updateContactUsHomepage,
    getContactUsHomepage
}