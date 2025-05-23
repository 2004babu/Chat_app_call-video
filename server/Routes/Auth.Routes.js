const express = require("express");
const path = require("path");
const {
  signup,
  login,
  ChangePass,
  resetPass,
  addProfile,
  loadUser,
  getSingleUser,
  EmailSignup,
  gogglesignup,
  gogglelogin,
  emaillogin,
} = require("../Controllers/Auth.Controllers");
const route = express.Router();
const isAuthendicatedUser = require("../utils/isAuthendicatedUser");
const multer = require("multer");
const admin = require("../firebase");
const firebaseGoogleLogin = require("../utils/firebaseGoogle");
const SetJWT = require("../utils/SetJWT");
const userModel = require("../models/User.Schema");

const storage = multer.diskStorage({
  destination: function (err, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (err, file, cb) {
    cb(null, file.originalname);
  },
});

const image = multer({ storage });

route.post("/gogglesignup", firebaseGoogleLogin, gogglesignup);
route.post("/emailSignup", firebaseGoogleLogin, EmailSignup);

// route.post("/gogglelogin", firebaseGoogleLogin, gogglelogin);
// route.post("/emaillogin", firebaseGoogleLogin, emaillogin);
route.post("/setjwt", firebaseGoogleLogin, async (req, res) => {
try {
  const user= await userModel.findOne({uid:req.user.uid})
  SetJWT(res, 200, user);
  
} catch (error) {
  console.log(error);
  
}
});

route.post("/signup", firebaseGoogleLogin, signup);
// route.post("/login", login);
route.get("/loadUser", isAuthendicatedUser, loadUser);
// route.get("/singleuser",isAuthendicatedUser, loadUser);
route.get("/user", isAuthendicatedUser, getSingleUser);

route.post("/resettoken", ChangePass);
route.post("/ChangePass/reset/:token", resetPass);
route.post(
  "/profilepic",
  isAuthendicatedUser,
  image.single("profile"),
  addProfile
);

module.exports = route;
