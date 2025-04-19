const {
  PrivacyPolicyModel,
  CopyRightPolicyModel,
  TermsAndConditionsModel,
  HelpModel,
} = require("../../../Admin/Home/Policies/model/model");

const getPrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicyData = await PrivacyPolicyModel.findOne();
    if (!privacyPolicyData) {
      return res.status(404).json({
        success: false,
        message: " privacyPolicyData not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: privacyPolicyData,
    });
  } catch (error) {
    console.log(
      `Error in fetching  privacyPolicyData details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in fetching  privacyPolicyData page details: ${error.message}`,
    });
  }
};

const getCopyRightPolicy = async (req, res) => {
  try {
    const copyRightPolicyData = await CopyRightPolicyModel.findOne();
    if (!copyRightPolicyData) {
      return res.status(404).json({
        success: false,
        message: " copyRightPolicyData not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: copyRightPolicyData,
    });
  } catch (error) {
    console.log(
      `Error in fetching  copyRightPolicyData details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in fetching  copyRightPolicyData page details: ${error.message}`,
    });
  }
};

const getTermsAndConditions = async (req, res) => {
  try {
    const termsAndConditionsData = await TermsAndConditionsModel.findOne();
    if (!termsAndConditionsData) {
      return res.status(404).json({
        success: false,
        message: " termsAndConditionsData not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: termsAndConditionsData,
    });
  } catch (error) {
    console.log(
      `Error in fetching  termsAndConditionsData details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in fetching  termsAndConditionsData page details: ${error.message}`,
    });
  }
};

const getHelp = async (req, res) => {
  try {
    const helpData = await HelpModel.findOne();
    if (!helpData) {
      return res.status(404).json({
        success: false,
        message: " helpData not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: helpData,
    });
  } catch (error) {
    console.log(`Error in fetching  helpData details: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error in fetching  helpData page details: ${error.message}`,
    });
  }
};

module.exports = {
  getPrivacyPolicy,
  getCopyRightPolicy,
  getTermsAndConditions,
  getHelp,
};
