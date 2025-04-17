const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ContactUsDataModel = require("../model/model");

dotenv.config({});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });
  
  const sendContactUsMail = async (email_id) => {
    const mailOptions = {
      from: "gouravinsaan@gmail.com",
      to: email_id,
      subject: "OTP for change password",
      html: `
          <h1>Thank you for submitting form with Farm Father,</h1>
          <p>Hi,</p>
          <p>We will connect with you soon.</p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

const addContactUs = async (req, res) => {
    try {
      const { name, email_id, mobile_number,message } = req.body;
  
      const addData = new ContactUsDataModel({
        name: name,
        mobile_number:  mobile_number,
        email_id: email_id,
        message: message,
      });
    //   await sendContactUsMail(email_id)
      let sendData = await addData.save();
  
      return res.status(200).json({
        success: true,
        message: "Contact us form submitted successfully",
        data: sendData,
      });
    } catch (error) {
      console.log("Error in submitting contact us form", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  module.exports={
    addContactUs
  }