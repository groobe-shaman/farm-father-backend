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
        "settings_icons"
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
  { name: "cta_button_pintrest_icon", maxCount: 1 },
]);

const addSettings = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {

      const companyMobileNumber = req.body.company_mobile_number || "";
      const companyEmailId = req.body.company_email_id || "";
      const companyAddress = req.body.company_address || "";

      const socialMediaLinks = [
        {
          platform: "whatsapp",
          icon: req.files["cta_button_whatsapp_icon"]?.[0]?.filename
            ? `home/settings_icons/${req.files["cta_button_whatsapp_icon"][0].filename}`
            : "",
          link: req.body.cta_button_whatsapp_link || "",
        },
        {
          platform: "facebook",
          icon: req.files["cta_button_facebook_icon"]?.[0]?.filename
            ? `home/settings_icons/${req.files["cta_button_facebook_icon"][0].filename}`
            : "",
          link: req.body.cta_button_facebook_link || "",
        },
        {
          platform: "instagram",
          icon: req.files["cta_button_instagram_icon"]?.[0]?.filename
            ? `home/settings_icons/${req.files["cta_button_instagram_icon"][0].filename}`
            : "",
          link: req.body.cta_button_instagram_link || "",
        },
        {
          platform: "linkedin",
          icon: req.files["cta_button_linkedin_icon"]?.[0]?.filename
            ? `home/settings_icons/${req.files["cta_button_linkedin_icon"][0].filename}`
            : "",
          link: req.body.cta_button_linkedin_link || "",
        },
        {
          platform: "pintrest",
          icon: req.files["cta_button_pintrest_icon"]?.[0]?.filename
            ? `home/settings_icons/${req.files["cta_button_pintrest_icon"][0].filename}`
            : "",
          link: req.body.cta_button_pintrest_link || "",
        },
      ];

      const existingSettings = await HomePageDataModel.findOne({
        structure_type: "settings",
      });
      if (existingSettings) {
        return res.status(400).json({
          success:false,
          message: "Settings section already exists. Please update it instead.",
        });
      }

      const newSettings = new HomePageDataModel({
        structure_type: "settings",
        content: {
          settings: {
            social_media_links: socialMediaLinks,
            company_details: {
              company_mobile_number: companyMobileNumber,
              company_email_id: companyEmailId,
              company_address: companyAddress,
            },
          },
        },
      });

      await newSettings.save();

      res.status(201).json({
        success:true,
        message: "Settings data added successfully",
        data: {
          structure: "settings",
          social_media_links: newSettings.content.settings.social_media_links,
          company_details: newSettings.content.settings.company_details,
        },
      });
    } catch (error) {
      console.error("Error adding Settings data:", error);
      res.status(500).json({
        success:false,
        message: "Error adding Settings data",
        error: error.message,
      });
    }
  });
};

const updateSettings = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res
        .status(400)
        .json({ message: "File upload error", error: error.message });
    }

    try {
      const platforms = [
        "whatsapp",
        "facebook",
        "instagram",
        "linkedin",
        "pintrest",
      ];
      const settings = await HomePageDataModel.findOne({
        structure_type: "settings",
      });

      if (!settings) {
        return res.status(404).json({ success:false,message: "Settings section not found" });
      }

      const updatedLinks = platforms.map((platform) => {
        const file = req.files[`cta_button_${platform}_icon`]?.[0];
        const link = req.body[`cta_button_${platform}_link`];

        const existing =
          settings.content.settings.social_media_links.find(
            (sml) => sml.platform === platform
          ) || {};

        return {
          platform,
          icon: file
            ? `home/settings_icons/${file.filename}`
            : existing.icon || "",
          link: link || existing.link || "",
        };
      });

      settings.content.settings.social_media_links = updatedLinks;
      settings.content.settings.company_details.company_mobile_number =
        req.body.company_mobile_number ||
        settings.content.settings.company_details.company_mobile_number;
      settings.content.settings.company_details.company_email_id =
        req.body.company_email_id ||
        settings.content.settings.company_details.company_email_id;
      settings.content.settings.company_details.company_address =
        req.body.company_address ||
        settings.content.settings.company_details.company_address;
     
      await settings.save();

      res.status(200).json({
        success:true,
        message: "Settings data updated successfully",
        data: settings.content.settings,
      });
    } catch (error) {
      console.error("Error updating Settings data:", error);
      res.status(500).json({
        success:false,
        message: "Error updating Settings data",
        error: error.message,
      });
    }
  });
};

const getSettings = async (req, res) => {
    try {
      const settings = await HomePageDataModel.findOne({ structure_type: "settings" });
  
      if (!settings || !settings.content.settings) {
        return res.status(404).json({success:false, message: "Settings section not found" });
      }
  
      res.status(200).json({
        success:true,
        data: settings.content.settings,
      });
    } catch (error) {
      console.error("Error fetching Settings data:", error);
      res.status(500).json({
        success:false,
        message: "Error fetching Settings data",
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
      const settingsDoc = await HomePageDataModel.findOne({
        structure_type: "settings",
      });
  
      if (!settingsDoc) {
        return res.status(404).json({
          success: false,
          message: "Settings section not found",
        });
      }
  
      const link = settingsDoc.content.settings.social_media_links.find(
        (item) => item.platform === platform
      );
  
      if (!link) {
        return res.status(404).json({
          success: false,
          message: `No social media link found for platform: ${platform}`,
        });
      }
  
      link.isHidden = !link.isHidden;
  
      await settingsDoc.save();
  
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
  addSettings,
  updateSettings,
  getSettings,
  toggleSocialMediaVisibility
};
