import { Pool } from 'pg';

import {
  DB_PORT,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DATABASE_URL,
} from './constants';

let db: Promise<Pool> | undefined;

const connectionString = DATABASE_URL;

let localConfig = {
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
};

async function connect() {
  try {
    let client = new Pool(
      // comment this if you want to use heroku database <------
      // localConfig,

      //comment this if you want to use localhost database <------
      {
        connectionString,
        ssl: true,
      },
    );
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
