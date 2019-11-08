import { Router } from 'express';
import controllers from '../controllers';
import middleware from '../middleware';

const featureController = controllers.feature;
const featureRouter = Router();

featureRouter.post(
  '/add-post',
  middleware.multerUploads,
  featureController.addPost,
);
featureRouter.post(
  '/edit-profile',
  middleware.multerUploads,
  featureController.editProfile,
);
featureRouter.post(
  '/edit-post/:post_id',
  middleware.multerUploads,
  featureController.editPost,
);
featureRouter.get(
  '/delete-post/:post_id',
  middleware.multerUploads,
  featureController.deletePost,
);
featureRouter.post('/add-request', featureController.addRequest);
featureRouter.get('/follow/:user_id', featureController.followUser);

export default featureRouter;
