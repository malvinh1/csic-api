import { Router } from 'express';
import controllers from '../controllers';
import middleware from '../middleware';

const featureController = controllers.feature;
const authRouter = Router();

authRouter.post(
  '/add-post',
  middleware.multerUploads,
  featureController.addPost,
);

export default authRouter;
