const path = require("path");

// 3rd party modules
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const expressApp = express();
expressApp.use(express.json());

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const router = require("./my_modules/router/router.js");

// Middleware

expressApp.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

expressApp.use(express.static(path.join(process.env.ROOT_FOLDER, "public")));

expressApp.get("/kidstable", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "kidstable.html"));
});

expressApp.use("/api", router);

module.exports = expressApp;
