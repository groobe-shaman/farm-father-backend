const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { HomePageDataModel } = require("../../../../Home/model/model");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const validFields = [
        "data[0][image]",
        "data[1][image]",
        "data[2][image]",
        "data[3][image]",
        "data[4][image]",
      ];

      if (!validFields.includes(file.fieldname)) {
        return cb(new Error("Invalid field name: " + file.fieldname));
      }

      const uploadPath = path.join(
        process.cwd(),
        "public",
        "home",
        "our_wall_images"
      );

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        Date.now() +
          "-" +
          file.fieldname.replace(/\[|\]/g, "_") +
          path.extname(file.originalname)
      );
    },
  })
}).fields([
  { name: "data[0][image]", maxCount: 1 },
  { name: "data[1][image]", maxCount: 1 },
  { name: "data[2][image]", maxCount: 1 },
  { name: "data[3][image]", maxCount: 1 },
  { name: "data[4][image]", maxCount: 1 },
]);

const addOurWallHomepage = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const files = req.files || {};
      const body = req.body;

      const expectedFields = [
        "data[0][image]",
        "data[1][image]",
        "data[2][image]",
        "data[3][image]",
        "data[4][image]",
      ];
      if (!expectedFields.every((field) => files[field]?.[0])) {
        return res.status(400).json({
          success:false,
          message: "Images for all 5 data items are required",
        });
      }
         
      let dataArray = Array.isArray(body.data)
        ? body.data
        : JSON.parse(body.data);

      const finalData = [];

      for (let i = 0; i < 5; i++) {
        const fileKey = `data[${i}][image]`;
        const imageFile = files[fileKey]?.[0];
        const item = dataArray[i];

        if (
          !item ||
          !item.name ||
          !item.rating ||
          !item.review ||
          !item.location ||
          !imageFile
        ) {
          return res.status(400).json({
            success:false,
            message: `All fields (image, name, rating, review, location) are required for data[${i}]`,
          });
        }

        finalData.push({
          image: `home/our_wall_images/${imageFile.filename}`,
          name: item.name,
          rating: item.rating,
          review: item.review,
          location: item.location,
        });
      }

      const homePage = await HomePageDataModel.findOne({
        structure_type: "our_wall_of_love",
      });
      if (homePage) {
        return res.status(400).json({
          success:false,
          message:
            "Our Wall Of Love section already exists. Please update it instead.",
        });
      }

      const newHomePage = new HomePageDataModel({
        structure_type: "our_wall_of_love",
        content: {
          our_wall_of_love: {
            data: finalData,
            section_title: body.section_title || "",
          },
        },
      });

      await newHomePage.save();

      res.status(201).json({
        success:true,
        message: "Our Wall of Love data added successfully",
        data: {
          structure: "our_wall_of_love",
          data: newHomePage.content.our_wall_of_love.data,
          section_title: newHomePage.content.our_wall_of_love.section_title,
        },
      });
    } catch (error) {
      console.error("Error adding our_wall_of_love data:", error);
      res.status(500).json({
        success:false,
        message: "Error adding our_wall_of_love data",
        error: error.message,
      });
    }
  });
};

const updateOurWallHomepage = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError || error) {
      return res.status(400).json({
        message: "File upload error",
        error: error.message,
      });
    }

    try {
      const files = req.files || {};
      const body = req.body;

      let dataArray = Array.isArray(body.data)
        ? body.data
        : JSON.parse(body.data);

      const homePage = await HomePageDataModel.findOne({
        structure_type: "our_wall_of_love",
      });

      if (!homePage) {
        return res.status(404).json({
          success:false,
          message: "Our Wall of Love section not found",
        });
      }

      const updatedData = [];

      for (let i = 0; i < 5; i++) {
        const item = dataArray[i];
        const fileKey = `data[${i}][image]`;
        const imageFile = files[fileKey]?.[0];

        if (!item || !item.name || !item.rating|| !item.review || !item.location) {
          return res.status(400).json({
            success:false,
            message: `All fields (name, rating, review, location) are required for data[${i}]`,
          });
        }

        let imagePath = imageFile
          ? `home/our_wall_images/${imageFile.filename}`
          : homePage.content.our_wall_of_love.data[i]?.image;

        if (!imagePath) {
          return res.status(400).json({
            success:false,
            message: `Image for data[${i}] is required and no existing image found`,
          });
        }

        updatedData.push({
          name: item.name,
          rating: item.rating,
          review: item.review,
          location: item.location,
          image: imagePath,
        });
      }

      homePage.content.our_wall_of_love = {
        data: updatedData,
        section_title:
          body.section_title || homePage.content.our_wall_of_love.section_title,
      };

      await homePage.save();

      res.status(200).json({
        success:true,
        message: "Our Wall Of Love data updated successfully",
        data: {
          structure: "our_wall_of_love",
          data: homePage.content.our_wall_of_love.data,
          section_title: homePage.content.our_wall_of_love.section_title,
        },
      });
    } catch (error) {
      console.error("Error updating our_wall_of_love data:", error);
      res.status(500).json({
        success:false,
        message: "Error updating our_wall_of_love data",
        error: error.message,
      });
    }
  });
};

const getOurWallHomepage = async (req, res) => {
  try {
    const homePage = await HomePageDataModel.findOne({
      structure_type: "our_wall_of_love",
    });
    if (!homePage) {
      return res.status(404).json({
        success:false,
        message: "Our Wall of Love section not found",
      });
    }

    res.status(200).json({
      success:true,
      data: homePage.content.our_wall_of_love.data,
      section_title: homePage.content.our_wall_of_love.section_title,
    });
  } catch (error) {
    console.error("Error fetching our_wall_of_love data:", error);
    res.status(500).json({
      success:false,
      message: "Error fetching our_wall_of_love data",
      error: error.message,
    });
  }
};
module.exports = {
  addOurWallHomepage,
  updateOurWallHomepage,
  getOurWallHomepage,
};
