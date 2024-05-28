
import { app } from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/db/db.config.js';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken'; 
import { v4 as uuid } from 'uuid';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST } from './constant.js';
import { getSockets } from './src/utils/feature.js';
import { Message } from './src/models/message.model.js';
import { User } from './src/models/user.model.js'; 
dotenv.config({
  path: './.env',
});

export const userSocketIds = new Map();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
});

app.set("io",io);

io.use(async (socket, next) => {
  try {
    const token = socket?.handshake?.auth?.token;
    if (!token) {
      console.error('Authentication error: No token provided');
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify the token
    const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const user = await User.findById(decodedToken?.id).select('-password');
    if (!user) {
      console.error('Authentication error: User not found');
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    next(new Error(`Authentication error: ${error.message}`));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  
  const user = socket.user;
  userSocketIds.set(user._id.toString(), socket.id);

  socket?.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      senderId: {
        _id: user._id,
        name: user.name,
      },
      chatId,
      createdAt: new Date().toString(),
    };

    const membersSocket = getSockets(members);

    const messageForDB = {
      content: message,
      senderId: user._id,
      chatId,
    };

    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      ...messageForRealTime,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });

    try {
      await Message.create(messageForDB);
    } catch (err) {
      console.log(err.message);
    }
  });

  socket?.on('disconnect', () => {
    console.log('User disconnected');
    userSocketIds.delete(user._id.toString());
  });
});

app.get('/', (req, res) => {
  res.send('Server is working');
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server is working at http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed ', err.message);
  });
