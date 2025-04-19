const mongoose=require('mongoose')

const PrivacyPolicySchema = mongoose.Schema(
  {
    privacy_policy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const CopyRightPolicySchema = mongoose.Schema(
    {
      copy_right_policy: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );
  const TermsAndConditionsSchema = mongoose.Schema(
    {
      terms_and_condition: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );
  const HelpSchema = mongoose.Schema(
    {
      help: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );
const PrivacyPolicyModel = new mongoose.model("PrivacyPolicy",PrivacyPolicySchema);
const CopyRightPolicyModel = new mongoose.model("COpyRightPolicy",CopyRightPolicySchema);
const TermsAndConditionsModel = new mongoose.model("TermsAndConditions",TermsAndConditionsSchema);
const HelpModel = new mongoose.model("Help",HelpSchema);

module.exports = {
    PrivacyPolicyModel,
    CopyRightPolicyModel,
    TermsAndConditionsModel,
    HelpModel
};
