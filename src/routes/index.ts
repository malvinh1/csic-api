import { Router } from 'express';

import authRoute from './authRoute';
import featureRoute from './featureRoute';
import controllers from '../controllers';
import pageRoute from './pageRoute';
import middleware from '../middleware';

const apiRouter = Router();

apiRouter.use('/auth', authRoute);
apiRouter.use('/feature', middleware.checkToken, featureRoute);
apiRouter.use('/page', middleware.checkToken, pageRoute);
apiRouter.all('*', controllers.error.getBadPath);

export default apiRouter;
