const crypto = require("crypto");

const jwt = require('jsonwebtoken');
const { AdminDataModel } = require("../model/model");
const { decryptData } = require("../../../../utils/cipher");




const verifyOtpToken = async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'No token found' });
      }
      
      const decodedToken = jwt.verify(token, "user_verify_otp");
      const { encryptedData, iv } = decodedToken;
      const decryptedPayload = decryptData(encryptedData, iv);

      const admin_email_id = decryptedPayload.email_id;
      
      const admin= await AdminDataModel.findOne({email_id:admin_email_id});
      if (!admin) {
        return res.status(401).json({ message: "Invalid token" });
      }
      
      req.user = {
        adminId: admin._id,
        name:admin.name,
        email_id: admin.email_id
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };
  
  module.exports = { verifyOtpToken };