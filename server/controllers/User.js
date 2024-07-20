const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CompanyDetail = require("../models/CompanyDetail");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).send("All the fields are required");
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.send("User Created Successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send("All the fields are required");
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid Credentials");
    }

    const payload = {
      user: {
        _id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, user: user?._id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.user._id).select("-password");
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateProfile = async (req, res) => {
  const { bio, website, location, name } = req.body;

  try {
    let user = await User.findById(req.user.user._id);
    if (!user) {
      return res.status(400).send("User Not Found");
    }
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.website = website || user.website;
    user.location = location || user.location;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.createCompany = async (req, res) => {
  const {
    companyName,
    about,
    size,
    totalFundingAmount,
    investors,
    fundingRounds,
  } = req.body;
  // console.log("User id", req.user.user._id);
  try {
    if (
      !companyName ||
      !about ||
      !size ||
      !totalFundingAmount ||
      !investors ||
      !fundingRounds
    ) {
      return res.status(400).send("All the fields are required");
    }

    const company = new CompanyDetail({
      owner: req.user.user._id,
      companyName,
      about,
      size,
      totalFundingAmount,
      investors,
      fundingRounds,
    });
    await company.save();
    res.status(201).send("Company data uploaded Successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await CompanyDetail.find({
      owner: req.user.user._id,
    }).sort({ date: -1 });

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
