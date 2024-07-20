const User = require("../models/User");
const Partnership = require("../models/Partnership");

exports.createPartnership = async (req, res) => {
  const { companyName, businessId, equity } = req.body;
  try {
    if (!equity) {
      return res.status(400).send("Equity should not be empty");
    }
    if (req?.user?.user?._id == businessId) {
      return res
        .status(400)
        .send("You cannot Request Partnership in your company");
    }
    const findPartnership = await Partnership.find({creator: req.user.user._id});
    if(findPartnership) {
      return res.status(400).send("You have Already Sent Request")
    }
    const partnership = new Partnership({
      creator: req?.user?.user?._id,
      business: businessId,
      equity,
      companyName,
    });
    await partnership.save();

    const creator = await User.findById(req?.user?.user?._id);
    const business = await User.findById(businessId);

    creator.partnerships.push(partnership._id);
    business.partnerships.push(partnership._id);

    await creator.save();
    await business.save();

    res.json(partnership);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPartnerShip = async (req, res) => {
  try {
    const partnerships = await Partnership.find({
      $or: [
        { creator: req?.user?.user?._id },
        { business: req?.user?.user?._id },
      ],
    })
      .populate("creator")
      .populate("business");

    res.json(partnerships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const partnership = await Partnership.findById(req.params.id);

    if (!partnership) {
      return res.status(404).json({ msg: "Partnership not found" });
    }

    partnership.status = status;
    await partnership.save();

    res.json(partnership);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
