const { HomePageDataModel } = require("../../../../Home/model/model");
const { ProductDataModel } = require("../model/model");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;
      switch (file.fieldname) {
        case "main_image":
          uploadPath = path.join(
            process.cwd(),
            "public",
            "product",
            "main_image"
          );
          break;
        case "banner_image":
          uploadPath = path.join(
            process.cwd(),
            "public",
            "product",
            "banner_image"
          );
          break;
        case "highlight_media":
          uploadPath = path.join(
            process.cwd(),
            "public",
            "product",
            "highlight_media"
          );
          break;
        case "product_images":
          uploadPath = path.join(
            process.cwd(),
            "public",
            "product",
            "product_images"
          );
          break;
        case "thumbnail_image":
          uploadPath = path.join(
            process.cwd(),
            "public",
            "product",
            "thumbnail_image"
          );
          break;
        default:
          return cb(new Error(`Invalid field name: ${file.fieldname}`));
      }

      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueName);
    },
  }),
}).fields([
  { name: "main_image", maxCount: 1 },
  { name: "highlight_media", maxCount: 1 },
  { name: "product_images", maxCount: 10 },
]);

async function getNextId() {
  const lastProduct = await ProductDataModel.findOne().sort({ id: -1 });
  return lastProduct?.id ? +lastProduct.id + 1 : 1;
}

const addProduct = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({ error: error.message });
    } else if (error) {
      return res.status(500).json({ error: error.message });
    }
    try {
      let nextProductId = await getNextId();

      const lastProduct = await ProductDataModel.findOne(
        {},
        {},
        { sort: { sort_id: -1 } }
      ).lean();

      let newSort_id = lastProduct ? lastProduct.sort_id + 10 : 10;

      const sort_id = req.body.sort_id
        ? parseInt(req.body.sort_id)
        : newSort_id;

      const files = req.files || {};
      const mainImage = files.main_image?.[0];
      const highlightMedia = files.highlight_media?.[0];
      const productImagesFiles = files.product_images || [];

      if (!mainImage) {

        return res.status(400).json({success:false, message: "Main image is required" });
      }

      if (!highlightMedia) {
        return res.status(400).json({success:false, message: "Highlight media is required" });
      }
      if (productImagesFiles.length === 0) {
        return res
          .status(400)
          .json({success:false, message: "At least one product image is required" });
      }

      const mainImagePath = `product/main_image/${mainImage.filename}`;
      const highlightMediaPath = `product/highlight_media/${highlightMedia.filename}`;
      const productImages = productImagesFiles.map(
        (file) => `product/product_images/${file.filename}`
      );

      if (!mainImagePath) {
        return res.status(400).json({success:false, message: "Main image is required" });
      }
      if (!highlightMediaPath) {
        return res.status(400).json({success:false, message: "Highlight media is required" });
      }
      if (productImages.length === 0) {
        return res
          .status(400)
          .json({ success:false,message: "At least one product image is required" });
      }

      const featuresSubTitles = req.body.features_sub_titles
        ? typeof req.body.features_sub_titles === "string"
          ? JSON.parse(req.body.features_sub_titles)
          : req.body.features_sub_titles
        : [];
      const availability = req.body.availability
        ? typeof req.body.availability === "string"
          ? JSON.parse(req.body.availability)
          : req.body.availability
        : [];
      const ctaButtons = req.body.cta_buttons
        ? typeof req.body.cta_buttons === "string"
          ? JSON.parse(req.body.cta_buttons)
          : req.body.cta_buttons
        : [];

      if (!req.body.title) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      } else if (!req.body.sub_title) {
        return res
          .status(400)
          .json({ success: false, message: "Sub title is required" });
      } else if (!req.body.description) {
        return res
          .status(400)
          .json({ success: false, message: "Description is required" });
      } else if (!req.body.features_title) {
        return res
          .status(400)
          .json({ success: false, message: "Features title is required" });
      } else if (!featuresSubTitles) {
        return res
          .status(400)
          .json({ success: false, message: "Sub title is required" });
      } else if (!req.body.ingredients) {
        return res
          .status(400)
          .json({ success: false, message: "Features sub title is required" });
      } else if (!availability) {
        return res.status(400).json({
          success: false,
          message: "Availability details is required",
        });
      } else if (!ctaButtons) {
        return res
          .status(400)
          .json({ success: false, message: "Button details is required" });
      } else if (!req.body.product_text_color) {
        return res
          .status(400)
          .json({ success: false, message: "Text color is required" });
      }

      const thumbnailDir = path.join(
        process.cwd(),
        "public",
        "product",
        "product_thumbnail_images"
      );
      ensureDirExists(thumbnailDir);
      const thumbnailImages = [];

      for (const imageFile of productImagesFiles) {
        const absoluteProductImagePath = imageFile.path;
        const thumbnailFilename = imageFile.filename;
        const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

        try {
          await sharp(absoluteProductImagePath)
            .resize(50, 50)
            .jpeg({ quality: 70 })
            .toFile(thumbnailPath);
          thumbnailImages.push(
            `/product/product_thumbnail_images/${thumbnailFilename}`
          );
        } catch (err) {
          console.error("Error processing product image thumbnail:", err);
          return res
            .status(500)
            .json({success:false, message: "Error processing thumbnail" });
        }
      }

      if (thumbnailImages.length === 0) {
        return res
          .status(400)
          .json({success:false, message: "At least one thumbnail image is required" });
      }

      const productData = {
        id: nextProductId,
        sort_id: sort_id,
        title: req.body.title,
        sub_title: req.body.sub_title,
        description: req.body.description,
        features_title: req.body.features_title,
        features_sub_titles: featuresSubTitles,
        ingredients: req.body.ingredients,
        availability: availability,
        cta_buttons: ctaButtons,
        main_image: mainImagePath,
        highlight_media: highlightMediaPath,
        product_images: productImages,
        thumbnail_images: thumbnailImages,
        product_text_color: req.body.product_text_color,
      };

      const product = new ProductDataModel(productData);
      await product.save();

      res.status(201).json({
        success:true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success:false,
        message: "Error creating product",
        error: error.message,
      });
    }
  });
};

const updateProduct = async (req, res) => {
  upload(req, res, async function (error) {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({ error: error.message });
    } else if (error) {
      return res.status(500).json({ error: error.message });
    }
    try {
      const productId = req.params.productId;
      const product = await ProductDataModel.findOne({
        _id: productId,
      });
      if (!product) {
        return res.status(404).json({success:false, message: "Product not found" });
      }

      const files = req.files || {};
      const mainImage = files.main_image?.[0];
      const highlightMedia = files.highlight_media?.[0];
      const productImagesFiles = files.product_images || [];

      if (productImagesFiles.length > 0 && productImagesFiles.length === 0) {
        return res
          .status(400)
          .json({success:false, message: "At least one product image is required" });
      }

      const mainImagePath = mainImage
        ? `product/main_image/${mainImage.filename}`
        : product.main_image;
      const highlightMediaPath = highlightMedia
        ? `product/highlight_media/${highlightMedia.filename}`
        : product.highlight_media;
      // const productImages =
      //   productImagesFiles.length > 0
      //     ? productImagesFiles.map(
      //         (file) => `product/product_images/${file.filename}`
      //       )
      //     : product.product_images;

      let existingImages = req.body.existing_images
        ? typeof req.body.existing_images === "string"
          ? JSON.parse(req.body.existing_images)
          : req.body.existing_images
        : [];
      existingImages = Array.isArray(existingImages) ? existingImages : [];
      const updatedProductImages = product.product_images.filter((img) =>
        existingImages.includes(img)
      );

      // let thumbnailImages = product.thumbnail_images;
      if (productImagesFiles.length > 0) {
        const newImagePaths = productImagesFiles.map(
          (file) => `product/product_images/${file.filename}`
        );
        updatedProductImages.push(...newImagePaths);
        const thumbnailDir = path.join(
          process.cwd(),
          "public",
          "product",
          "product_thumbnail_images"
        );
        ensureDirExists(thumbnailDir);
        const newThumbnailImages = [];

        for (const imageFile of productImagesFiles) {
          const absoluteProductImagePath = imageFile.path;
          const thumbnailFilename = imageFile.filename;
          const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

          try {
            await sharp(absoluteProductImagePath)
              .resize(50, 50)
              .jpeg({ quality: 70 })
              .toFile(thumbnailPath);
            newThumbnailImages.push(
              `product/product_thumbnail_images/${thumbnailFilename}`
            );
          } catch (err) {
            console.error("Error processing product image thumbnail:", err);
            return res
              .status(500)
              .json({success:false, message: "Error processing thumbnail" });
          }
        }

        const existingThumbnailImages = product.thumbnail_images.filter(
          (thumb) =>
            updatedProductImages.includes(
              `product/product_images/${path.basename(thumb)}`
            )
        );
        product.thumbnail_images = [
          ...existingThumbnailImages,
          ...newThumbnailImages,
        ];
      }

      const featuresSubTitles = req.body.features_sub_titles
        ? typeof req.body.features_sub_titles === "string"
          ? JSON.parse(req.body.features_sub_titles)
          : req.body.features_sub_titles
        : product.features_sub_titles;
      const availability = req.body.availability
        ? typeof req.body.availability === "string"
          ? JSON.parse(req.body.availability)
          : req.body.availability
        : product.availability;
      const ctaButtons = req.body.cta_buttons
        ? typeof req.body.cta_buttons === "string"
          ? JSON.parse(req.body.cta_buttons)
          : req.body.cta_buttons
        : product.cta_buttons;

      product.id = req.body.id !== undefined ? req.body.id : product.id;
      product.sort_id = req.body.sort_id
        ? parseInt(req.body.sort_id)
        : product.sort_id;
      product.title = req.body.title || product.title;
      product.sub_title = req.body.sub_title || product.sub_title;
      product.description = req.body.description || product.description;
      product.features_title =
        req.body.features_title || product.features_title;
      product.features_sub_titles = featuresSubTitles;
      product.ingredients = req.body.ingredients || product.ingredients;
      product.availability = availability;
      product.cta_buttons = ctaButtons;
      product.main_image = mainImagePath;
      product.highlight_media = highlightMediaPath;
      product.product_images = updatedProductImages;
      product.product_text_color =
        req.body.product_text_color || product.product_text_color;

      await product.save();

      res.status(200).json({
        success:true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        success:false,
        message: "Error updating product",
        error: error.message,
      });
    }
  });
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductDataModel.find({}).lean();

    res.status(200).json({
      success:true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({
      success:false,
      message: "Error retrieving products",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success:false, message: "ProductId is required" });
    }

    const product = await ProductDataModel.findById(productId);
    if (!product) {
      return res.status(404).json({success:false, message: "Product not found" });
    }

    product.isDeleted = !product.isDeleted;

    await product.save();

    res.status(200).json({
      success:true,
      message: "Product isDeleted status updated successfully",
      data: {
        _id: product._id,
        isDeleted: product.isDeleted,
      },
    });
  } catch (error) {
    console.error("Error toggling product isDeleted:", error);
    res.status(500).json({
      success:false,
      message: "Error toggling product isDeleted",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductDataModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Error in fetching product by Id` });
  }
};

const addProductsHomepage = async (req, res) => {
  try {
    const { section_title } = req.body;
    let rawData = req.body.data;

    if (rawData) {
      rawData = Array.isArray(rawData) ? rawData : [rawData];
    }
    const transformedData = rawData
      ? rawData.map((id) => ({
          id: String(id),
          isHidden: false,
        }))
      : undefined;
    let homePage = await HomePageDataModel.findOne({
      structure_type: "products",
    });

    if (homePage) {
      return res.status(400).json({
        success:false,
        message: "Cannot add products structure again, instead update it",
      });
    }

    const newHomePage = new HomePageDataModel({
      structure_type: "products",
      content: {
        products: {
          data: transformedData,
          section_title: section_title || "",
        },
      },
    });
    await newHomePage.save();

    res.status(201).json({
      success:true,
      message: "products data added successfully",
      data: newHomePage.content.products,
    });
  } catch (error) {
    console.error("Error adding products data:", error);
    res.status(500).json({
      success:false,
      message: "Error adding products data",
      error: error.message,
    });
  }
};

const updateHomepageProducts = async (req, res) => {
  try {
    const { section_title } = req.body;
    let rawData = req.body.data;

    if (rawData) {
      rawData = Array.isArray(rawData) ? rawData : [rawData];
    }

    const transformedData = rawData
      ? rawData.map((id) => ({
          id: String(id),
          isHidden: false,
        }))
      : undefined;

    const homePage = await HomePageDataModel.findOne({
      structure_type: "products",
    });
    if (!homePage) {
      return res.status(404).json({success:false, message: "Products section not found" });
    }

    if (transformedData !== undefined) {
      homePage.content.products.data = transformedData;
    }
    if (section_title !== undefined) {
      homePage.content.products.section_title = section_title;
    }
    await homePage.save();

    res.status(200).json({
      success:true,
      message: "Products data updated successfully",
      data: homePage.content.products,
    });
  } catch (error) {
    console.error("Error updating products data:", error);
    res.status(500).json({
      success:false,
      message: "Error updating products data",
      error: error.message,
    });
  }
};

const productsVisibility = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({success:false, message: "ProductId is required" });
    }

    const homePage = await HomePageDataModel.findOne({
      structure_type: "products",
    });
    if (!homePage) {
      return res.status(404).json({success:false, message: "products section not found" });
    }

    const itemIndex = homePage.content.products.data.findIndex(
      (item) => item.id === productId
    );

    if (itemIndex < 0) {
      return res.status(404).json({success:false, message: "Products item not found" });
    }

    homePage.content.products.data[itemIndex].isHidden =
      !homePage.content.products.data[itemIndex].isHidden;

    await homePage.save();

    res.status(200).json({
      success:true,
      message: "Products visibility updated successfully",
      data: homePage.content.products.data[itemIndex],
    });
  } catch (error) {
    console.error("Error updating products visibility:", error);
    res.status(500).json({
      success:false,
      message: "Error updating products visibility",
      error: error.message,
    });
  }
};

const getAllHomepageProducts = async (req, res) => {
  try {
    const homePage = await HomePageDataModel.findOne({
      structure_type: "products",
    });
    if (!homePage || !homePage.content.products) {
      return res.status(404).json({success:false, message: "Products section not found" });
    }

    const productIds = homePage.content.products.data.map((item) => item.id);

    if (productIds.length === 0) {
      return res.status(200).json({
        structure: "banner",
        data: [],
        title: homePage.content.products.section_title,
      });
    }

    const products = await ProductDataModel.find({
      _id: { $in: productIds },
    }).select("highlight_media description title product_text_color");

    const data = homePage.content.products.data
      .map((item) => {
        const product = products.find((p) => p._id.toString() === item.id);
        return product
          ? {
              higlight_media: product.highlight_media,
              description: product.description,
              title: product.title,
              product_text_color: product.product_text_color,
              isHidden: item.isHidden,
            }
          : null;
      })
      .filter((item) => item !== null);

    res.status(200).json({
      success:true,
      structure: "products",
      data,
      title: homePage.content.products.section_title,
    });
  } catch (error) {
    console.error("Error retrieving all products data:", error);
    res.status(500).json({
      success:false,
      message: "Error retrieving all products data",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  addProductsHomepage,
  updateHomepageProducts,
  productsVisibility,
  getAllHomepageProducts,
};
