import { Router } from 'express';
import middleware from '../middleware';

import controllers from '../controllers';

const pageController = controllers.page;
const pageRouter = Router();

pageRouter.get('/profile', middleware.checkToken, pageController.myProfile);

export default pageRouter;
