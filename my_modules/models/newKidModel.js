const mongoose = require("mongoose");

const KidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
  },
  days: {
    type: Array
  }
});

const Kid = mongoose.model("Kids", KidSchema);

module.exports = Kid;
