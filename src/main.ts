import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import apiRouter from './routers';

import { getDB } from './db';
import { QueryResult } from 'pg';
import { SERVER_PORT } from './constants';

const app: express.Application = express();

async function serverSetup() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.locals.db = await getDB();

  await app.locals.db.query(
    'create table users(ID SERIAL PRIMARY KEY, email varchar(80) UNIQUE, username varchar(50) UNIQUE, full_name varchar(50), password text, telephone varchar(50), location varchar(50), avatar varchar(100), gender varchar(50))',
    (error: Error, results: QueryResult) => {},
  );

  app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

  app.use('/api', apiRouter);

  app.listen(SERVER_PORT, () => {
    console.log(`App is listening on http://127.0.0.1:${SERVER_PORT}`);
  });
}

serverSetup();
