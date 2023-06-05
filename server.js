
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT;

dotenv.config({ path: "config.env" });

const app = require("./app");

console.log(process.env)

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});



