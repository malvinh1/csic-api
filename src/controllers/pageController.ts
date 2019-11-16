import { Request, Response } from 'express';
import userModel from '../models/userModel';
import postModel from '../models/postModel';

import { generateResponse } from '../helpers';
import { ResponseObject, Following } from '../types';
import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';
import requestModel from '../models/requestModel';
import chatModel from '../models/chatModel';

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
    let decoded = (<any>req).decoded;
    let { id: myId } = decoded;
    let userResult: ResponseObject = await userModel.getUserById(Number(id));
    let postResult: ResponseObject = await postModel.getPostByUserId(
      Number(id),
    );
    let myUserResult: ResponseObject = await userModel.getUserById(myId);
    if (!userResult) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'User is not exist',
      });
      return;
    }
    if (userResult.success && postResult.success) {
      let i: number;
      for (i = 0; i < myUserResult.data[0].following.length; i += 1) {
        myUserResult.data[0].following[i] = JSON.parse(
          myUserResult.data[0].following[i],
        );
      }
      myUserResult.data[0].following.find((following: Following) => {
        return following.id == Number(id);
      })
        ? (userResult.data[0].is_followed_by_you = true)
        : (userResult.data[0].is_followed_by_you = false);
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
    if (user.data[0].following.length === 0) {
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
    for (i = 0; i < user.data[0].following.length; i += 1) {
      let followingUser = await userModel.getUserById(
        JSON.parse(user.data[0].following[i]).id,
      );
      let post = await postModel.getPostByUserId(
        JSON.parse(user.data[0].following[i]).id,
      );
      post.data.forEach(async (element) => {
        if (element.exp_date) {
          if (Date.now() > element.exp_date) {
            element.tag = 'EXPIRED';
            postModel.updatePost(element, element.id);
          }
        } else if (element.buy_date) {
          if (Date.now > element.buy_date) {
            element.tag = 'EXPIRED';
            postModel.updatePost(element, element.id);
          }
        }
        element.username = followingUser.data[0].username;
        element.full_name = followingUser.data[0].full_name;
        element.location = followingUser.data[0].location;
        element.avatar = followingUser.data[0].avatar;
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

async function myRequest(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let requestResult: ResponseObject = await requestModel.getRequestByRequester_Id(
      id,
    );
    let result: ResponseObject = {
      success: true,
      data: [],
      message: 'Successfully get myRequest data',
    };
    let i: number;
    for (i = 0; i < requestResult.data.length; i += 1) {
      let postFetchResult = await postModel.getPostById(
        requestResult.data[i].post_id,
      );
      let userFetchResult = await userModel.getUserById(
        requestResult.data[i].user_id,
      );
      let {
        id: user_id,
        full_name,
        location,
        avatar,
      } = userFetchResult.data[0];
      let { id: post_id, item_name, image } = postFetchResult.data;
      result.data.push({
        user_id,
        full_name,
        location,
        avatar,
        post_id,
        item_name,
        image,
        status: requestResult.data[i].status,
        created_at: requestResult.data[i].created_at,
      });
    }
    result.data.sort((a, b) => b.created_at - a.created_at);

    if (result.success) {
      res.status(SERVER_OK).json(generateResponse(result));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

async function userRequest(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let requestResult: ResponseObject = await requestModel.getRequestByUser_id(
      id,
    );
    let result: ResponseObject = {
      success: true,
      data: [],
      message: 'Successfully get userRequest data',
    };
    let i: number;
    for (i = 0; i < requestResult.data.length; i += 1) {
      let postFetchResult = await postModel.getPostById(
        requestResult.data[i].post_id,
      );
      let userFetchResult = await userModel.getUserById(
        requestResult.data[i].requester_id,
      );
      let {
        id: user_id,
        full_name,
        location,
        avatar,
      } = userFetchResult.data[0];
      let { id: post_id, item_name, image } = postFetchResult.data;
      result.data.push({
        user_id,
        full_name,
        location,
        avatar,
        post_id,
        item_name,
        image,
        status: requestResult.data[i].status,
        created_at: requestResult.data[i].created_at,
      });
    }
    result.data.sort((a, b) => b.created_at - a.created_at);

    if (result.success) {
      res.status(SERVER_OK).json(generateResponse(result));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

async function getMessage(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let redundantChat = await chatModel.getGroupedChat(id);
    let chatList: Array<{
      user_id?: number;
      sender_id?: number;
      receiver_id?: number;
    }> = [];
    let flag: boolean;
    redundantChat.data.forEach((firstItem) => {
      flag = true;
      chatList.forEach((item) => {
        if (
          firstItem.sender_id === item.receiver_id &&
          firstItem.receiver_id === item.sender_id
        ) {
          flag = false;
        }
      });
      if (flag) {
        chatList.push(firstItem);
      }
    });

    chatList = chatList.map((item) => {
      if (item.sender_id === id) {
        return { user_id: item.receiver_id };
      } else {
        return { user_id: item.sender_id };
      }
    });
    let chatListAll = await Promise.all(
      chatList.map(async (item) => {
        let userResponse = await userModel.getUserById(item.user_id);
        let messageList: ResponseObject = await chatModel.getChatBySenderIDOrReceiverID(
          id,
          item.user_id,
        );
        return { ...userResponse.data[0], messages: messageList.data };
      }),
    );

    chatListAll.sort((firstItem, secondItem) => {
      return (
        secondItem.messages[secondItem.messages.length - 1].timestamp -
        firstItem.messages[firstItem.messages.length - 1].timestamp
      );
    });

    let finalResponse = {
      success: true,
      data: [
        {
          my_data: [
            await userModel.getUserById(id).then((item) => {
              return item.data[0];
            }),
          ],
          chat_list: chatListAll,
        },
      ],
      message: 'Successfully getting all of the chat list',
    };

    if (finalResponse.success) {
      res.status(SERVER_OK).json(generateResponse(finalResponse));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(finalResponse));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

export default {
  myProfile,
  userProfile,
  home,
  myRequest,
  userRequest,
  getMessage,
};
