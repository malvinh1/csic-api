import { Request, Response } from 'express';
import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';
import { ResponseObject } from '../types';

async function addPost(req: Request, res: Response) {
  try {
    let result: ResponseObject = {
      success: true,
      data: [],
      message: '',
    };
    if (result.success) {
      res.status(SERVER_OK).json(result);
    } else {
      res.status(SERVER_BAD_REQUEST).json(result);
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

export default { addPost };
