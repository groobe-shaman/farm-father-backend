// const IV = crypto.randomBytes(16);
const crypto = require("crypto");
const dotenv=require('dotenv')
dotenv.config({})


const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || "a_secure_32_byte_key____________").trim();
  
/// method to encrypt a data
const encryptData = (data) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
};

const decryptData = (encrypted, iv) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};



module.exports={
    encryptData,
    decryptData,
}