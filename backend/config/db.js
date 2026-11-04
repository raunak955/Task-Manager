const mongoose = require("mongoose");

const connetDB = async () =>{
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("mongodb connected sucessfully");

  } catch (err) {
    console.log("MongoDb error", err.message);
    process.exit(1);
  }
};

module.exports = connetDB;