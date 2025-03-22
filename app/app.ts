import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import welcomeMessage from './middleware/welcome.middleware';
import notFoundMiddleware from './middleware/not-found.middleware';
import errorMiddleware from './middleware/error.middleware';
import health from './middleware/health.middleware';
import LoanApplicationRoute from './component/loan-application/loan-application.route';
import { ENVIRONMENT } from './config/secrets';

dotenv.config();

class App {
  public app: express.Application;

  public loanApplicationRoute: LoanApplicationRoute =
    new LoanApplicationRoute();

  constructor() {
    this.app = express();
    this.config();
    this.loanApplicationRoute.routes(this.app);
    this.app.disable('x-powered-by');
    this.app.set('trust proxy', true);
    this.app.get('/', welcomeMessage);
    this.app.get('/health', health);
    this.app.get('*', notFoundMiddleware);
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }

  private config = (): void => {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    if (ENVIRONMENT === 'production') {
      morganBody(this.app, {
        logAllReqHeader: false,
        maxBodyLength: 5000,
        logResponseBody: false,
      });
    }
  };
}

export default new App().app;
