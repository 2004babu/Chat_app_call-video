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
} = require("../Controllers/Auth.Controllers");
const route = express.Router();
const isAuthendicatedUser = require("../utils/isAuthendicatedUser");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (err, file, cb) {
    cb(null, path.join(__dirname,'..', "uploads"));
  },
  filename: function (err, file, cb) {
    cb(null, file.originalname);
  },
});

const image = multer({ storage });

route.post("/signup", signup);
route.post("/login", login);
route.get("/loadUser",isAuthendicatedUser, loadUser);
// route.get("/singleuser",isAuthendicatedUser, loadUser);
route.get("/user", isAuthendicatedUser, getSingleUser);

route.post("/resettoken", ChangePass);
route.post("/ChangePass/reset/:token", resetPass);
route.post("/profilepic", isAuthendicatedUser,image.single('profile'), addProfile);

module.exports = route;
