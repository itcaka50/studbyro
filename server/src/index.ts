import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import knexConfig from '../knexfile';
import { Model } from 'objection';
import Knex from 'knex';

import routes from './routes/index';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;

const environment = process.env.NODE_ENV || 'development';
const knexInstance = Knex(knexConfig);
Model.knex(knexInstance);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Сървърът стартира на порт: ${port}`);
    console.log(`Околна среда: [${environment.toUpperCase()}]`);
});
