import { Router } from 'express';
import controllers from '../controllers';

const featureController = controllers.feature;
const authRouter = Router();

authRouter.post('/add-post', featureController.addPost);

export default authRouter;
