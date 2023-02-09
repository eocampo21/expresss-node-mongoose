import { Router, Request, Response, NextFunction } from 'express';

import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../../src/middlerware/auth.middleware';
import postModel from '../post/post.model';
import userModel from './user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import User from './user.interface';

class UserController implements Controller {
  public path = '/users';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .get(`${this.path}/:id`, this.getUserById)
      .get(`${this.path}/:id/post`, this.getAllPostsOfUser);
  }

  private getUserById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const userQuery = userModel.findById(id);
    if (request.query.withPosts === 'true') {
      userQuery.populate('posts').exec();
    }
    const user = await userQuery;
    if (user) {
      response.send(user);
    } else {
      next(new UserNotFoundException(id));
    }
  }

  private getAllPostsOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const userId = request.params.id;
    const partialUser: Partial<User> = {
      _id: request?.user?._id
    };

    if (userId == partialUser._id) {
      const posts = await postModel.find({ author: userId });
      response.send(posts);
    } else {
      next(new NotAuthorizedException());
    }
  }
}

export default UserController;