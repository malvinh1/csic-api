import { Client } from 'pg';

import { DB_PORT, DB_USER, DB_HOST, DB_NAME, DB_PASSWORD } from './constants';

let db: Promise<Client> | undefined;

async function connect() {
  try {
    let client = new Client({
      user: DB_USER,
      host: DB_HOST,
      database: DB_NAME,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    await client.connect();
    console.log('Database connected!');

    return client;
  } catch (e) {
    console.log(e);
  }
}

export const getDB = async () => {
  if (db === undefined) {
    db = connect();
  }
  return db;
};
