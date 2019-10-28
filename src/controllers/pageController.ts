import { Request, Response } from 'express';
import userModel from '../models/userModel';
import postModel from '../models/postModel';

import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';
import { ResponseObject } from '../types';

async function myProfile(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let userResult: ResponseObject = await userModel.getUserById(id);
    let postResult: ResponseObject = await postModel.getPostByUserId(id);
    if (userResult.success && postResult.success) {
      res.status(SERVER_OK).json({
        success: true,
        data: [
          {
            user: userResult.data,
            post: postResult.data,
          },
        ],
        message: 'Successfully retrieve my profile',
      });
    } else if (!userResult) {
      res.status(SERVER_BAD_REQUEST).json(userResult);
    } else {
      res.status(SERVER_BAD_REQUEST).json(postResult);
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

export default { myProfile };
