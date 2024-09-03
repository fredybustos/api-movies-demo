import express, { json } from 'express';
import { createMoviesRouter } from './app/routes/movies.js';
import { corsMiddleware } from './app/middlewares/cors.js';

export const createApp = ({ movieModel }) => {
  const app = express();
  const PORT = process.env.PORT ?? 3000;
  const movieRouter = createMoviesRouter({ movieModel });

  app.use(json());
  app.use(corsMiddleware());
  app.disable('x-powered-by');

  app.use('/movies', movieRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
};
