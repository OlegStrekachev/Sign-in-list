const Kid = require("./../models/newKidModel");
const path = require('path');

const sendMail = require(path.join(__dirname, '../nodemailer/nodemailer.js'));

exports.sendMail = async (req, res) => {
  try {
    // Call the sendMail function
    await sendMail();
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).send("Failed to send email");
  }
};

exports.postNewKid = async (req, res) => {
  console.log(req.method);
  console.log("HELLO", req.body);
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newKid = await Kid.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        Kid: newKid,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateKidInfo = async (req, res) => {
  console.log(req);
  try {
    console.log(req.body);

    const newKidInfo = await Kid.findOneAndUpdate(
      { _id: req.query.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        newKidInfo: newKidInfo,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateKidInfo = async (req, res) => {
  try {
    const kidId = req.query.id;
    const updateFields = {};

    // Iterate over each field in the request body
    for (const key in req.body) {
      // Only update non-empty fields
      if (req.body[key]) {
        updateFields[key] = req.body[key];
      }
    }

    const newKidInfo = await Kid.findOneAndUpdate(
      { _id: kidId },
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        newKidInfo: newKidInfo,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteKidInfo = async (req, res) => {
  console.log(req);
  try {
    await Kid.findOneAndDelete(req.query.id);

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getFullList = async (req, res) => {
  try {
    console.log(req.query);

    const Kids = await Kid.find();

    res.status(200).json({
      status: "success",
      results: Kid.length,
      data: {
        Kids,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
