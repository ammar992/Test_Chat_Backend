import { Router } from "express";
const router = Router();
import { getMyData, loginUser, logoutUser, registerUser, singleUserData } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";



router.route('/register').post(registerUser);
router.route('/login').post(loginUser);



/////////////// protected routes 

router.route('/me').get(verifyToken,getMyData);
router.route('/singleuser/:id').get(verifyToken,singleUserData);
router.route('/logout').get(verifyToken,logoutUser);


export default router;