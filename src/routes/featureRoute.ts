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
featureRouter.get('/request/:post_id', featureController.addRequest);
featureRouter.post('/answer-request', featureController.answerRequest);
featureRouter.get('/follow/:user_id', featureController.followUser);
featureRouter.get('/search', featureController.searchUser);
featureRouter.get('/following-user', featureController.getFollowingUser);
featureRouter.get('/follower-user', featureController.getFollowerUser);
featureRouter.post('/chat/:receiver_id', featureController.sendMessage);

export default featureRouter;
