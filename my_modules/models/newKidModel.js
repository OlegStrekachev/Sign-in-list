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

// mongoose.model(<Collectionname>, <CollectionSchema>)
// The mongoose.model() function of the mongoose module is used to create a collection of a particular database of MongoDB.

const Kid = mongoose.model("Kids", KidSchema);

module.exports = Kid;

  // const newKid = new Kid({
  //   name: "Andy Buggins",
  //   age: 4,
  //   days: ["Mo", "Fr"],
  // });

  // newKid
  //   .save()
  //   .then((doc) => {
  //     console.log(doc);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
