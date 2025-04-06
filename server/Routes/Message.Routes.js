const isAuthendicatedUser = require("../utils/isAuthendicatedUser");
const express = require("express");
// const path = require("path");
const messageController = require("../Controllers/Message.Controllers");
const  firebaseGoogleLogin  = require("../utils/firebaseGoogle");

const route = express.Router();

route.post("/addfriend", isAuthendicatedUser, messageController.addFriend);
route.post(
  "/searchAccount",
  isAuthendicatedUser,
  messageController.searchAccount
);
route.get("/listAccounts", isAuthendicatedUser, messageController.listAccounts);
route.post("/chat", isAuthendicatedUser, messageController.chat);
route.post("/seenedmsg", isAuthendicatedUser, messageController.seenedmsg);
route.get(
  "/conversation",
  isAuthendicatedUser,
  messageController.getConversations
);
// route.post("/resettoken", ChangePass);
// route.post("/ChangePass/reset/:token", resetPass);
// route.post("/profilepic", isAuthendicatedUser,image.single('profile'), addProfile);

module.exports = route;
