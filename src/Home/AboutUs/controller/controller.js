const { HomePageDataModel } = require("../../model/model");

const getAboutUs = async (req, res) => {
  try {
    const data = await HomePageDataModel.findOne({
      structure_type: "about_us",
    }).lean()

    if (!data || !data.content.about_us) {
      return res
        .status(404)
        .json({ success: false, message: "About Us section not found" });
    }

    const aboutUs = data.content.about_us;
    const filteredSocialMediaLinks = aboutUs.social_media_links
    .filter(link => !link.isHidden)
    .map(({ platform, icon, link }) => ({ platform, icon, link }));
    
    const responseData = {
      section_title: aboutUs.section_title,
      about_us_image: aboutUs.about_us_image,
      description: aboutUs.description,
      social_media_links: filteredSocialMediaLinks,
    };

    res.status(200).json({
      success: true,
      data: responseData,
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
module.exports = {
  getAboutUs,
};
