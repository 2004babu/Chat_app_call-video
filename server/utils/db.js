const mongoose = require("mongoose");

const db = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Connect Succesfully!!")
    }).catch((error)=>{console.log(error)});
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
