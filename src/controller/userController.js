const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("ischeck,", email, password);
    if (!email && !password) {
      return res.status(403).json({ msg: "all the field required." });
    }

    const isAdminPresent = await UserModel.findOne({ role: "admin" });
    const isCheck = await UserModel.findOne({ email });
    if (!isCheck) {
      return res.status(405).json({ msg: "User not Found." });
    }
    if (isCheck.approved && isAdminPresent) {
      const isCheckedPassowrd = await bcrypt.compare(
        password,
        isCheck.password
      );
      if (isCheckedPassowrd) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: isCheck,
          },
         process.env.JWT_SECRET
        );
        console.log("token", token);
        if (token) {
          return res
            .status(200)
            .json({ msg: "User Login Successfully.", token: token });
        }
      }
    } else {
      return res
        .status(500)
        .json({ msg: "You don't have the access of login wait for acess." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

const SingUpUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const saltRounds = 10;
    const ischeck = await UserModel.findOne({ email });

    if (!ischeck) {
      const newPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new UserModel({
        name,
        email,
        password: newPassword,
      });
      await newUser.save();
      return res
        .status(200)
        .json({ msg: "User SingUp Successfully.", user: newUser });
    }
    return res.status(500).json({ msg: "You already sign up please login." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

const GetUser = async (req, res) => {
  try {
    const isCheck = await UserModel.find();
    if (isCheck.length === 0) {
      return res.status(404).json({ msg: "User not found." });
    }
    return res
      .status(201)
      .json({ msg: "user Fetched Successfully.", data: isCheck });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

const AccessUser = async (req, res) => {
  const { id } = req.params;
  try {
    const isCheck = await UserModel.findById({ _id: id });

    if (!isCheck) {
      return res.status(401).json({ msg: "user not present." });
    }

    const updated = await UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: { approved: true } },
      { new: true }
    );

    if (updated) {
      return res.status(200).json({ msg: "User Approved by Admin." });
    }
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

module.exports = { LoginUser, SingUpUser, GetUser, AccessUser };
