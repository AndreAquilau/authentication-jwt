import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import routes from '../routes/index';
import path from 'path';
import jwt from '../middlewares/tokenAuthenticate';
import tokenAuthenticate from '../middlewares/tokenAuthenticate';

class App {
  app: Application;
  constructor() {
    this.app = express();
    this.middlewares();
    this.useRoutes();
  }

  middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
    this.app.use(`/${process.env.FILES_STATIC}`, tokenAuthenticate);
    this.app.use(
      `/${process.env.FILES_STATIC}`,
      express.static(
        path.resolve(__dirname, '..', '..', process.env.FILES_STATIC),
      ),
    );
  }

  useRoutes() {
    this.app.use(routes);
  }
}

export default new App().app;
