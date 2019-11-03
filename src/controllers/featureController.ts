import { Request, Response } from 'express';
import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';
import userModel from '../models/userModel';
import postModel from '../models/postModel';
import { ResponseObject, PostRequestObject } from '../types';
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
    }: PostRequestObject = req.body;
    if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(async (result: any) => {
          let image_url = result.url;
          let timestamp = Date.now();
          let insertResponse: ResponseObject = await postModel.insertPost({
            id: userID,
            image_url,
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
    } else {
      res.status(SERVER_BAD_REQUEST).json(
        generateResponse({
          success: false,
          data: [],
          message: 'Please fill all required fields',
        }),
      );
    }

    let result: ResponseObject = {
      success: true,
      data: [],
      message: '',
    };
    if (result.success) {
      res.status(SERVER_OK).json(generateResponse(result));
    } else {
      res.status(SERVER_BAD_REQUEST).json(generateResponse(result));
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

async function editProfile(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { full_name, phone_number, location, gender } = req.body;
    if (!full_name && !phone_number && !location && !gender && !req.file) {
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
    full_name = full_name ? full_name : user.data.full_name;
    phone_number = phone_number ? phone_number : user.data.phone_number;
    location = location ? location : user.data.location;
    gender = gender ? gender : user.data.gender;

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
    } else {
      let avatar = user.data.avatar;
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
          let image_url = db_result.url;
          let result: ResponseObject = await postModel.updatePost(
            {
              item_name,
              buy_date,
              exp_date,
              category,
              description,
              image_url,
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

export default { editPost, addPost, editProfile };
