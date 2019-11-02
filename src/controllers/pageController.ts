import { Request, Response } from 'express';
import userModel from '../models/userModel';
import postModel from '../models/postModel';

import { generateResponse } from '../helpers';
import { ResponseObject } from '../types';
import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';

async function myProfile(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let userResult: ResponseObject = await userModel.getUserById(id);
    let postResult: ResponseObject = await postModel.getPostByUserId(id);
    if (userResult.success && postResult.success) {
      res.status(SERVER_OK).json(
        generateResponse({
          success: true,
          data: [
            {
              user: userResult.data,
              post: postResult.data,
            },
          ],
          message: 'Successfully retrieve my profile',
        }),
      );
    } else if (!userResult) {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(userResult));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(postResult));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

async function userProfile(req: Request, res: Response) {
  try {
    let { id } = req.params;
    let userResult: ResponseObject = await userModel.getUserById(Number(id));
    let postResult: ResponseObject = await postModel.getPostByUserId(
      Number(id),
    );
    if (!userResult) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'User is not exist',
      });
      return;
    }
    if (userResult.success && postResult.success) {
      res.status(SERVER_OK).json(
        generateResponse({
          success: true,
          data: [
            {
              user: userResult.data,
              post: postResult.data,
            },
          ],
          message: 'Successfully retrieve user profile',
        }),
      );
    } else if (!userResult) {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(userResult));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(postResult));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

async function home(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let user: ResponseObject = await userModel.getUserById(Number(id));
    if (user.data.following.length === 0) {
      res.status(SERVER_OK).json(
        generateResponse({
          success: true,
          data: [],
          message: 'You are not following anybody',
        }),
      );
      return;
    }
    let i = 0;
    let posts = {
      success: true,
      data: [],
      message: 'Successfully get home data',
    };
    for (i = 0; i < user.data.following.length; i += 1) {
      let followingUser = await userModel.getUserById(
        JSON.parse(user.data.following[i]).id,
      );
      let post = await postModel.getPostByUserId(
        JSON.parse(user.data.following[i]).id,
      );
      post.data.forEach((element) => {
        element.username = followingUser.data.username;
        element.full_name = followingUser.data.full_name;
        element.location = followingUser.data.location;
        element.avatar = followingUser.data.avatar;
        posts.data.push(element);
      });
    }
    posts.data.sort((a, b) => b.timestamp - a.timestamp);
    if (posts.success) {
      res.status(SERVER_OK).json(generateResponse(posts));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(posts));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

export default { myProfile, userProfile, home };
