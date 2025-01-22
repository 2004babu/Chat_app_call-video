const jwt = require("jsonwebtoken");

const setJWT = async (user, res, msg) => {
  try {
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: Date.now() + 2 * 24 * 60 * 60 * 1000,
    });

    if (!token) {
      return console.log("errror");
    }

    return res
      .status(200)
      .cookie("chat_app", token, {
        maxAge: Date.now() + 24 * 60 * 60 * 1000,
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "",
      })
      .json({ message: msg ?? "jwt set SuucessFully", user, token });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "Error in Create jwt!" });
  }
};

module.exports = setJWT;
