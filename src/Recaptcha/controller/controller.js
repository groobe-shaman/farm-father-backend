const axios = require("axios");
require("dotenv").config();

const verifyRecaptcha = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, messgae: "No token is provided" });
    }

    const googleResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );
    const { success} = googleResponse.data;
    
    if (!success) {
      return res
        .status(400)
        .json({ success: false, message: "reCAPTCHA verification failed" });
    }

    return res
      .status(200)
      .json({ success: true, message: "reCAPTCHA verification success" });
  } catch (error) {
    console.error(`reCAPTCHA verification error:${error}`);
    return res
      .status(500)
      .json({
        success: false,
        message: `reCAPTCHA verification error:${error}`,
      });
  }
};

module.exports = {
  verifyRecaptcha,
};
