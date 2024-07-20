const CompanyDetail = require("../models/CompanyDetail");

exports.getAllCompany = async (req, res) => {
  try {
    const company = await CompanyDetail.find().sort({ date: -1 });

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCompanyDetail = async (req, res) => {
  try {
    const companyDetail = await CompanyDetail.findById(req.params.id);
    if (!companyDetail) {
      return res.status(400).send("Company Not Found");
    }
    res.json(companyDetail);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
