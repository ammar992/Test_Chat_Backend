import { Router } from "express";
import { myFirends, uniqueUser} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = Router();



router.route('/users').get(verifyToken,uniqueUser);
router.route('/friends').get(verifyToken,myFirends);


export default router;