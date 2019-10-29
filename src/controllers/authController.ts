import { Request, Response } from 'express';
import { isEmail } from 'validator';
import userModel from '../models/userModel';
import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';
import { uploader } from 'cloudinary';
import { generateResponse, dataUri } from '../helpers';

async function signUp(req: Request, res: Response) {
  try {
    let { email, username, password, fullName, telephone, location } = req.body;
    if (!email || !username || !password) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'Please fill all required fields',
      });
      return;
    }
    if (!isEmail(email)) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'Email format is wrong',
      });
      return;
    }

    let userResponse = await userModel.getUserByEmail(email);
    if (userResponse.data.rows.length !== 0) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'Email already exist',
      });
    }

    userResponse = await userModel.getUserByUsername(username);
    if (userResponse.data.rows.length !== 0) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'Username already exist',
      });
    }

    if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(async (result: any) => {
          let avatar = result.url;
          let userResponse = await userModel.userSignUp({
            email,
            username,
            password,
            fullName,
            telephone,
            location,
            avatar,
          });

          if (userResponse.success) {
            res.status(SERVER_OK).json(generateResponse(userResponse));
          } else {
            res.status(SERVER_BAD_REQUEST).json(generateResponse(userResponse));
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
      let userResponse = await userModel.userSignUp({
        email,
        username,
        password,
        fullName,
        telephone,
        location,
        avatar: null,
      });

      if (userResponse.success) {
        res.status(SERVER_OK).json(generateResponse(userResponse));
      } else {
        res.status(SERVER_BAD_REQUEST).json(generateResponse(userResponse));
      }
    }
    return;
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

async function signIn(req: Request, res: Response) {
  try {
    let { credential, password } = req.body;

    if (!credential || !password) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'Please fill all required fields',
      });
      return;
    }

    let result = await userModel.userSignIn({
      credential,
      password,
    });

    res.send(result);

    return;
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

export default { signUp, signIn };
