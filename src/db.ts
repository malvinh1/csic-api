import { Client } from 'pg';

import { DB_PORT, USER, HOST, DATABASE_NAME, PASSWORD } from './constants';

let db: Promise<Client> | undefined;

async function connect() {
  try {
    let client = new Client({
      user: USER,
      host: HOST,
      database: DATABASE_NAME,
      password: PASSWORD,
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
