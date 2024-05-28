import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
  MessageAttachment,
  getMessages,
} from '../controllers/message.controller.js';
import { upload } from '../middleware/multer.middleware.js';
const router = Router();

////// send attachements
router
  .route('/attachments')
  .post(verifyToken, upload.array('files'), MessageAttachment);

////// get message
router.route('/user/:id').get(verifyToken, getMessages);

export default router;
