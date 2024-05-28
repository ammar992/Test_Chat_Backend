import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

///////////// register user

const registerUser = asyncHandler(async (req, res) => {
  // Destructure name, email, and password from req.body
  const { name, email, password } = req.body;
  // Check if a user with the given email already exists
  const user = await User.findOne({ email });
  // If user exists, return a 400 status with an error message
  if (user) {
    res
      .status(400)
      .json(
        new ApiError(400, 'User already registered', 'User already registered')
      );
    return;
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  // Create a new user with the provided name, email, and password
  const createUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const saveUser = await User.findById(createUser._id).select('-password');
  // Return a 200 status with a success message and the created user object
  res
    .status(200)
    .json(new ApiResponse(200, 'User registered successfully', saveUser));
});

//////////// login user 
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const checkUser = await User.findOne({ email });
//   if (!checkUser) {
//     res
//       .status(404)
//       .json(new ApiError(404, 'User not registered', 'User not registered'));
//     return;
//   }
  
//   const checkPassword = await bcryptjs.compare(password, checkUser.password.toString());
//   if (!checkPassword) {
//     res
//       .status(403)
//       .json(new ApiError(404, 'Invalid credentials', 'Invalid credentials'));
//     return;
//   }
  
//   const token = jwt.sign(
//     { id: checkUser._id },
//     process.env.TOKEN_SECRET_KEY,
//     { expiresIn: process.env.EXPIRES_IN }
//   );

//   const user = await User.findById(checkUser._id).select('-password');
//   const options = {
//     secure:true,
//     httpOnly:true,
//     sameSite: 'None' 
//   }
//   res
//     .status(200)
//     .cookie('token', token,options)
//     .json(
//       new ApiResponse(200, 'User login successfully', {user,token})
//     );
// });

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email });
  if (!checkUser) {
    return res.status(404).json(new ApiError(404, 'User not registered', 'User not registered'));
  }

  const checkPassword = await bcryptjs.compare(password, checkUser.password.toString());
  if (!checkPassword) {
    return res.status(403).json(new ApiError(403, 'Invalid credentials', 'Invalid credentials'));
  }

  try {
    const token = jwt.sign(
      { id: checkUser._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: process.env.EXPIRES_IN }
    );

    const user = await User.findById(checkUser._id).select('-password');
    const options = {httpOnly: true, secure: true}
    res
      .status(200)
      .cookie('token', token, options)
      .json(new ApiResponse(200, 'User login successfully', { user, token }));
  } catch (err) {
    console.error('Error setting cookie:', err);
    return res.status(500).json(new ApiError(500, 'Internal Server Error', 'Failed to set cookie'));
  }
});



 /////////// my data
const getMyData = asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,"Your Information",req.user));
})

/////////// logout

const logoutUser = asyncHandler(async(req,res)=>{
  res.status(200).clearCookie("token").json(new ApiResponse(200,"User logout successfully",""));
})

//////////// single user data 

const singleUserData = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select('-password');
    if(!user){
        res
        .status(404)
        .json(new ApiError(404, 'no data found', 'no data found'));
      return;
    }
    res.status(200).json(new ApiResponse(200,"users data",user));

})



export { registerUser, loginUser,getMyData,singleUserData,logoutUser };
