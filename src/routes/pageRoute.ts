import { Router } from 'express';

import controllers from '../controllers';

const pageController = controllers.page;
const pageRouter = Router();

pageRouter.get('/profile', pageController.myProfile);
pageRouter.get('/profile/:id', pageController.userProfile);
pageRouter.get('/home', pageController.home);
pageRouter.get('/myRequest', pageController.myRequest);
pageRouter.get('/userRequest', pageController.userRequest);

export default pageRouter;
