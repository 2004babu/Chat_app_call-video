const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    uid: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // password: { type: String, required: true, select: false },
    ProfilePic: { type: String },
    friendlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequestlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    isNewUser: { type: Boolean, default: false },
    privateAccount: { type: Boolean, default: false },
    lastChat: [
      {
        userId: { type:String },
        time: Date,
      },
    ],
  },
  { timeStamp: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTtoken = async () => {
  return await JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
    algorithm: "ES256",
  });
};

userSchema.methods.getResetToken = async function () {
  const token = await crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  console.log("token  : ", token, "rese: ", this.resetPasswordToken);

  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
  return token;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
