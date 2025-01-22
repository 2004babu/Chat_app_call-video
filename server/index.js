const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;
const AuthRoute=require('./Routes/Auth.Routes');
const MessageRoute=require('./Routes/Message.Routes.js');
const db = require("./utils/db.js");
const cookieParser = require("cookie-parser");

app.use(cors({ origin: true }));
app.use(express.json());
app.use(cookieParser())

db()

app.use("/chatapi/auth", AuthRoute);
app.use("/chatapi/message", MessageRoute);


console.log(process.env.NODE_ENV);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
