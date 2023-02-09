import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction, Router } from 'express';

import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middlerware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import userModel from './../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';
require('dotenv').config({path: __dirname + '/.env'});

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  public authenticationService = new AuthenticationService();
  private userModel = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .post(`${this.path}/register`,  validationMiddleware(CreateUserDto), this.registration)
      .post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn)
      .post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: Request, response: Response, next: NextFunction) => {
    const userData: CreateUserDto = request.body;
    try {
      const { user } = await this.authenticationService.register(userData);
      console.log("User ", user);
      const tokenData = this.authenticationService.createToken(user);
      console.log("Save jwt in cookie");
      response
        // Set token in jwt cookie
        .cookie("jwt", tokenData , {secure: true, httpOnly: true})
        .send({message: 'Register ok', status: 200});

    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: LogInDto = request.body;
    const user = await this.userModel.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.get('password', null, { getters: false }),
      );
      if (isPasswordMatching) {
        console.log("User found");
        user.password = undefined;
        const tokenData = this.authenticationService.createToken(user);
        response
          .cookie("jwt", tokenData , {secure: true, httpOnly: true})
          .send({message: 'Login ok', status: 200})
      } 
      else {
        console.log("User Not found");
        next(new WrongCredentialsException());
      }
    } else {
      console.log("Credential missin found");
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = async (request: Request, response: Response) => {
    response.cookie('jwt', 'Authorization=;Max-age=0');
    response.send({message: 'Loggout ok', status: 200});
  }
}

export default AuthenticationController;