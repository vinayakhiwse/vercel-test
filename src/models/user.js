const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "vendor"], default: "vendor" },
  approved: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = model("user", UserSchema);
module.exports = UserModel;
