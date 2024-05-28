import { ApiError } from '../utils/ApiError.js';
import { Request } from '../models/request.model.js';
import { NEW_REQUEST } from '../../constant.js';
import { emitEvent } from '../utils/feature.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Chat } from '../models/chat.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { REFETCH_CHAT } from '../../constant.js';


//////////  send requiest
const sendFriendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res
      .status(409)
      .json(new ApiError(409, 'user id is required', 'user id is required'));
    return;
  }
  const request = await Request.findOne({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  });
  if (request) {
    res
      .status(403)
      .json(new ApiError(403, 'Request already sent', 'Request already sent'));
    return;
  }
  await Request.create({
    sender: req.user._id,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId], userId);

  res.status(200).json(new ApiResponse(200, 'Request sent successfully', ''));
});

/////////// accept request 
const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { reqId, accept } = req.body;
  const request = await Request.findById(reqId)
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');
  if (!request) {
    res
      .status(404)
      .json(new ApiResponse(404, 'No request found', 'No request found'));
    return;
  }
  if (request.receiver._id.toString() !== req.user._id.toString()) {
    res
      .status(403)
      .json(
        new ApiResponse(
          403,
          'You are unautharized to accept this request',
          'You are unautharized to accept this request'
        )
      );
    return;
  }
  if (!accept) {
    await request.deleteOne();
    res
      .status(200)
      .json(new ApiResponse(200, 'request rejected', ''));
    return;
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      name: `${request.sender.name}-${request.receiver.name}`,
      members: members,
    }),
    request.deleteOne(),
  ]);
  emitEvent(req, REFETCH_CHAT, members);
  res.status(200).json(new ApiResponse(200, 'request accepted', ''));
});

/////////// notification 
const myNotification = asyncHandler(async(req,res)=>{
  const findmyNotification = await Request.find({receiver:req.user._id}).populate("sender","name email");
  const formation = findmyNotification.map(({id,sender})=>({
      id,sender
  }))
  res.status(200).json(new ApiResponse(200,"Your notification",formation));
});

export { sendFriendRequest, acceptFriendRequest,myNotification };
