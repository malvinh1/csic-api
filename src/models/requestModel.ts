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
      'INSERT INTO requests (user_id, requester_id, post_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [postResult.rows[0].user_id, user_id, post_id, 'Waiting'],
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

async function updateStatus(
  status: string,
  post_id: number,
  requester_id: number,
) {
  try {
    let db = await getDB();
    let result: QueryResult = await db.query(
      'UPDATE requests SET status = $1 WHERE post_id = $2 AND requester_id = $3',
      [status, post_id, requester_id],
    );
    status.toLowerCase() === 'approved'
      ? await db.query(
          'UPDATE requests SET status = $1 WHERE post_id = $2 AND requester_id != $3',
          ['Declined', post_id, requester_id],
        )
      : null;

    return {
      success: true,
      data: result.rows,
      message: 'Successfully update request status',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

export default {
  insertRequest,
  getRequestByRequester_Id,
  getRequestByUser_id,
  updateStatus,
};
