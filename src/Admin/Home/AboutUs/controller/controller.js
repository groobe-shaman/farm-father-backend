const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { HomePageDataModel } = require("../../../../Home/model/model");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "home",
        "aboutus_images"
      );
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        Date.now() + "-" + file.fieldname + path.extname(file.originalname)
      );
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: "cta_button_whatsapp_icon", maxCount: 1 },
  { name: "cta_button_facebook_icon", maxCount: 1 },
  { name: "cta_button_instagram_icon", maxCount: 1 },
  { name: "cta_button_linkedin_icon", maxCount: 1 },
  { name: "cta_button_pinterest_icon", maxCount: 1 },
  { name: "about_us_image", maxCount: 1 },
]);

const addAboutUs = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const section_title = req.body.section_title || "";
      const description = req.body.description || "";

      const socialMediaLinks = [
        {
          platform: "whatsapp",
          icon: req.files["cta_button_whatsapp_icon"]?.[0]?.filename
            ? `home/aboutus_images/${req.files["cta_button_whatsapp_icon"][0].filename}`
            : "",
          link: req.body.cta_button_whatsapp_link || "",
        },
        {
          platform: "facebook",
          icon: req.files["cta_button_facebook_icon"]?.[0]?.filename
            ? `home/aboutus_images/${req.files["cta_button_facebook_icon"][0].filename}`
            : "",
          link: req.body.cta_button_facebook_link || "",
        },
        {
          platform: "instagram",
          icon: req.files["cta_button_instagram_icon"]?.[0]?.filename
            ? `home/aboutus_images/${req.files["cta_button_instagram_icon"][0].filename}`
            : "",
          link: req.body.cta_button_instagram_link || "",
        },
        {
          platform: "linkedin",
          icon: req.files["cta_button_linkedin_icon"]?.[0]?.filename
            ? `home/aboutus_images/${req.files["cta_button_linkedin_icon"][0].filename}`
            : "",
          link: req.body.cta_button_linkedin_link || "",
        },
        {
          platform: "pinterest",
          icon: req.files["cta_button_pinterest_icon"]?.[0]?.filename
            ? `home/aboutus_images/${req.files["cta_button_pinterest_icon"][0].filename}`
            : "",
          link: req.body.cta_button_pinterest_link || "",
        },
      ];

      const image = req.files["about_us_image"]?.[0]
        ? `home/aboutus_images/${req.files["about_us_image"][0].filename}`
        : "";

      const existingData = await HomePageDataModel.findOne({
        structure_type: "about_us",
      });

      if (existingData) {
        return res.status(400).json({
          success: false,
          message: "About us section already exists. Please update it instead.",
        });
      }

      const newData = new HomePageDataModel({
        structure_type: "about_us",
        content: {
          about_us: {
            section_title,
            description,
            about_us_image: image,
            social_media_links: socialMediaLinks,
          },
        },
      });

      await newData.save();

      res.status(201).json({
        success: true,
        message: "About Us section added successfully",
        data: newData.content.about_us,
      });
    } catch (error) {
      console.error("Error adding About Us data:", error);
      res.status(500).json({
        success: false,
        message: "Error adding About Us data",
        error: error.message,
      });
    }
  });
};

const updateAboutUs = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const data = await HomePageDataModel.findOne({
        structure_type: "about_us",
      });

      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "About Us section not found" });
      }

      const section_title =
        req.body.section_title || data.content.about_us.section_title;
      const description =
        req.body.description || data.content.about_us.description;
      const about_us_image = req.files["about_us_image"]?.[0]
        ? `home/aboutus_images/${req.files["about_us_image"][0].filename}`
        : data.content.about_us.about_us_image;

      const platforms = [
        "whatsapp",
        "facebook",
        "instagram",
        "linkedin",
        "pinterest",
      ];
      const updatedLinks = platforms.map((platform) => {
        const file = req.files[`cta_button_${platform}_icon`]?.[0];
        const link = req.body[`cta_button_${platform}_link`];

        const existing =
          data.content.about_us.social_media_links.find(
            (sml) => sml.platform === platform
          ) || {};

        return {
          platform,
          icon: file
            ? `home/aboutus_images/${file.filename}`
            : existing.icon || "",
          link: link || existing.link || "",
          isHidden:existing.isHidden
        };
      });

      data.content.about_us = {
        section_title,
        description,
        about_us_image,
        social_media_links: updatedLinks,
      };

      await data.save();

      res.status(200).json({
        success: true,
        message: "About Us section updated successfully",
        data: data.content.about_us,
      });
    } catch (error) {
      console.error("Error updating About Us data:", error);
      res.status(500).json({
        success: false,
        message: "Error updating About Us data",
        error: error.message,
      });
    }
  });
};

const getAboutUs = async (req, res) => {
  try {
    const data = await HomePageDataModel.findOne({
      structure_type: "about_us",
    });

    if (!data || !data.content.about_us) {
      return res
        .status(404)
        .json({ success: false, message: "About Us section not found" });
    }

    res.status(200).json({
      success: true,
      data: data.content.about_us,
    });
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching About Us data",
      error: error.message,
    });
  }
};

const toggleSocialMediaVisibility = async (req, res) => {
  const { platform } = req.body;

  if (!platform) {
    return res.status(400).json({
      success: false,
      message: "Platform is required",
    });
  }

  try {
    const aboutUsDoc = await HomePageDataModel.findOne({
      structure_type: "about_us",
    });

    if (!aboutUsDoc) {
      return res.status(404).json({
        success: false,
        message: "About Us section not found",
      });
    }

    const link = aboutUsDoc.content.about_us.social_media_links.find(
      (item) => item.platform === platform
    );

    if (!link) {
      return res.status(404).json({
        success: false,
        message: `No social media link found for platform: ${platform}`,
      });
    }

    link.isHidden = !link.isHidden;

    await aboutUsDoc.save();

    res.status(200).json({
      success: true,
      message: `Visibility for ${platform} updated successfully`,
      data: link,
    });
  } catch (error) {
    console.error("Error toggling social media visibility:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = {
  addAboutUs,
  updateAboutUs,
  getAboutUs,
  toggleSocialMediaVisibility,
};
