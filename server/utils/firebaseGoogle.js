const admin =require('../firebase')

const firebaseGoogleLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodetoken = await admin.auth().verifyIdToken(token);
    req.user = decodetoken;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports= firebaseGoogleLogin;
