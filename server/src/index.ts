import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'online', 
    message: 'Studbyro API е готов за работа!' 
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Възникна грешка в сървъра.'
  });
});

app.listen(PORT, () => {
  console.log(`[server]: Близнака пусна сървъра на http://localhost:${PORT}`);
});