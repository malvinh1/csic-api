import { QueryResult, Client } from 'pg';

export async function seeder(db: Client) {
  try {
    db.query(
      'create table users(id SERIAL PRIMARY KEY, email varchar(80) UNIQUE, username varchar(50) UNIQUE, full_name varchar(50), password text, telephone varchar(50), location varchar(50), avatar varchar(100), gender varchar(50))',
      (error: Error, results: QueryResult) => {},
    );

    db.query(
      'CREATE TABLE posts(id SERIAL PRIMARY KEY, userid SERIAL REFERENCES users(id), itemname TEXT NOT NULL, imageurl TEXT, buydate DATE, expdate DATE, category VARCHAR(20), description TEXT, available BOOLEAN NOT NULL)',
      (error: Error, results: QueryResult) => {},
    );
  } catch (e) {
    console.log(String(e));
  }
}
