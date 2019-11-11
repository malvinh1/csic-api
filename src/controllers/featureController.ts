import { Request, Response } from 'express';
import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';
import userModel from '../models/userModel';
import postModel from '../models/postModel';
import requestModel from '../models/requestModel';
import chatModel from '../models/chatModel';
import { ResponseObject, PostRequestObject, Following } from '../types';
import { generateResponse, dataUri } from '../helpers';
import { uploader } from '../cloudinarySetup';

async function addPost(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id: userID } = decoded;
    let {
      item_name,
      buy_date,
      exp_date,
      category,
      description,
      tag,
      image,
    }: PostRequestObject = req.body;
    let timestamp = Date.now();
    if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(async (result: any) => {
          let image = result.url;
          let insertResponse: ResponseObject = await postModel.insertPost({
            id: userID,
            image,
            item_name,
            buy_date:
              buy_date && buy_date != '' && buy_date != null ? buy_date : null,
            exp_date:
              exp_date && buy_date != '' && exp_date != null ? exp_date : null,
            category,
            description,
            tag,
            timestamp,
          });

          if (insertResponse.success) {
            res.status(SERVER_OK).json(generateResponse(insertResponse));
          } else {
            res
              .status(SERVER_BAD_REQUEST)
              .json(generateResponse(insertResponse));
          }
        })
        .catch((err: any) =>
          res.status(SERVER_BAD_REQUEST).json({
            success: false,
            data: {
              err,
            },
            message: 'Something Went Wrong While Processing Your Request',
          }),
        );
    } else if (image) {
      let insertResponse: ResponseObject = await postModel.insertPost({
        id: userID,
        image: image,
        item_name,
        buy_date:
          buy_date && buy_date != '' && buy_date != null ? buy_date : null,
        exp_date:
          exp_date && buy_date != '' && exp_date != null ? exp_date : null,
        category,
        description,
        tag,
        timestamp,
      });
      if (insertResponse.success) {
        res.status(SERVER_OK).json(generateResponse(insertResponse));
      } else {
        res.status(SERVER_BAD_REQUEST).json(generateResponse(insertResponse));
      }
    } else {
      res.status(SERVER_BAD_REQUEST).json(
        generateResponse({
          success: false,
          data: [],
          message: 'Please fill all required fields',
        }),
      );
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

async function editProfile(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { full_name, phone_number, location, gender, image } = req.body;
    if (!full_name && !phone_number && !location && !gender) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'Please fill at least one field',
      });
      return;
    }
    let { id } = decoded;
    let user: ResponseObject = await userModel.getUserById(id);
    if (!user) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'User is not exist',
      });
      return;
    }
    full_name = full_name ? full_name : user.data[0].full_name;
    phone_number = phone_number ? phone_number : user.data[0].phone_number;
    location = location ? location : user.data[0].location;
    gender = gender ? gender : user.data[0].gender;

    if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(async (db_result: any) => {
          let avatar = db_result.url;
          let result: ResponseObject = await userModel.updateUser(
            { full_name, phone_number, location, avatar, gender },
            id,
          );
          if (result.success) {
            res.status(SERVER_OK).json(generateResponse(result));
          } else {
            res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
          }
        })
        .catch((err: any) =>
          res.status(SERVER_BAD_REQUEST).json({
            success: false,
            data: [{ err }],
            message: 'Something went wrong while processing your request',
          }),
        );
    } else if (image) {
      let userResponse: ResponseObject = await userModel.updateUser(
        { full_name, phone_number, location, avatar: image, gender },
        id,
      );
      if (userResponse.success) {
        res.status(SERVER_OK).json(generateResponse(userResponse));
      } else {
        res.status(SERVER_BAD_REQUEST).json(generateResponse(userResponse));
      }
    } else {
      let avatar = user.data[0].avatar;
      let result: ResponseObject = await userModel.updateUser(
        { full_name, phone_number, location, avatar, gender },
        id,
      );
      if (result.success) {
        res.status(SERVER_OK).json(generateResponse(result));
      } else {
        res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
      }
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

async function editPost(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let { post_id } = req.params;
    let {
      item_name,
      buy_date,
      exp_date,
      category,
      description,
      tag,
      image,
    } = req.body;
    if (
      !item_name ||
      !buy_date ||
      !exp_date ||
      !category ||
      !description ||
      !tag
    ) {
      res.status(SERVER_BAD_REQUEST).json({
        success: false,
        data: [],
        message: 'Please fill all required fields',
      });
      return;
    }
    let postResponse = await postModel.getPostById(Number(post_id));
    if (!postResponse.data) {
      res.status(SERVER_BAD_REQUEST).json({
        success: false,
        data: [],
        message: 'There is no post with that ID',
      });
      return;
    } else if (postResponse.data.user_id !== id) {
      res.status(SERVER_BAD_REQUEST).json({
        success: false,
        data: [],
        message: 'This user has no privilege to edit this post.',
      });
      return;
    }

    if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(async (db_result: any) => {
          let image = db_result.url;
          let result: ResponseObject = await postModel.updatePost(
            {
              item_name,
              buy_date,
              exp_date,
              category,
              description,
              image,
              tag,
            },
            Number(post_id),
          );
          if (result.success) {
            res.status(SERVER_OK).json(generateResponse(result));
          } else {
            res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
          }
        })
        .catch((err: any) =>
          res.status(SERVER_BAD_REQUEST).json({
            success: false,
            data: [{ err }],
            message: 'Something went wrong while processing your request',
          }),
        );
    } else if (image) {
      let userResponse: ResponseObject = await postModel.updatePost(
        {
          item_name,
          buy_date,
          exp_date,
          category,
          description,
          image,
          tag,
        },
        Number(post_id),
      );
      if (userResponse.success) {
        res.status(SERVER_OK).json(generateResponse(userResponse));
      } else {
        res.status(SERVER_BAD_REQUEST).json(generateResponse(userResponse));
      }
    } else {
      let result: ResponseObject = await postModel.updatePost(
        {
          item_name,
          buy_date,
          exp_date,
          category,
          description,
          tag,
        },
        Number(post_id),
      );
      if (result.success) {
        res.status(SERVER_OK).json(generateResponse(result));
      } else {
        res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
      }
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

async function deletePost(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let { post_id } = req.params;

    let postResponse = await postModel.getPostById(Number(post_id));
    if (!postResponse.data) {
      res.status(SERVER_BAD_REQUEST).json({
        success: false,
        data: [],
        message: 'There is no post with that ID',
      });
      return;
    } else if (postResponse.data.user_id !== id) {
      res.status(SERVER_BAD_REQUEST).json({
        success: false,
        data: [],
        message: 'This user has no privilege to delete this post.',
      });
      return;
    }

    postResponse = await postModel.deletePostById(Number(post_id));
    if (postResponse.success) {
      res.status(SERVER_OK).json(generateResponse(postResponse));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(postResponse));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

async function addRequest(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id: user_id } = decoded;
    let { post_id } = req.params;

    let result: ResponseObject = await requestModel.insertRequest(
      user_id,
      Number(post_id),
    );
    if (result.success) {
      res.status(SERVER_OK).json(generateResponse(result));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

async function answerRequest(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id: user_id } = decoded;
    let { status, post_id, requester_id } = req.body;
    if (!status || !post_id) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'Please fill all required fields',
      });
      return;
    }
    let postResult: ResponseObject = await postModel.getPostById(post_id);
    if (postResult.data.user_id !== user_id) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'You do not have permissions to answer this request',
      });
      return;
    }
    let result: ResponseObject = await requestModel.updateStatus(
      status,
      post_id,
      requester_id,
    );
    postResult.data.tag = 'UNAVAIlABLE';
    await postModel.updatePost(postResult.data, post_id);
    if (result.success) {
      res.status(SERVER_OK).json(generateResponse(result));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

async function followUser(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let { user_id } = req.params;
    let result: ResponseObject;
    let otherResult: ResponseObject;

    let userData: ResponseObject = await userModel.getUserById(id);
    let otherUserData: ResponseObject = await userModel.getUserById(
      Number(user_id),
    );
    let i: number;
    let following: Array<Following> = [];
    let follower: Array<Following> = [];
    for (i = 0; i < userData.data[0].following.length; i += 1) {
      following.push(JSON.parse(userData.data[0].following[i]));
    }
    for (i = 0; i < otherUserData.data[0].follower.length; i += 1) {
      follower.push(JSON.parse(otherUserData.data[0].follower[i]));
    }
    userData.data[0].following = following;
    otherUserData.data[0].follower = follower;
    if (
      userData.data[0].following.find((following: Following) => {
        return following.id == Number(user_id);
      })
    ) {
      userData.data[0].following = userData.data[0].following.filter(
        (following: Following) => {
          return following.id != Number(user_id);
        },
      );
      otherUserData.data[0].follower = otherUserData.data[0].follower.filter(
        (follower: Following) => {
          return follower.id != id;
        },
      );
      result = await userModel.updateFollowingUser(
        userData.data[0].following,
        id,
        false,
      );
      otherResult = await userModel.updateFollowerUser(
        otherUserData.data[0].follower,
        Number(user_id),
        false,
      );
    } else {
      userData.data[0].following.push({ id: user_id });
      otherUserData.data[0].follower.push({ id });
      result = await userModel.updateFollowingUser(
        userData.data[0].following,
        id,
        true,
      );
      otherResult = await userModel.updateFollowerUser(
        otherUserData.data[0].follower,
        Number(user_id),
        true,
      );
    }
    if (result.success) {
      res.status(SERVER_OK).json(generateResponse(result));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

async function searchUser(req: Request, res: Response) {
  try {
    let { query } = req.query;
    let userResponse: ResponseObject;
    if (!query || query === '') {
      userResponse = {
        success: true,
        data: [],
        message: 'There are no Queries Provided.',
      };
    } else {
      userResponse = await userModel.getUserByQuery(query.toLowerCase());
    }
    if (userResponse.success) {
      res.status(SERVER_OK).json(generateResponse(userResponse));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(userResponse));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
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

async function sendMessage(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id: sender_id } = decoded;
    let { receiver_id } = req.params;
    let { message } = req.body;
    let timestamp = Date.now();
    let chatResponse: ResponseObject = await chatModel.insertChat(
      sender_id,
      Number(receiver_id),
      timestamp,
      message,
    );
    if (chatResponse.success) {
      res.status(SERVER_OK).json(generateResponse(chatResponse));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(chatResponse));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

export default {
  addPost,
  editPost,
  deletePost,
  editProfile,
  addRequest,
  answerRequest,
  followUser,
  searchUser,
  getMessage,
  sendMessage,
};
