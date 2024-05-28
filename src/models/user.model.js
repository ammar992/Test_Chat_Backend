import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'] },
  email: { type: String, required: [true, 'email is required'] },
  avatar: { type: String, required: false },
  password: { type: String, required: [true, 'Password is required'] },
},{timestamps:true});

export const User = mongoose.model('User', userSchema);

