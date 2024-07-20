const User = require("../models/User");
const Partnership = require("../models/Partnership");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const message = new Message({
      sender: req.user.user._id,
      receiver: receiverId,
      content,
    });
    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.user._id },
      ],
    }).sort({ date: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
