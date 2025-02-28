const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Dynamic frontend URL

const server = http.createServer(app);

const corsOptions = {
  origin: CLIENT_URL,
  allowedHeaders: ["Content-Type"],
  methods: ["POST", "GET"],
  credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
  allowEIO3: true,
});

const AuthRoute = require("./Routes/Auth.Routes");
const MessageRoute = require("./Routes/Message.Routes.js");
const db = require("./utils/db.js");
const cookieParser = require("cookie-parser");

const users = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  const userId = socket.handshake.query.userId;
  users.set(userId, socket.id);
  io.emit("onlineUsers", Array.from(users.keys()));
  socket.on("newMsg", (msg) => {
    io.to(users.get(msg.receiverId)).emit("recieveMSG", {
      senderId: userId,
      receiverId: msg.receiverId,
      message: msg.msg,
    });
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    if (users.has(userToCall?.toString())) {
      io.to(users.get(userToCall?.toString())).emit("callIncoming", {
        signal: signalData,
        from,
        name,
        userId,
      });
    }
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("endedCall", (data) => {
    if (users.has(data.to.toString())) {
      io.to(users.get(data?.to?.toString())).emit("endedCall", data);
    } else {
      io.to(data.to).emit("endedCall", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    users.delete(userId);
    io.emit("onlineUsers", Array.from(users.keys()));
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

db();

app.use("/chatapi/auth", AuthRoute);
app.use("/chatapi/message", MessageRoute);



app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
