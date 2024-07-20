const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  about: { type: String },
  size: { type: String },
  totalFundingAmount: { type: Number, default:0 },
  investors: { type: Number },
  fundingRounds:{type:Number},
  companyName:{type:String},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", CompanySchema);
