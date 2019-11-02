import { QueryResult } from 'pg';
import sjcl from 'sjcl';
import jwt from 'jsonwebtoken';

import { getDB } from '../db';
import { UserSignUp, UserSignIn, ReqEditProfileObject } from '../types';
import { API_SECRET } from '../constants';

async function userSignUp(userObject: UserSignUp) {
  try {
    let db = await getDB();
    let {
      email,
      username,
      full_name,
      phone_number,
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
      full_name,
      encrypted,
      phone_number,
      location,
      avatar,
      'Other',
      [],
      [],
    ];

    let result: QueryResult = await db.query(
      'INSERT INTO users (email, username, full_name, password, phone_number, location, avatar, gender, following, follower) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      values,
    );

    let { id } = result.rows[0];
    delete result.rows[0].password;
    let token = jwt.sign({ id }, API_SECRET);
    {
      return {
        success: true,
        data: result.rows,
        message: `User ${full_name} has been added`,
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
        delete userResultEmail.rows[0].password;
        let token = jwt.sign({ id }, API_SECRET);
        {
          return {
            success: true,
            data: userResultEmail.rows,
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
        delete userResultUsername.rows[0].password;
        let token = jwt.sign({ id }, API_SECRET);
        return {
          success: true,
          data: userResultUsername.rows,
          message: 'Login Success',
          token: token,
        };
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
    return {
      success: true,
      data: user.rows,
      message: 'Successfully get user by its email',
    };
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
    return {
      success: true,
      data: user.rows,
      message: 'Successfully get user by its email',
    };
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
    return {
      success: true,
      data: user.rows,
      message: 'Successfully get user by Id',
    };
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
    let { full_name, phone_number, location, avatar, gender } = editReq;
    await db.query(
      'UPDATE users SET full_name = $1, phone_number = $2, location = $3, avatar = $4, gender = $5 WHERE id=$6',
      [full_name, phone_number, location, avatar, gender, id],
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
