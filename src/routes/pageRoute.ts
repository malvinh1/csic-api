import { Router } from 'express';

import controllers from '../controllers';

const pageController = controllers.page;
const pageRouter = Router();

pageRouter.get('/profile', pageController.myProfile);

export default pageRouter;
