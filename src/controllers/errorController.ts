import { SERVER_NOT_FOUND } from '../constants';
import { Request, Response } from 'express';

function getBadPath(req: Request, res: Response) {
  res.status(SERVER_NOT_FOUND).json({
    success: false,
    data: {},
    message: 'NOT FOUND',
  });
}

export default { getBadPath };
