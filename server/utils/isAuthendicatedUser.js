const jwt=require('jsonwebtoken');
const userModel = require('../models/User.Schema');

const isAuthendicatedUser=async(req,res,next)=>{
    try {
        const {chat_app}=req.cookies
        console.log(req.cookies);
        
        if (!chat_app) {
            return res.status(200).json({ message: "cookie Not Found !" });
          }
          const {id} =jwt.verify(chat_app,process.env.JWT_SECRET)

          const user =await userModel.findOne({_id:id})

          if (!user) {
            return res.status(404).json({ message: "user Not found!" });
          }
          req.user=user
          next()
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"your Not Authendicated User!"})
    }
}


module.exports=isAuthendicatedUser