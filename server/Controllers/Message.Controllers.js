const conversationModel = require("../models/Conversation.Schema");
const MessageModel = require("../models/Message.Schema");
const userModel = require("../models/User.Schema");

exports.addFriend = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};
exports.chat = async (req, res, next) => {
  try {
    const user = req.user;
    const { msg='', receiverId } = req.body;
    console.log(msg);
    
    if (!msg.length>0 || !receiverId) {
      return res.status(400).json({ message: "Message or receiverId is missing" });
    }
    console.log(user);

    if (!user || !user._id) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    let message;
    let conversation = await conversationModel.findOne({
      participants: { $all: [user._id, receiverId] },
    });

    //if already friend have coneversation
    if (conversation) {
      message = new MessageModel({
        message: msg,
        senderId: user._id,
        receiverId,
      });
      await message.save();
      conversation.messages.push(message._id);

      await conversation.save();

      return res
        .status(200)
        .json({ message: "msg Send Successfuly!", conversation, message });
    }
    //if conversation not there new friend
    message = new MessageModel({
      message: msg,
      senderId: user._id,
      receiverId,
    });
    await message.save();

   conversation=new  conversationModel({
      participants: [user._id, receiverId],
      messages: [message._id],
    });

    await conversation.save();

    return res
      .status(200)
      .json({ message: "msg Send Successfuly!", conversation, message });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};
exports.listAccounts = async (req, res, next) => {
  try {
    const user = req.user;
    const friends = await userModel.find({ _id: { $in: user.friendlist } });
    return res.status(200).json({ users: friends ?? [] });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};
exports.searchAccount = async (req, res, next) => {
  try {
    const { search } = req.body;
    if (!search.length > 0) {
      return res.status(200).json({ message: "" });
    }

    const user = await userModel.find({
      email: { $regex: search, options: "i" },
    });

    return res.status(200).json({ user: user ?? [] });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};
// exports.chat = async (req, res, next) => {
//   try {
//   } catch (error) {
//     console.log(error);
//     return res.status(404).json({ error });
//   }
// };
