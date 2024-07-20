const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  website: { type: String },
  location: { type: String },
  role: {
    type: String,
    enum: ["business", "creator"],
    default: "creator",
  },
  partnerships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Partnership" }],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
