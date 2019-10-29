import { getDB } from '../db';
import { QueryResult } from 'pg';

import { ResponseObject } from '../types';

async function addPost(postObject: any) {
  try {
    let db = await getDB();
  } catch (e) {
    console.log(String(e));
  }
}

async function getPostByUserId(user_id: number) {
  try {
    let db = await getDB();
    let post: QueryResult = await db.query(
      'SELECT * FROM posts where user_id = $1',
      [user_id],
    );
    let response: ResponseObject = {
      success: true,
      data: post.rows,
      message: 'Successfully get post by user_id',
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

export default { addPost, getPostByUserId };
