import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(
  cors({
    origin: process.env.origin || "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json({ limit: '16kb' }));
app.use(urlencoded({ extended: true }));

////// routes

import userRoutes from './src/routes/user.route.js';
import chatRoutes from './src/routes/chat.route.js';
import requestRoutes from './src/routes/request.route.js';
import messageRoutes from './src/routes/message.routes.js';

////// user
app.use('/api/v1/user', userRoutes);
////// chat
app.use('/api/v1/chat', chatRoutes);
////// request
app.use('/api/v1/request', requestRoutes);
///// notification
app.use('/api/v1/message', messageRoutes);
