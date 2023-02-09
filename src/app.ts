import Controller from "./interfaces/controller.interface";
import cookieParser from 'cookie-parser';  
import express from 'express';
import bodyParser from "body-parser";
import MongoConnection from "./utils/mongoConnection";
import errorMiddleware from "./middlerware/error.middleware";
import 'reflect-metadata';

require('dotenv').config({path: __dirname + '/.env'});

const {
  PORT = '8080',
} = process.env;

class App {
  private app = express();
  private mongoConnection = new MongoConnection();
 
  constructor(controllers: Controller[]) {
    this.app = express();

    this.mongoConnection.init();
    this.initializeMiddlewares();
    this.initializeErrorHandling();
    this.initializeControllers(controllers);
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
 
  private initializeControllers(controllers:Controller[]) {
    controllers.forEach((controller:Controller) => {
      this.app.use('/', controller.router);
    });
  }
 
  public listen() {
    this.app.listen(PORT, () => {
      console.log(`App listening on ${PORT}`);
    });
  }
}
 
export default App;