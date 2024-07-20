// server.js
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const User = require("./routes/User");
const PartnerShip = require("./routes/Partnership");
const Company = require("./routes/Company");
const Message = require("./routes/Message");


// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/creatorship", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity, adjust in production
    methods: ['GET', 'POST']
  }
});

// Routes
app.get("/", (req, res) => res.send("API Running"));
app.use("/api", User);
app.use("/api", PartnerShip);
app.use("/api", Company);
app.use("/api", Message);


io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Listen on port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
