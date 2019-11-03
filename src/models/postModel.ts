import { getDB } from '../db';
import { QueryResult } from 'pg';
import { ResponseObject, PostRequestObject } from '../types';

async function insertPost(
  postObject: {
    id: string;
    image_url: string;
    timestamp: number;
  } & PostRequestObject,
) {
  try {
    let {
      id,
      item_name,
      image_url,
      buy_date,
      exp_date,
      category,
      description,
      tag,
      timestamp,
    } = postObject;
    let db = await getDB();
    let valueQuery = [
      id,
      item_name,
      image_url,
      buy_date,
      exp_date,
      category,
      description,
      tag,
      timestamp,
    ];

    let insertResult: QueryResult = await db.query(
      'INSERT INTO posts (user_id, item_name, image_url, buy_date, exp_date, category, description, tag, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
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
    return {
      success: true,
      data: post.rows,
      message: 'Successfully get post by user_id',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getPostById(post_id: number) {
  try {
    let db = await getDB();
    let post: QueryResult = await db.query(
      'SELECT * FROM posts where id = $1',
      [post_id],
    );
    return {
      success: true,
      data: post.rows[0],
      message: 'Successfully get post by post_id',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function updatePost(
  editReq: { image_url?: string } & PostRequestObject,
  postId: number,
) {
  try {
    let db = await getDB();
    let {
      item_name,
      buy_date,
      exp_date,
      category,
      description,
      image_url,
      tag,
    } = editReq;
    let postData: QueryResult;
    if (image_url) {
      postData = await db.query(
        'UPDATE posts SET item_name=$1, buy_date=$2, exp_date=$3, category=$4, description=$5, tag=$6, image_url=$7 WHERE id=$8 RETURNING *',
        [
          item_name,
          buy_date,
          exp_date,
          category,
          description,
          tag,
          image_url,
          postId,
        ],
      );
    } else {
      postData = await db.query(
        'UPDATE posts SET item_name=$1, buy_date=$2, exp_date=$3, category=$4, description=$5, tag=$6 WHERE id=$7 RETURNING *',
        [item_name, buy_date, exp_date, category, description, tag, postId],
      );
    }
    return {
      success: true,
      data: postData.rows[0],
      message: 'User post has been changed',
    };
  } catch (e) {
    return { success: false, data: [], message: String(e) };
  }
}

export default { insertPost, getPostByUserId, getPostById, updatePost };
