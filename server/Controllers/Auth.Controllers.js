const userModel = require("../models/User.Schema.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail.js");
const setJWT = require("../utils/SetJWT.js");

exports.signup = async (req, res, next) => {
  try {
    // const { userName, password, email, c_password: confirmPassword } = req.body;

    // if (!userName && !password && !email && !confirmPassword) {
    //   return res.status(404).json({ message: "Fil The Value !!" });
    // }
    // console.log(req.body, password === confirmPassword);

    // if (Number(password) !== Number(confirmPassword)) {
    //   return res.status(404).json({ message: "Password Does't match!" });
    // }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!emailRegex.test(email)) {
    //   return res.status(404).json({ message: "is Not Valid Email!" });
    // }

    if (!req.user.uid) {
      return res.status(404).json({ message: "Error In Create User!" });
    }
    const user = await userModel.create(req.user);

    if (!user) {
      return res
        .status(404)
        .json({ user: user, message: "Error In Create User!" });
    }

    setJWT(res, 200, user);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
exports.EmailSignup = async (req, res, next) => {
  try {
    // const { userName, password, email, c_password: confirmPassword } = req.body;

    // if (!userName && !password && !email && !confirmPassword) {
    //   return res.status(404).json({ message: "Fil The Value !!" });
    // }
    // console.log(req.body, password === confirmPassword);

    // if (Number(password) !== Number(confirmPassword)) {
    //   return res.status(404).json({ message: "Password Does't match!" });
    // }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!emailRegex.test(email)) {
    //   return res.status(404).json({ message: "is Not Valid Email!" });
    // }

    console.log(req.user);

    if (!req.user.uid) {
      return res.status(404).json({ message: "Error In Create User!" });
    }
    const user = await userModel.create({
      userName: req.user.email,
      uid: req.user.uid,
      email: req.user.email,
    });

    if (!user) {
      return res
        .status(404)
        .json({ user: user, message: "Error In Create User!" });
    }

    setJWT(res, 200, user);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
exports.gogglesignup = async (req, res, next) => {
  try {
    // const { userName, password, email, c_password: confirmPassword } = req.body;

    // if (!userName && !password && !email && !confirmPassword) {
    //   return res.status(404).json({ message: "Fil The Value !!" });
    // }
    // console.log(req.body, password === confirmPassword);

    // if (Number(password) !== Number(confirmPassword)) {
    //   return res.status(404).json({ message: "Password Does't match!" });
    // }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!emailRegex.test(email)) {
    //   return res.status(404).json({ message: "is Not Valid Email!" });
    // }

    if (!req.user.uid) {
      return res.status(404).json({ message: "Error In Create User!" });
    }
    console.log(req.user);
    const user = await userModel.create({
      userName: req.user.email,
      uid: req.user.uid,
      email: req.user.email,
      ProfilePic: req.user.ProfilePic ?? "",
    });
    if (!user) {
      return res
        .status(404)
        .json({ user: user, message: "Error In Create User!" });
    }

    setJWT(res, 200, user);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.emaillogin = async (req, res, next) => {
  try {
    const user = await userModel.findOne(req.user.uid);
    if (!user) {
      return res.status(404).json({ message: "Error In login User!" });
    }

    setJWT(res, 200, user);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
exports.gogglelogin = async (req, res, next) => {
  try {
    const user = await userModel.findOne(req.user.uid);
    if (!user) {
      return res.status(404).json({ message: "Error In login User!" });
    }

    setJWT(res, 200, user);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.ChangePass = async (req, res, next) => {
  try {
    const { password, email, isChangePass } = req.body;

    if (!password && !email) {
      return res.status(404).json({ message: "Fil The Value !!" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(404).json({ message: "is Not Valid Email!" });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Error In login User!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch && !isChangePass) {
      return res
        .status(200)
        .json({ message: "this is your password do you want to Change!" });
    }

    const reset = await user.getResetToken();

    if (!reset) {
      return res.status(404).json({ message: "retry pls!" });
    }

    const message = `${process.env.FRONTEND_URL}/changePass/reset/${reset}`;

    await sendMail({
      to: user.email,
      subject: "ChangePassword",
      text: message,
    });
    return res
      .status(200)
      .json({ message: "user login successfully!", user, reset });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
exports.resetPass = async (req, res, next) => {
  try {
    if (!req.params.token) {
      return res.status(404).json({ message: "wrong url" });
    }

    const resetToken = await crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userModel
      .findOne({
        resetPasswordToken: resetToken,
        resetPasswordTokenExpire: { $gt: Date.now() },
      })
      .select("+password");

    if (!user) {
      return next(
        new ErrorHandler("Password reset token is invalid or expired")
      );
    }

    const { password, confirmPassword } = req.body;

    if (!password && !confirmPassword) {
      return res.status(404).json({ message: "Fil The Value !!" });
    }

    if (password !== confirmPassword) {
      return res.status(404).json({ message: "Password Does't match!" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: true });
    setJWT(res, 200, user);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
exports.addProfile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(404).json({ message: "no  Image Uploads !!" });
    }

    console.log(req.file);

    // setJWT(user, res,"Sign UP Successful");
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
exports.loadUser = async (req, res, next) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(404).json({ message: "user Not found!" });
    }

    return res.status(200).json({ message: "Welcome ! ", user });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};

exports.getSingleUser = async (req, res, next) => {
  try {
    const id = req.query?.id?.toString();

    if (!id) {
      return res.status(200).json({ message: "id Not Found" });
    }
    const user = await userModel.findOne({ uid: id });
    return res.status(200).json({ user: user ?? [] });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};

// exports.login=async(req,res,next)=>{
//     try {

//     } catch (error) {
//         console.log(error);
//         return res.status(404).json({error})
//     }
// }
