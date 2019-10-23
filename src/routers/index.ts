import { Router } from 'express';

import authRouter from './authRouter';
import featureRouter from './featureRouter';
import controllers from '../controllers';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/feature', featureRouter);
apiRouter.all('*', controllers.error.getBadPath);

export default apiRouter;
