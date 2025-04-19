const {
  PrivacyPolicyModel,
  CopyRightPolicyModel,
  TermsAndConditionsModel,
  HelpModel,
} = require("../model/model");

const addPrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicyExists = await PrivacyPolicyModel.findOne();
    if (privacyPolicyExists) {
      return res.status(400).json({
        success: false,
        message: "Privacy Policy details already exist. Please update instead.",
      });
    }
    let privacyPolicyData = {
      privacy_policy: req.body.privacy_policy,
    };
    let privacyPolicyDetails = new PrivacyPolicyModel(privacyPolicyData);

    await privacyPolicyDetails.save();

    return res.status(201).json({
      success: true,
      message: "Privacy Policy details added successfully.",
      data: privacyPolicyDetails,
    });
  } catch (error) {
    console.log(
      `Error in adding Privacy Policy  page details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in adding Privacy Policy page details: ${error.message}`,
    });
  }
};

const updatePrivacyPolicyDetails = async (req, res) => {
  try {
    const privacyPolicyData = await PrivacyPolicyModel.findOne();
    if (!privacyPolicyData) {
      return res.status(404).json({
        success: false,
        message: "Privacy Policy not found.",
      });
    }

    const updatedFields = { ...privacyPolicyData.toObject() };

    for (const key in req.body) {
      if (req.body[key] && req.body[key].trim() !== "") {
        updatedFields[key] = req.body[key];
      }
    }

    const updatedData = await PrivacyPolicyModel.findByIdAndUpdate(
      privacyPolicyData._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "privacy Policy details updated successfully.",
      data: updatedData,
    });
  } catch (error) {
    console.log(
      `Error in updating privacy Policy page details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in updating privacy Policy page details: ${error.message}`,
    });
  }
};

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

const addCopyRightPolicy = async (req, res) => {
  try {
    const copyRightPolicyExists = await CopyRightPolicyModel.findOne();
    if (copyRightPolicyExists) {
      return res.status(400).json({
        success: false,
        message:
          "Copy Right Policy details already exist. Please update instead.",
      });
    }
    let copyRightPolicyData = {
      copy_right_policy: req.body.copy_right_policy,
    };
    let copyRightPolicyDetails = new CopyRightPolicyModel(copyRightPolicyData);

    await copyRightPolicyDetails.save();

    return res.status(201).json({
      success: true,
      message: "Copy Right Policy details added successfully.",
      data: copyRightPolicyDetails,
    });
  } catch (error) {
    console.log(
      `Error in adding Copy Right Policy page details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in adding Copy Right Policy page details: ${error.message}`,
    });
  }
};

const updateCopyRightPolicyDetails = async (req, res) => {
  try {
    const copyRightPolicyData = await CopyRightPolicyModel.findOne();
    if (!copyRightPolicyData) {
      return res.status(404).json({
        success: false,
        message: "Copy Right Policy not found.",
      });
    }

    const updatedFields = { ...copyRightPolicyData.toObject() };

    for (const key in req.body) {
      if (req.body[key] && req.body[key].trim() !== "") {
        updatedFields[key] = req.body[key];
      }
    }

    const updatedData = await CopyRightPolicyModel.findByIdAndUpdate(
      copyRightPolicyData._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Copy Right Policy details updated successfully.",
      data: updatedData,
    });
  } catch (error) {
    console.log(
      `Error in updating Copy Right Policy page details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in updating Copy Right Policy page details: ${error.message}`,
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

const addTermsAndConditions = async (req, res) => {
  try {
    const termsAndConditionsExists = await TermsAndConditionsModel.findOne();
    if (termsAndConditionsExists) {
      return res.status(400).json({
        success: false,
        message: "Terms And Conditions already exist. Please update instead.",
      });
    }
    let termsAndConditionsData = {
      terms_and_condition: req.body.terms_and_condition,
    };
    let termsAndConditionDetails = new TermsAndConditionsModel(
      termsAndConditionsData
    );

    await termsAndConditionDetails.save();

    return res.status(201).json({
      success: true,
      message: "Terms And ConditionDetails added successfully.",
      data: termsAndConditionDetails,
    });
  } catch (error) {
    console.log(
      `Error in adding Terms And Condition page details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in adding Terms And Condition page details: ${error.message}`,
    });
  }
};

const updateTermsAndCOnditionDetails = async (req, res) => {
  try {
    const termsAndConditionData = await TermsAndConditionsModel.findOne();
    if (!termsAndConditionData) {
      return res.status(404).json({
        success: false,
        message: "Terms And Condition Data not found.",
      });
    }

    const updatedFields = { ...termsAndConditionData.toObject() };

    for (const key in req.body) {
      if (req.body[key] && req.body[key].trim() !== "") {
        updatedFields[key] = req.body[key];
      }
    }

    const updatedData = await TermsAndConditionsModel.findByIdAndUpdate(
      termsAndConditionData._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Terms And Condition details updated successfully.",
      data: updatedData,
    });
  } catch (error) {
    console.log(
      `Error in updating Terms And Condition page details: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: `Error in updating Terms And Condition Data page details: ${error.message}`,
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

const addHelp = async (req, res) => {
  try {
    const helpExists = await HelpModel.findOne();
    if (helpExists) {
      return res.status(400).json({
        success: false,
        message: "Help details already exist. Please update instead.",
      });
    }
    let helpData = {
      help: req.body.help,
    };
    let helpDetails = new HelpModel(helpData);

    await helpDetails.save();

    return res.status(201).json({
      success: true,
      message: "Help details added successfully.",
      data: helpDetails,
    });
  } catch (error) {
    console.log(`Error in adding Help page details: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error in adding Help page details: ${error.message}`,
    });
  }
};

const updateHelpDetails = async (req, res) => {
  try {
    const helpData = await HelpModel.findOne();
    if (!helpData) {
      return res.status(404).json({
        success: false,
        message: "Help Data not found.",
      });
    }

    const updatedFields = { ...helpData.toObject() };

    for (const key in req.body) {
      if (req.body[key] && req.body[key].trim() !== "") {
        updatedFields[key] = req.body[key];
      }
    }

    const updatedData = await HelpModel.findByIdAndUpdate(
      helpData._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Help details updated successfully.",
      data: updatedData,
    });
  } catch (error) {
    console.log(`Error in updating Help page details: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error in updating Help page details: ${error.message}`,
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
  addPrivacyPolicy,
  updatePrivacyPolicyDetails,
  getPrivacyPolicy,

  addCopyRightPolicy,
  updateCopyRightPolicyDetails,
  getCopyRightPolicy,

  addTermsAndConditions,
  updateTermsAndCOnditionDetails,
  getTermsAndConditions,

  addHelp,
  updateHelpDetails,
  getHelp,
};
