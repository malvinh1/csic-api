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
      itemName,
      buyDate,
      expDate,
      category,
      description,
      tag,
    }: PostRequestObject = req.body;
    if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(async (result: any) => {
          let imageUrl = result.url;
          let insertResponse: ResponseObject = await postModel.insertPost({
            id: userID,
            imageUrl,
            itemName,
            buyDate,
            expDate,
            category,
            description,
            tag,
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
            message: 'someting went wrong while processing your request',
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
    let { full_name, telephone, location, gender } = req.body;
    if (!full_name && !telephone && !location && !gender && !req.file) {
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
    telephone = telephone ? telephone : user.data.telephone;
    location = location ? location : user.data.location;
    gender = gender ? gender : user.data.gender;

    if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(async (db_result: any) => {
          let avatar = db_result.url;
          let result: ResponseObject = await userModel.updateUser(
            { full_name, telephone, location, avatar, gender },
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
        { full_name, telephone, location, avatar, gender },
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

export default { addPost, editProfile };
