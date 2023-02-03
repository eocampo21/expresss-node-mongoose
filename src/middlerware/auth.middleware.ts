import { NextFunction, Response } from 'express';
import jwt from "jsonwebtoken"
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../user/user.model';
require('dotenv').config({path: __dirname + '/.env'});

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  // response.setHeader('jwt', ['Authorization=;Max-age=0']);
  let {token} = request.cookies.jwt;
  console.log("token ", token);
  if (token) {
      const secret = process.env.JWT_SECRET || '';
      try {
        const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
        const id = verificationResponse._id;
        const user = await userModel.findById(id);
        if (user) {
          request.user = user;
          next();
        } else {
          next(new WrongAuthenticationTokenException());
        }
      } catch (error) {
        next(new WrongAuthenticationTokenException());
      }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;