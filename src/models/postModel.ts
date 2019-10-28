import { getDB } from '../db';
import { QueryResult } from 'pg';
import { ResponseObject, PostRequestObject } from '../types';

async function insertPost(
  postObject: { id: string; imageUrl: string } & PostRequestObject,
) {
  try {
    let {
      id,
      itemName,
      imageUrl,
      buyDate,
      expDate,
      category,
      description,
      tag,
    } = postObject;
    let db = await getDB();
    let valueQuery = [
      id,
      itemName,
      imageUrl,
      buyDate,
      expDate,
      category,
      description,
      tag,
    ];

    let insertResult: QueryResult = await db.query(
      'INSERT INTO posts (user_id, item_name, image_url, buy_date, exp_date, category, description, tag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      valueQuery,
    );

    return {
      success: true,
      data: insertResult.rows,
      message: 'Successfully insert a Post!',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
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

export default { insertPost, getPostByUserId };
