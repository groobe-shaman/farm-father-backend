const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({});

const { AdminDataModel } = require("../model/model");
const { encryptData } = require("../../../../utils/cipher");

const registerAdmin = async (req, res) => {
  let { email_id, password, role, pages, name, mobile } = req.body;
  try {
    if (!email_id || !password || !role || !name || !mobile) {
      return res.status(400).json({
        success: false,
        message:
          "Email ,name, password ,mobile and role is needed for registering",
      });
    }
    const existingAdmin = await AdminDataModel.findOne({ email_id });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const admin = new AdminDataModel({
      email_id,
      name,
      mobile,
      password,
      role,
      pages: pages || [],
    });

    await admin.save();

    return res.status(201).json({
      message: "Adminvregistered successfully",
      email: admin.email,
      role: admin.role,
      pages: admin.pages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Error in registering admin:${error.message}`,
    });
  }
};

const loginAdmin = async (req, res) => {
  const { email_id, password } = req.body;

  try {
    const admin = await AdminDataModel.findOne({ email_id });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    if (!admin.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Admin is not active, Cannot login" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({success:false, message: "Invalid password" });
    }

    const { iv, encryptedData } = encryptData({
      email_id: admin.email_id,
      role: admin.role,
    });

    const token = jwt.sign({ iv, encryptedData }, "admin_key", {
      expiresIn:"365d",
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      email: admin.email_id,
      role: admin.role,
      token: token,
      pages:admin.pages
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: `Error in admin login:${error.message}`,
      });
  }
};

const getAdmins = async (req, res) => {
  try {
    let admins = await AdminDataModel.find({}).select("-password");
    return res.status(200).json({
      success: true,
      message: "Fetched admins successfully",
      admins: admins,
    });
  } catch (error) {
    console.log("Error in fetching the admins: ", error.message);
    return res.status(500).json({
      success: false,
      message: `Error in fetching the admins: ${error.message}`,
    });
  }
};

const updateAdminPages = async (req, res) => {
  const { email_id, pages } = req.body;

  try {
    if (!email_id || !pages) {
      return res.status(400).json({
        success: false,
        message: "Email and pages are required for updating.",
      });
    }

    if (!Array.isArray(pages)) {
      return res.status(400).json({
        success: false,
        message: "Pages must be an array of strings.",
      });
    }

    const admin = await AdminDataModel.findOne({ email_id });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: `No admin found with email: ${email_id}`,
      });
    }

    admin.pages = pages;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Pages updated successfully.",
      admin: admin.name,
      updatedPages: admin.pages,
    });
  } catch (error) {
    console.error("Error updating admin pages:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error updating pages: ${error.message}`,
    });
  }
};

const activateOrDeactivateAdmin = async (req, res) => {
  try {
    const {adminId} = req.params;
    let admin = await AdminDataModel.findById(adminId);
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not exists" });
    }
    if (!admin.isActive) {
      admin.isActive = true;
      await admin.save();
      return res.status(200).json({
        success: true,
        message: "Activated Admin",
      });
    } else {
      admin.isActive = false;
      await admin.save();
      return res.status(200).json({
        success: true,
        message: "Deactivated Admin",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in activating or deactivating admins:${error.message}`,
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
});

const sendForgotPasswordOtp = async (otp, admin) => {
  const mailOptions = {
    from: "gouravinsaan@gmail.com",
    to: "gouravinsaan@gmail.com",
    subject: "OTP for change password",
    html: `
        <h1>OTP for change password</h1>
        <p>Hi Admin,</p>
        <p>This is the otp to change password:<strong>${otp}</strong> </p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password change otp email sent successfully");
  } catch (error) {
    console.error("Error sending password change otp email:", error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email_id } = req.body;
    let admin = await AdminDataModel.findOne({ email_id: email_id });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin doesn't exist",
      });
    }
    const otp = 808080;
    const newDeviceDetail = {
      otp,
      createdAt: new Date().toLocaleString(),
    };

    admin.deviceDetail = newDeviceDetail;
    await admin.save();
    // await sendForgotPasswordOtp(otp, admin);
    return res.status(200).json({
      success: true,
      message: "Otp has been sent successfully to the email, Now verify otp",
      email_id: admin.email_id,
    });
  } catch (error) {
    console.log("Error in sending forgot-password otp", error.message);
    return res.status(500).json({
      success: false,
      message: `Error in sending forgot-password otp:${error.message}`,
    });
  }
};

const verifyOtpForgotPassword = async (req, res) => {
  try {
    const { otp, email_id } = req.body;
    let admin = await AdminDataModel.findOne({ email_id: email_id });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Check the email" });
    }

    if (!admin.deviceDetail || admin.deviceDetail.length === 0) {
      return res.status(400).json({ success: false, message: "No OTP found " });
    }

    let latestOtpEntry = admin.deviceDetail.reduce((latest, current) => {
      return new Date(latest.createdAt) > new Date(current.createdAt)
        ? latest
        : current;
    });

    if (latestOtpEntry.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const { iv, encryptedData } = encryptData({
      admin_id: admin._id,
      email_id: admin.email_id,
    });

    const token = jwt.sign(
      { iv, encryptedData },
      process.env.JWT_SECRET || "admin_verify_otp",
      { expiresIn: "10h" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      email_id: admin.email_id,
      token: token,
    });
  } catch (error) {
    console.log("Error in verifying OTP", error.message);
    return res.status(500).json({
      success: false,
      message: `Error in verifying otp:${error.message}`,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    let { email_id, password, confirmPassword } = req.body;
    if (!email_id || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all details" });
    }

    if (password != confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords doesn't match" });
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let updateAdmin = await AdminDataModel.findOneAndUpdate(
      { email_id: email_id },
      { $set: { password: password } },
      { new: true }
    );

    if (!updateAdmin) {
      return res.status(400).json({
        success: false,
        message: `No matching admin found for email:${email_id}`,
      });
    }

    const token = jwt.sign(
      { email_id: email_id },
      process.env.JWT_SECRET || "key",
      {
        expiresIn: "10h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin password changed successfully",
    });
  } catch (error) {
    console.log("Error in updating password", error.message);
    return res.status(500).json({
      success: false,
      message: `Error in updating User password:${error.message}`,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdmins,
  updateAdminPages,
  activateOrDeactivateAdmin,
  forgotPassword,
  verifyOtpForgotPassword,
  updatePassword,
};
