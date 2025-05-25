import express from 'express';
import { UserController } from './authController';
import auth from '../../middlewares/auth';
import { User_Role } from '../../../generated/prisma';
const router = express.Router();

router.get('/', UserController.getAllUser);
router.get(
    '/me',
    auth(User_Role.USER, User_Role.ADMIN),
    UserController.getMyProfile,
);
router.post('/create-user', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/refresh-token', UserController.refreshToken);

router.patch(
    '/update-my-profile',
    auth(User_Role.ADMIN, User_Role.USER),
    UserController.updateProfile,
);

export const AuthRoutes = router;
