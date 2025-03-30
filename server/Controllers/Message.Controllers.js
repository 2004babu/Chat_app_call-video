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
    const userId = req.user.uid;
    const { msg = "", receiverId } = req.body;

    if (userId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "con't send msg self" });
    }
    if (!msg.length > 0 || !receiverId) {
      return res
        .status(400)
        .json({ message: "Message or receiverId is missing" });
    }
    // console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    let message;
    let conversation = await conversationModel
      .findOne({
        participants: { $all: [userId, receiverId] },
      })
      .populate("messages");

    //if already friend have coneversation
    if (conversation) {
      message = new MessageModel({
        message: msg,
        senderId: userId,
        receiverId,
      });
      await message.save();
      conversation.messages.push(message._id);

      await conversation.save();
    } else {
      message = new MessageModel({
        message: msg,
        senderId: userId,
        receiverId,
      });
      await message.save();

      conversation = new conversationModel({
        participants: [userId, receiverId],
        messages: [message._id],
      });

      await conversation.save();
      conversation = await conversation.populate("messages");
    }

    let user = await userModel.findOne({ uid: userId });

    user.lastChat = [
      { userId: receiverId, time: Date.now() },
      ...user.lastChat.filter(
        (item) => item.userId.toString() !== receiverId.toString()
      ),
    ];

    await user.save();

    let Chatuser = await userModel.findOne({ uid: receiverId });

    Chatuser.lastChat = [
      { userId: userId, time: Date.now() },
      ...Chatuser.lastChat.filter(
        (item) => item.userId.toString() !== userId.toString()
      ),
    ];

    await Chatuser.save();
    console.log(Chatuser, receiverId, userId);

    return res
      .status(200)
      .json({
        message: "msg Send Successfuly!",
        conversation,
        message,
        user,
        Chatuser,
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};
exports.listAccounts = async (req, res, next) => {
  try {
    const user = req.user;

    const userlastChat = user.lastChat.map((item) => item.userId.toString());
    // console.log(userlastChat);

    let friends = await userModel.find({ uid: { $in: userlastChat } });

    friends.sort(
      (a, b) =>
        userlastChat.indexOf(a.uid.toString()) -
        userlastChat.indexOf(b.uid.toString())
    );

    return res.status(200).json({ users: friends ?? [] });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};
exports.getConversations = async (req, res, next) => {
  try {
    // const user = req.user;
    const chatuserId = req.query.id;

    const userId = req.user?.uid?.toString();
    const chatUserIdStr = chatuserId?.toString();

    if (!userId || !chatUserIdStr) {
      throw new Error("User ID or Chat User ID is missing");
    }

    const conversation = await conversationModel
      .findOne({ participants: { $all: [userId, chatUserIdStr] } })
      .populate("messages");

    // console.log(chatuserId, req.user._id?.toString());

    return res
      .status(200)
      .json({ conversation: conversation ?? "Start conversation" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};
exports.searchAccount = async (req, res, next) => {
  try {
    const User = req.user;
    let { search, page } = req.body;

    page = page ?? 0;
    let limit = 10;
    let skip = page > 0 ? page * limit : 0;

    console.log(page, limit, skip);

    if (!search.length > 0) {
      return res.status(200).json({ message: "" });
    }

    const user = await userModel.aggregate([
      {
        $match: {
          _id: { $ne: User._id },
          $or: [
            { userName: { $regex: search } },
            { email: { $regex: search } },
          ],
        },
      },
    ]);

    // .skip(skip)
    // .limit(limit);

    // console.log(user);

    return res.status(200).json({ users: user ?? [] });
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
