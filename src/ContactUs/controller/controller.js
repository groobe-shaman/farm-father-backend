const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ContactUsDataModel = require("../model/model");

dotenv.config({});

const sendContactUsEmail = async (email_id, name) => {
  try {
    const templatePath = path.join(__dirname, "../MailHtmlContent/mail.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
   
    htmlTemplate = htmlTemplate
      .replace("${user_name}", name)
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: email_id,
      subject: "Thank You for Connecting with Farm Father!",
      html: htmlTemplate,
    });

    console.log("Email sent successfully to:", email_id);
  } catch (error) {
    console.error("Error in sending contact email:", error.message);
    throw error;
  }
};

const addContactUs = async (req, res) => {
  try {
    const { name, email_id, mobile_number, message } = req.body;

    if (!name || !email_id || !mobile_number) {
      return res.status(400).json({
        success: false,
        message: "Name, Email ID, and Mobile number are required",
      });
    }

    const addData = new ContactUsDataModel({
      name,
      mobile_number,
      email_id,
      message,
    });

    await addData.save();
    await sendContactUsEmail(email_id, name);

    return res.status(200).json({
      success: true,
      message: "Contact us form submitted and email sent successfully",
    });
  } catch (error) {
    console.error("Error in submitting contact form:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addContactUs,
};
