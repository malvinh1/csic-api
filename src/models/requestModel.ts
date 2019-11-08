import { getDB } from '../db';
import { QueryResult } from 'pg';

async function insertRequest(user_id: number, post_id: number) {
  try {
    let db = await getDB();
    let postResult: QueryResult = await db.query(
      'SELECT user_id from posts WHERE id=$1',
      [post_id],
    );
    let insertResult: QueryResult = await db.query(
      'INSERT INTO requests (user_id, requester_id, post_id) VALUES ($1, $2, $3) RETURNING *',
      [postResult.rows[0].user_id, user_id, post_id],
    );
    return {
      success: true,
      data: insertResult.rows,
      message: 'Successfully add a request',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getRequestByRequester_Id(id: number) {
  try {
    let db = await getDB();
    let result: QueryResult = await db.query(
      'SELECT * FROM requests WHERE requester_id = $1',
      [id],
    );
    return {
      success: true,
      data: result.rows,
      message: 'Successfully get requests by requester_id',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getRequestByUser_id(id: number) {
  try {
    let db = await getDB();
    let result: QueryResult = await db.query(
      'SELECT * FROM requests WHERE user_id = $1',
      [id],
    );
    return {
      success: true,
      data: result.rows,
      message: 'Successfully get requests by user_id',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

export default { insertRequest, getRequestByRequester_Id, getRequestByUser_id };
