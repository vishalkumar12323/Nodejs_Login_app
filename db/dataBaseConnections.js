const mongoose = require("mongoose");

const connectDB = (uri) => {
  return mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connection successfull");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connectDB;
