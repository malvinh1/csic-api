import { Router } from 'express';

import authRouter from './authRouter';
import controllers from '../controllers';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.all('*', controllers.error.getBadPath);

export default apiRouter;
