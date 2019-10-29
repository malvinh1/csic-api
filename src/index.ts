import express from 'express';
import bodyParser from 'body-parser';
import apiRouter from './routes';

import { SERVER_PORT, SERVER_OK } from './constants';
import { getDB } from './db';
import { seeder } from './seeder';
import { cloudinaryConfig } from './cloudinarySetup';
import cors from 'cors';

const app: express.Application = express();

async function serverSetup() {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.locals.db = await getDB();
  await seeder(app.locals.db);
  app.use('*', cloudinaryConfig);
  app.get('/', (req, res) => {
    res.status(SERVER_OK);
    res.send('Welcome Home.');
  });
  app.use('/api', apiRouter);
  app.on('listening', function() {
    console.log('server is running');
  });
  app.listen(SERVER_PORT, () => {
    console.log(`App is listening on http://127.0.0.1:${SERVER_PORT}`);
  });
}

serverSetup();
