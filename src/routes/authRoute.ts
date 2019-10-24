import { Router } from 'express';
import controllers from '../controllers';
import middleware from '../middleware';

const authController = controllers.auth;
const authRouter = Router();

authRouter.post('/sign-up', middleware.multerUploads, authController.signUp);
authRouter.post('/sign-in', authController.signIn);

export default authRouter;
