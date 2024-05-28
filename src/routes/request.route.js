import { Router } from "express";
import { acceptFriendRequest, myNotification, sendFriendRequest } from "../controllers/request.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = Router();



router.route('/friend').post(verifyToken,sendFriendRequest);
router.route('/accept').post(verifyToken,acceptFriendRequest);
router.route('/my').get(verifyToken,myNotification);



export default router;