require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");


const connect = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_DB_URL,
      // "mongodb://localhost:27017/Assignment",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("mongoDb connected Successfully.");
    if (conn) {
      const isCheck = await UserModel.findOne({
        role: "admin",
      }).countDocuments();
      console.log("isCheck", isCheck);
      if (isCheck < 1) {
        console.log("admin not present.");
      }
      if (isCheck === 0) {
        const newPassword = bcrypt.hash(process.env.Admin_Password, 10);
        const createAdmin = new UserModel({
          email: "vinayak8@gmail.com",
          password: newPassword,
          role: "admin",
          approved: true,
        });
        await createAdmin.save();
        // const token = jwt.sign(
        //   {
        //     exp: Math.floor(Date.now() / 1000) + 60 * 60,
        //     data: createAdmin,
        //   },
        //   "vinayak"
        // );
        console.log("Admin created Successfully.");
      } else {
        console.log("Admin Present there.");
      }
    }
    return conn;
  } catch (error) {
    console.log("MongoDb error", error);
  }
};

module.exports = connect;
