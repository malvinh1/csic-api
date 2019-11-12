import { getDB } from '../db';
import { QueryResult } from 'pg';

async function insertChat(
  sender_id: number,
  receiver_id: number,
  timestamp: number,
  message: string,
) {
  try {
    let db = await getDB();
    let post: QueryResult = await db.query(
      'INSERT INTO chats (sender_id, receiver_id, timestamp, message ) VALUES ($1, $2, $3, $4)',
      [sender_id, receiver_id, timestamp, message],
    );
    return {
      success: true,
      data: post.rows,
      message: 'Successfully insert chat message',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getChatBySenderIDOrReceiverID(
  user_id: number,
  other_id: number,
) {
  try {
    let db = await getDB();
    let post: QueryResult = await db.query(
      'SELECT sender_id, timestamp, message FROM chats where (sender_id = $1 AND receiver_id = $2) OR (sender_id = $3 AND receiver_id = $4 ) ORDER BY timestamp ASC',
      [user_id, other_id, other_id, user_id],
    );
    return {
      success: true,
      data: post.rows,
      message: 'Successfully get chat by user_id',
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: String(e),
    };
  }
}

async function getGroupedChat(user_id: number) {
  try {
    let db = await getDB();
    let post: QueryResult = await db.query(
      'SELECT sender_id, receiver_id FROM chats where sender_id = $1 OR receiver_id = $2 GROUP BY sender_id, receiver_id ',
      [user_id, user_id],
    );
    return {
      success: true,
      data: post.rows,
      message: 'Successfully get chat by user_id',
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
  insertChat,
  getChatBySenderIDOrReceiverID,
  getGroupedChat,
};
