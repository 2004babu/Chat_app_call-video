const isAuthendicatedUser = require("../utils/isAuthendicatedUser");
const express = require("express");
// const path = require("path");
const {
  addFriend,
  listAccounts,
  searchAccount,
  chat,
} = require("../Controllers/message.Controllers");

const route = express.Router();

route.post("/addfriend", isAuthendicatedUser, addFriend);
route.post("/searchAccount", isAuthendicatedUser, searchAccount);
route.post("/listAccounts", isAuthendicatedUser, listAccounts);
route.post("/chat", isAuthendicatedUser, chat);
// route.post("/resettoken", ChangePass);
// route.post("/ChangePass/reset/:token", resetPass);
// route.post("/profilepic", isAuthendicatedUser,image.single('profile'), addProfile);

module.exports = route;
