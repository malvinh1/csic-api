import { QueryResult } from 'pg';
import sjcl from 'sjcl';
import jwt from 'jsonwebtoken';

import { getDB } from '../db';
import {
  UserSignUp,
  UserSignIn,
  ResponseObject,
  ReqEditProfileObject,
} from '../types';
import { API_SECRET } from '../constants';

async function userSignUp(userObject: UserSignUp) {
  try {
    let db = await getDB();
    let {
      email,
      username,
      fullName,
      telephone,
      location,
      password,
      avatar,
    } = userObject;

    let hash = sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash(password + 'CSIC'),
    );

    let encrypted = sjcl.encrypt('CSIC', hash);

    let values = [
      email,
      username,
      fullName,
      encrypted,
      telephone,
      location,
      avatar,
      'Other',
    ];

    let result: QueryResult = await db.query(
      'INSERT INTO users (email, username, full_name, password, telephone, location, avatar, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      values,
    );

    let { id } = result.rows[0];
    let token = jwt.sign({ id }, API_SECRET);
    {
      let {
        id,
        email,
        username,
        full_name: fullName,
        telephone,
        location,
        avatar,
      } = result.rows[0];
      return {
        success: true,
        data: [id, email, username, fullName, telephone, location, avatar],
        message: `User ${fullName} has been added`,
        token: token,
      };
    }
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function userSignIn(userObject: UserSignIn) {
  try {
    let db = await getDB();
    let { credential, password } = userObject;

    let hash = sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash(password + 'CSIC'),
    );
    let userResultEmail = await db.query(
      'SELECT * FROM users where email = $1',
      [credential],
    );

    let userResultUsername = await db.query(
      'SELECT * FROM users where username = $1',
      [credential],
    );

    if (userResultEmail.rows[0]) {
      let decrypted = sjcl.decrypt('CSIC', userResultEmail.rows[0].password);
      if (hash === decrypted) {
        let { id } = userResultEmail.rows[0];

        let token = jwt.sign({ id }, API_SECRET);
        {
          let {
            id,
            email,
            username,
            full_name: fullName,
            telephone,
            location,
            avatar,
          } = userResultEmail.rows[0];
          return {
            success: true,
            data: [id, email, username, fullName, telephone, location, avatar],
            message: 'Login Success',
            token: token,
          };
        }
      }
    }
    if (userResultUsername.rows[0]) {
      let decrypted = sjcl.decrypt('CSIC', userResultUsername.rows[0].password);
      if (hash === decrypted) {
        let { id } = userResultUsername.rows[0];

        let token = jwt.sign({ id }, API_SECRET);
        {
          let {
            id,
            email,
            username,
            full_name: fullName,
            telephone,
            location,
            avatar,
          } = userResultUsername.rows[0];
          return {
            success: true,
            data: [id, email, username, fullName, telephone, location, avatar],
            message: 'Login Success',
            token: token,
          };
        }
      }
    } else {
      return {
        success: false,
        data: [],
        message: 'Incorrect email or password.',
      };
    }
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getUserByEmail(email: string) {
  try {
    let db = await getDB();
    let user: QueryResult = await db.query(
      'SELECT * FROM users where email = $1',
      [email],
    );
    let response: ResponseObject = {
      success: true,
      data: user,
      message: 'Successfully get user by its email',
    };
    return response;
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getUserByUsername(username: string) {
  try {
    let db = await getDB();
    let user: QueryResult = await db.query(
      'SELECT * FROM users where username = $1',
      [username],
    );
    let response: ResponseObject = {
      success: true,
      data: user,
      message: 'Successfully get user by its email',
    };
    return response;
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getUserById(id: number) {
  try {
    let db = await getDB();
    let user: QueryResult = await db.query(
      'SELECT * FROM users where id = $1',
      [id],
    );
    delete user.rows[0].password;
    let response: ResponseObject = {
      success: true,
      data: user.rows[0],
      message: 'Successfully get user by Id',
    };
    return response;
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function updateUser(editReq: ReqEditProfileObject, id: number) {
  try {
    let db = await getDB();
    let { full_name, telephone, location, avatar, gender } = editReq;
    await db.query(
      'UPDATE users SET full_name = $1, telephone = $2, location = $3, avatar = $4, gender = $5 WHERE id=$6',
      [full_name, telephone, location, avatar, gender, id],
    );
    let userData = await getUserById(id);
    return {
      success: true,
      data: userData.data,
      message: 'User profile has been changed',
    };
  } catch (e) {
    return { success: false, data: [], message: String(e) };
  }
}

export default {
  userSignUp,
  userSignIn,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  updateUser,
};
