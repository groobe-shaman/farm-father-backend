const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdmins,
  updateAdminPages,
  activateOrDeactivateAdmin,
  forgotPassword,
  verifyOtpForgotPassword,
  updatePassword,
} = require("../controller/controller");
const { verifySuperAdmin } = require("../middlewares/verifySuperAdmin");


router.post("/auth/register", verifySuperAdmin ,registerAdmin);
router.post("/auth/login", loginAdmin);
router.get("/auth/getAllAdmins", verifySuperAdmin, getAdmins);
router.post("/auth/update-admin-pages", verifySuperAdmin, updateAdminPages);

router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/verifyOtpForgotPassword",verifyOtpForgotPassword);
router.put("/auth/update-password", updatePassword);

router.post(
  "/auth/activateOrDeactivateAdmin/:adminId",
 verifySuperAdmin,
  activateOrDeactivateAdmin
);

module.exports = router;
