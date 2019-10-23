import jwt from 'jsonwebtoken';
import { API_SECRET } from './constants';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

let checkToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.toString().startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token.toString(), API_SECRET, (err, decoded) => {
        if (err) {
          if (
            err.message === 'invalid signature' ||
            err.message === 'invalid token'
          ) {
            return res.json({
              success: false,
              data: {},
              message: 'Token is not valid',
            });
          } else if (err.message === 'jwt expired') {
            return res.json({
              success: false,
              data: {},
              message: 'Token is expired',
            });
          }
        } else {
          (<any>req).decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        data: {},
        message: 'Auth token is not supplied',
      });
    }
  } catch (e) {
    return res.json({
      success: false,
      data: {},
      message: 'Token is not valid',
    });
  }
};

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');

export default { checkToken, multerUploads };
