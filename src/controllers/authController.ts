import { QueryResult } from 'pg';
import { Request, Response } from 'express';

import { isEmail } from 'validator';
import userModel from '../models/userModel';
import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';
import { getDB } from '../db';

async function signUp(req: Request, res: Response) {
  try {
    let {
      email,
      username,
      password,
      full_name,
      telephone,
      location,
    } = req.body;

    if (!email || !username || !password) {
      res.status(SERVER_OK).json({
        success: false,
        data: {},
        message: 'Please fill all required fields',
      });
      return;
    }
    if (!isEmail(email)) {
      res.status(SERVER_OK).json({
        success: false,
        data: {},
        message: 'Email format is wrong',
      });
      return;
    }

    let db = await getDB();
    let user: QueryResult;
    user = await db.query('SELECT * FROM users where email = $1', [email]);
    if (user.rowCount !== 0) {
      res.status(SERVER_OK).json({
        success: false,
        data: {},
        message: 'Email already exist',
      });
    }

    user = await db.query('SELECT * FROM users where username = $1', [
      username,
    ]);
    if (user.rowCount !== 0) {
      res.status(SERVER_OK).json({
        success: false,
        data: {},
        message: 'Username already exist',
      });
    }

    let result = await userModel.userSignUp({
      email,
      username,
      password,
      full_name,
      telephone,
      location,
    });

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

async function signIn(req: Request, res: Response) {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.status(SERVER_OK).json({
        success: false,
        data: {},
        message: 'Please fill all required fields',
      });
      return;
    }

    let result = await userModel.userSignIn({
      username,
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
