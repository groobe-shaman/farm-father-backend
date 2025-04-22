const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
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
        "data[5][image]",
      ];

      if (!validFields.includes(file.fieldname)) {
        return cb(new Error("Invalid field name: " + file.fieldname));
      }

      const uploadPath = path.join(
        process.cwd(),
        "public",
        "home",
        "how_to_use_images"
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
  { name: "data[5][image]", maxCount: 1 },

]);


const addHowToUseHomepage = async (req, res) => {
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
        "data[5][image]",
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

      for (let i = 0; i < 6; i++) {
        const fileKey = `data[${i}][image]`;
        const imageFile = files[fileKey]?.[0];
        const item = dataArray[i];

        // if (
        //   !item ||
        //   !item.title ||
        //   !item.title_color ||
        //   !item.description ||
        //   !imageFile
        // ) {
        //   return res.status(400).json({
        //     message: `All fields (image, title, title_color, description) are required for data[${i}]`,
        //   });
        // }

        finalData.push({
          image: `home/how_to_use_images/${imageFile.filename}`,
          title: item.title,
          sub_title: item.sub_title,
          description: item.description,
        });
      }

    
      const homePage = await HomePageDataModel.findOne({
        structure_type: "how_to_use",
      });
      if (homePage) {
        return res.status(400).json({
          success:false,
          message: "How To Use section already exists. Please update it instead.",
        });
      }

      const newHomePage = new HomePageDataModel({
        structure_type: "how_to_use",
        content: {
            how_to_use: {
            data: finalData,
            section_title: body.section_title || "",
          },
        },
      });

      await newHomePage.save();

      res.status(201).json({
        success:true,
        message: "How To Use data added successfully",
        data: {
          structure: "how_to_use",
          data: newHomePage.content.how_to_use.data,
          section_title: newHomePage.content.how_to_use.section_title,
        },
      });
    } catch (error) {
      console.error("Error adding how_to_use data:", error);
      res.status(500).json({
        success:false,
        message: "Error adding how_to_use data",
        error: error.message,
      });
    }
  });
};

const updateHowToUseHomepage = async (req, res) => {
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
        structure_type: "how_to_use",
      });

      if (!homePage) {
        return res.status(404).json({
          success:false,
          message: "How To Use section not found",
        });
      }

      const updatedData = [];

      for (let i = 0; i < 6; i++) {
        const item = dataArray[i];
        const fileKey = `data[${i}][image]`;
        const imageFile = files[fileKey]?.[0];

        // if (!item || !item.title || !item.title_color || !item.description) {
        //   return res.status(400).json({
        //     message: `All fields (title, title_color, description) are required for data[${i}]`,
        //   });
        // }

        let imagePath = imageFile
          ? `home/how_to_use_images/${imageFile.filename}`
          : homePage.content.how_to_use.data[i]?.image;

        if (!imagePath) {
          return res.status(400).json({
            success:false,
            message: `Image for data[${i}] is required and no existing image found`,
          });
        }

        updatedData.push({
          title: item.title,
          subt_title: item.sub_title,
          description: item.description,
          image: imagePath,
        });
      }

      homePage.content.how_to_use= {
        data: updatedData,
        section_title:
          body.section_title || homePage.content.essence.section_title,
      };

      await homePage.save();

      res.status(200).json({
        success:true,
        message: "How To Use data updated successfully",
        data: {
          structure: "how_to_use",
          data: homePage.content.how_to_use.data,
          section_title: homePage.content.how_to_use.section_title,
        },
      });
    } catch (error) {
      console.error("Error updating how_to_use data:", error);
      res.status(500).json({
        success:false,
        message: "Error updating how_to_use data",
        error: error.message,
      });
    }
  });
};

const getHowToUseHomepage = async (req, res) => {
  try {
    const homePage = await HomePageDataModel.findOne({
      structure_type: "how_to_use",
    });
    if (!homePage) {
      return res.status(404).json({
        success:false,
        message: "How To Use section not found",
      });
    }

    res.status(200).json({
      data: homePage.content.how_to_use.data,
      section_title: homePage.content.how_to_use.section_title,
    });
  } catch (error) {
    console.error("Error fetching how_to_use data:", error);
    res.status(500).json({
      success:false,
      message: "Error fetching how_to_use data",
      error: error.message,
    });
  }
};
module.exports = {
  addHowToUseHomepage,
  updateHowToUseHomepage,
  getHowToUseHomepage,
};
