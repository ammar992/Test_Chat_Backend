import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.model('Chat', chatSchema);
