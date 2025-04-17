const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { AdminDataModel } = require("../model/model");
const { decryptData } = require("../../../../utils/cipher");



const verifySuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const decodedToken = jwt.verify(token, "admin_key");
    const { encryptedData, iv } = decodedToken;
    const decryptedPayload = decryptData(encryptedData, iv);
    
    const email_id = decryptedPayload.email_id;

    const admin = await AdminDataModel.findOne({ email_id });
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (decryptedPayload.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Access denied: Not a super admin" });
    }

    req.user = { email: decodedToken.email, role: decodedToken.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifySuperAdmin };
