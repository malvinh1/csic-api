import { QueryResult, Pool } from 'pg';

export async function seeder(db: Pool) {
  try {
    db.query(
      'create table users(id SERIAL PRIMARY KEY, email varchar(80) UNIQUE, username varchar(50) UNIQUE, full_name varchar(50), password text, phone_number varchar(50), location varchar(50), avatar varchar(100), gender varchar(50), following TEXT[], follower TEXT[])',
      (error: Error, results: QueryResult) => {},
    );

    db.query(
      'CREATE TABLE posts(id SERIAL PRIMARY KEY, user_id SERIAL REFERENCES users(id), item_name TEXT NOT NULL, image_url TEXT, buy_date DATE, exp_date DATE, category VARCHAR(20), description TEXT, tag VARCHAR(20) NOT NULL, timestamp bigint)',
      (error: Error, results: QueryResult) => {},
    );

    db.query(
      'CREATE TABLE requests(id SERIAL PRIMARY KEY, user_id SERIAL REFERENCES users(id), requester_id SERIAL REFERENCES users(id), post_id SERIAL REFERENCES posts(id))',
      (error: Error, results: QueryResult) => {},
    );
  } catch (e) {
    console.log(String(e));
  }
}
