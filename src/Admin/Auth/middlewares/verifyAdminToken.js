const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { AdminDataModel } = require("../model/model");
const { decryptData } = require("../../../../utils/cipher");



const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decodedToken = jwt.verify(token, "admin_key");
    const { encryptedData, iv } = decodedToken;
    const decryptedPayload = decryptData(encryptedData, iv);
    const email_id = decryptedPayload.email_id;

    const admin = await AdminDataModel.findOne({ email_id });
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = { verifyAdminToken };
