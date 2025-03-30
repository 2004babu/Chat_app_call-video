const mongoose=require('mongoose');


const messageSchema= mongoose.Schema({
    // userName:{type:String,required:true},
    // senderId:{type:String,required:true,ref:"User"},
    // receiverId:{type:String,required:true,ref:"User"},
    
    senderId:{type:String,required:true},
    receiverId:{type:String,required:true},
    
    message:{type:String,required:true},
    reply:{type:String},
    
    
},{timeStamp:true})

const MessageModel=mongoose.model('Message',messageSchema);

module.exports= MessageModel;