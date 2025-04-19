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
        "our_impact_images"
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
}).fields([
  { name: "data[0][image]", maxCount: 1 },
  { name: "data[1][image]", maxCount: 1 },
  { name: "data[2][image]", maxCount: 1 },
  { name: "data[3][image]", maxCount: 1 },
  { name: "left_big_file", maxCount: 1 },
  { name: "right_big_file", maxCount: 1 },
  { name: "left_small_image[0][desktop][image]", maxCount: 1 },
  { name: "left_small_image[0][mobile][image]", maxCount: 1 },
  { name: "right_small_image[0][desktop][image]", maxCount: 1 },
  { name: "right_small_image[0][mobile][image]", maxCount: 1 },
]);

const addOurImpact = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        success:false,
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const { data, section_title } = req.body;

      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({
          success:false,
          message: "data array is required and must not be empty",
        });
      }

      const transformedData = data.map((item, index) => ({
        title: item.title || "",
        title_color: item.title_color || "",
        description: item.description || "",
        description_color: item.description_color || "",
        image: req.files[`data[${index}][image]`]?.[0]
          ? `home/our_impact_images/${
              req.files[`data[${index}][image]`][0].filename
            }`
          : "",
      }));

      const leftBigFile = req.files["left_big_file"]?.[0]
        ? `home/our_impact_images/${req.files["left_big_file"][0].filename}`
        : "";
      const rightBigFile = req.files["right_big_file"]?.[0]
        ? `home/our_impact_images/${req.files["right_big_file"][0].filename}`
        : "";
      const leftSmallImage = [
        {
          desktop: {
            image: req.files["left_small_image[0][desktop][image]"]?.[0]
              ? `home/our_impact_images/${req.files["left_small_image[0][desktop][image]"][0].filename}`
              : "",
            cta_button_name:
              req.body.left_small_image?.[0]?.desktop?.cta_button_name || "",
            cta_button_color:
              req.body.left_small_image?.[0]?.desktop?.cta_button_color || "",
            cta_button_link:
              req.body.left_small_image?.[0]?.desktop?.cta_button_link || "",
          },
          mobile: {
            image: req.files["left_small_image[0][mobile][image]"]?.[0]
              ? `home/our_impact_images/${req.files["left_small_image[0][mobile][image]"][0].filename}`
              : "",
            cta_button_name:
              req.body.left_small_image?.[0]?.mobile?.cta_button_name || "",
            cta_button_color:
              req.body.left_small_image?.[0]?.mobile?.cta_button_color || "",
            cta_button_link:
              req.body.left_small_image?.[0]?.mobile?.cta_button_link || "",
          },
        },
      ];
      const rightSmallImage = [
        {
          desktop: {
            image: req.files["right_small_image[0][desktop][image]"]?.[0]
              ? `home/our_impact_images/${req.files["right_small_image[0][desktop][image]"][0].filename}`
              : "",
            cta_button_name:
              req.body.right_small_image?.[0]?.desktop?.cta_button_name || "",
            cta_button_color:
              req.body.right_small_image?.[0]?.desktop?.cta_button_color || "",
            cta_button_link:
              req.body.right_small_image?.[0]?.desktop?.cta_button_link || "",
          },
          mobile: {
            image: req.files["right_small_image[0][mobile][image]"]?.[0]
              ? `home/our_impact_images/${req.files["right_small_image[0][mobile][image]"][0].filename}`
              : "",
            cta_button_name:
              req.body.right_small_image?.[0]?.mobile?.cta_button_name || "",
            cta_button_color:
              req.body.right_small_image?.[0]?.mobile?.cta_button_color || "",
            cta_button_link:
              req.body.right_small_image?.[0]?.mobile?.cta_button_link || "",
          },
        },
      ];

      const existingImpact = await HomePageDataModel.findOne({
        structure_type: "our_impact",
      });
      if (existingImpact) {
        return res.status(400).json({
          success:false,
          message: "Cannot add our_impact structure again, instead update it",
        });
      }

      const newImpact = new HomePageDataModel({
        structure_type: "our_impact",
        content: {
          our_impact: {
            data: transformedData,
            left_big_file: leftBigFile,
            right_big_file: rightBigFile,
            left_small_image: leftSmallImage,
            right_small_image: rightSmallImage,
            section_title: section_title || "",
          },
        },
      });

      await newImpact.save();

      res.status(201).json({
        success:true,
        message: "Our Impact data added successfully",
        data: newImpact.content.our_impact,
      });
    } catch (error) {
      console.error("Error adding Our Impact data:", error);
      res.status(500).json({
        success:false,
        message: "Error adding Our Impact data",
        error: error.message,
      });
    }
  });
};

const updateOurImpact = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const { data, section_title } = req.body;

      const impact = await HomePageDataModel.findOne({
        structure_type: "our_impact",
      });
      if (!impact) {
        return res.status(404).json({
          success:false,
          message: "Our Impact section not found",
        });
      }

      if (data && Array.isArray(data)) {
        const transformedData = data.map((item, index) => ({
          title:
            item.title || impact.content.our_impact.data[index]?.title || "",
          title_color:
            item.title_color ||
            impact.content.our_impact.data[index]?.title_color ||
            "",
          description:
            item.description ||
            impact.content.our_impact.data[index]?.description ||
            "",
          description_color:
            item.description_color ||
            impact.content.our_impact.data[index]?.description_color ||
            "",
          image: req.files[`data[${index}][image]`]?.[0]
            ? `home/our_impact_images/${
                req.files[`data[${index}][image]`][0].filename
              }`
            : impact.content.our_impact.data[index]?.image || "",
        }));
        impact.content.our_impact.data =
          transformedData.length === impact.content.our_impact.data.length
            ? transformedData
            : transformedData.slice(0, 4); // Limit to 4 items
      }

      impact.content.our_impact.left_big_file = req.files["left_big_file"]?.[0]
        ? `home/our_impact_images/${req.files["left_big_file"][0].filename}`
        : impact.content.our_impact.left_big_file;
      impact.content.our_impact.right_big_file = req.files[
        "right_big_file"
      ]?.[0]
        ? `home/our_impact_images/${req.files["right_big_file"][0].filename}`
        : impact.content.our_impact.right_big_file;

      if (
        req.body.left_small_image &&
        Array.isArray(req.body.left_small_image)
      ) {
        impact.content.our_impact.left_small_image = [
          {
            desktop: {
              image: req.files["left_small_image[0][desktop][image]"]?.[0]
                ? `home/our_impact_images/${req.files["left_small_image[0][desktop][image]"][0].filename}`
                : impact.content.our_impact.left_small_image[0]?.desktop
                    ?.image || "",
              cta_button_name:
                req.body.left_small_image[0]?.desktop?.cta_button_name ||
                impact.content.our_impact.left_small_image[0]?.desktop
                  ?.cta_button_name ||
                "",
              cta_button_color:
                req.body.left_small_image[0]?.desktop?.cta_button_color ||
                impact.content.our_impact.left_small_image[0]?.desktop
                  ?.cta_button_color ||
                "",
              cta_button_link:
                req.body.left_small_image[0]?.desktop?.cta_button_link ||
                impact.content.our_impact.left_small_image[0]?.desktop
                  ?.cta_button_link ||
                "",
            },
            mobile: {
              image: req.files["left_small_image[0][mobile][image]"]?.[0]
                ? `home/our_impact_images/${req.files["left_small_image[0][mobile][image]"][0].filename}`
                : impact.content.our_impact.left_small_image[0]?.mobile
                    ?.image || "",
              cta_button_name:
                req.body.left_small_image[0]?.mobile?.cta_button_name ||
                impact.content.our_impact.left_small_image[0]?.mobile
                  ?.cta_button_name ||
                "",
              cta_button_color:
                req.body.left_small_image[0]?.mobile?.cta_button_color ||
                impact.content.our_impact.left_small_image[0]?.mobile
                  ?.cta_button_color ||
                "",
              cta_button_link:
                req.body.left_small_image[0]?.mobile?.cta_button_link ||
                impact.content.our_impact.left_small_image[0]?.mobile
                  ?.cta_button_link ||
                "",
            },
          },
        ];
      }

      if (
        req.body.right_small_image &&
        Array.isArray(req.body.right_small_image)
      ) {
        impact.content.our_impact.right_small_image = [
          {
            desktop: {
              image: req.files["right_small_image[0][desktop][image]"]?.[0]
                ? `home/our_impact_images/${req.files["right_small_image[0][desktop][image]"][0].filename}`
                : impact.content.our_impact.right_small_image[0]?.desktop
                    ?.image || "",
              cta_button_name:
                req.body.right_small_image[0]?.desktop?.cta_button_name ||
                impact.content.our_impact.right_small_image[0]?.desktop
                  ?.cta_button_name ||
                "",
              cta_button_color:
                req.body.right_small_image[0]?.desktop?.cta_button_color ||
                impact.content.our_impact.right_small_image[0]?.desktop
                  ?.cta_button_color ||
                "",
              cta_button_link:
                req.body.right_small_image[0]?.desktop?.cta_button_link ||
                impact.content.our_impact.right_small_image[0]?.desktop
                  ?.cta_button_link ||
                "",
            },
            mobile: {
              image: req.files["right_small_image[0][mobile][image]"]?.[0]
                ? `home/our_impact_images/${req.files["right_small_image[0][mobile][image]"][0].filename}`
                : impact.content.our_impact.right_small_image[0]?.mobile
                    ?.image || "",
              cta_button_name:
                req.body.right_small_image[0]?.mobile?.cta_button_name ||
                impact.content.our_impact.right_small_image[0]?.mobile
                  ?.cta_button_name ||
                "",
              cta_button_color:
                req.body.right_small_image[0]?.mobile?.cta_button_color ||
                impact.content.our_impact.right_small_image[0]?.mobile
                  ?.cta_button_color ||
                "",
              cta_button_link:
                req.body.right_small_image[0]?.mobile?.cta_button_link ||
                impact.content.our_impact.right_small_image[0]?.mobile
                  ?.cta_button_link ||
                "",
            },
          },
        ];
      }

      impact.content.our_impact.section_title =
        section_title || impact.content.our_impact.section_title;

      await impact.save();

      res.status(200).json({
        success:true,
        message: "Our Impact data updated successfully",
        data: impact.content.our_impact,
      });
    } catch (error) {
      console.error("Error updating Our Impact data:", error);
      res.status(500).json({
        success:false,
        message: "Error updating Our Impact data",
        error: error.message,
      });
    }
  });
};

const getOurImpact = async (req, res) => {
    try {
      const impact = await HomePageDataModel.findOne({
        structure_type: "our_impact",
      });
      if (!impact || !impact.content.our_impact) {
        return res.status(404).json({
          success:false,
          message: "Our Impact section not found",
        });
      }
  
      res.status(200).json({
        success:true,
        data: impact.content.our_impact,
      });
    } catch (error) {
      console.error("Error fetching Our Impact data:", error);
      res.status(500).json({
        success:false,
        message: "Error fetching Our Impact data",
        error: error.message,
      });
    }
  };

module.exports = {
  addOurImpact,
  updateOurImpact,
  getOurImpact
};
