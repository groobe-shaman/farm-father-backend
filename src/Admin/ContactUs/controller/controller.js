const ContactUsDataModel = require("../../../ContactUs/model/model");


const getAllContactUs = async (req, res) => {
    try {
      const data = await ContactUsDataModel.find();
  
      return res.status(200).json({
        success: true,
        message: "Contact us details fetched successfully",
        data: data,
      });
    } catch (error) {
      console.log("Error in fetching the Contact us details", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
module.exports = {
    getAllContactUs,
  };
  