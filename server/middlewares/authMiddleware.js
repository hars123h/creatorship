const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // console.log("eee", token);

  if (!token) {
    console.log("No Token");
    return res.status(401).json({ message: "No token provided" });
  }

  // console.log("TOKEN", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Decode err", err);
      return res.status(401).json({ message: "Invalid token" });
    }
    // console.log("Decode", decoded);
    req.user = decoded;
    next();
  });
};

exports.businessOwnerMiddleware = (req, res, next) => {
  User.findById({ _id: req.user.user._id })
    .exec()
    .then((user) => {
      if (user.role !== "business") {
        return res.status(401).json({
          error: "Business resource. Access denied.",
        });
      }
      req.profile = user;
      next();
    })
    .catch((error) => {
      return res.status(401).json({
        error: "User not found",
      });
    });
};
