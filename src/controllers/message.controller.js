import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Message } from '../models/message.model.js';
import { ApiError } from '../utils/ApiError.js';
import { emitEvent } from '../utils/feature.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Chat } from '../models/chat.model.js';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from '../../constant.js';

const MessageAttachment = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404).json(new ApiError(404, 'No chat found', 'No Chat found'));
    return;
  }
  const files = req.files;
  const path = await uploadOnCloudinary(files);
  const messageForRealTime = {
    content: '',
    senderId: {
      _id: req.user._id,
      name: req.user.name,
    },
    chat: chat._id,
    attachement: path,
  };

  const messgaeForDb = {
    content: '',
    senderId: req.user._id.toString(),
    chatId: chat._id.toString(),
    attachement: path,
  };


  const member = chat.members.find((item)=>item.toString() != req.user._id.toString());
  await Message.create(messgaeForDb);
  emitEvent(req, NEW_MESSAGE, member, {
    chatId,
    ...messageForRealTime,
  });
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
  res
    .status(200)
    .json(new ApiResponse(200, 'attachment sent successfully', messgaeForDb));
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chatId: req.params.id }).populate(
      'senderId',
      'name email'
    );
    res
      .status(200)
      .json(new ApiResponse(200, 'message fetched successfully', message));
  } catch (error) {
    console.log(error.message);
  }
});

export { MessageAttachment, getMessages };
