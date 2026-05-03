

import express, { Express, Request, Response, NextFunction } from 'express';
import { router } from './routes';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';


export const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'online', 
    message: 'Studbyro API е готов за работа!' 
  });
});


app.use(errorHandler);
