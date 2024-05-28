import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { Chat } from '../models/chat.model.js';

/////////// users who are not in my friends list

const uniqueUser = asyncHandler(async (req, res) => {
  const chat = await Chat.find({ members: req.user._id });
  let myChats = await chat.flatMap((item) => item.members);
  if (!myChats.length > 0) {
    myChats = [req.user._id];
  }
  const user = await User.find({ _id: { $nin: myChats } });
  res.status(200).json(new ApiResponse(200, 'user fetched successfully', user));
});

////////////  my friends

const myFirends = asyncHandler(async (req, res) => {
  const chat = await Chat.find({ members: req.user._id }).populate(
    'members',
    'name email'
  );
  const transform = chat.map(({ _id, members }) => {
    const otherUser = members.find(
      (item) => item._id.toString() !== req.user._id.toString()
    );
    return {
      _id,
      name: otherUser.name,
      email: otherUser.email,
      members:members.reduce((prev,curr)=>{
        prev.push(curr._id)
        return prev;
      },[])
    };
  });
  res.status(200).json(new ApiResponse(200, 'your friends', transform));
});

export { uniqueUser, myFirends };
