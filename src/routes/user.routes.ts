import { Router } from 'express';
import UserController from '../controllers/User.Controller';
import authenticate from '../middlewares/tokenAuthenticate';
import configUpload from '../config/multer';
import multer from 'multer';
const router = Router();

const upload = multer(configUpload);

router.get('/all', UserController.index);
router.post('/', upload.single('foto_url'), UserController.store);
router.get('/', UserController.show);
router.put('/', authenticate, UserController.update);
router.delete('/', authenticate, UserController.delete);

export default router;
