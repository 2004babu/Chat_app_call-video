const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    // participants: [{ type: String, ref: "User" }],
    participants: [{type:String,required:true}],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timeStamp: true }
);

const conversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = conversationModel;
