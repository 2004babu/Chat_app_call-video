const jwt = require("jsonwebtoken");
// const { RESPONSE_SENDER } = require("./RESPONSE_SENDER");

const SetJWT = async (res,status, user) => {
  if (!user?._id) {
    return res.status(status??200).json({ message: "user Id Not Found!!" });
  }

  const token = await jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });

  console.log(token);
  if (!token) {
    return res.status(404).json({ message:"token not set" });
  }
  //    return RESPONSE_SENDER(res,200,{user,token})
  if (process.env.NODE_ENV === "devlopment") {
    return res
      .status(200)
      .cookie("chat_app", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "Production",
        sameSite: "strict",
      })
      .json({message:"set JWT", success: true, user });
  } else {
    return res
      .status(200)
      .cookie("chat_app", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "Production",
        sameSite: "strict",
      })
      .json({ success: true });
  }
};

module.exports = SetJWT;
