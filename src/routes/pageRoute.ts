import { Router } from 'express';

import controllers from '../controllers';

const pageController = controllers.page;
const pageRouter = Router();

pageRouter.get('/profile', pageController.myProfile);
pageRouter.get('/profile/:id', pageController.userProfile);

export default pageRouter;
