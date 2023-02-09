import {Router, Request, Response, NextFunction} from 'express';

import postModel from './post.model';
import PostNotFoundException from '../exceptions/postNotFoundException';
import validationMiddleware from '../middlerware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middlerware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../user/user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';
 
class PostsController {
  public path = '/post';
  public router: Router = Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .get(this.path, this.getAllPosts)
      .get(`${this.path}/:id` , this.getPostById)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, validationMiddleware(CreatePostDto), this.createAPost);
  }
 
  private getAllPosts = async (request: Request, response: Response) => {
    const posts = await postModel.find()
      .populate('author', '-password');
    response.send(posts);
  }
 
  private createAPost = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const userId = request?.user?._id.toString() || '';
    console.log('CreateAPost',userId);

    // Create post
    const postData: CreatePostDto = request.body;
    const createdPost = new postModel({
      ...postData,
      author: userId,
    });

    try {
      // Append to the user the post
      const user = await userModel.findById({_id: userId});
      console.log('Search user');

      if (user) {
        console.log('User found');
        user.posts = [...user.posts, createdPost._id];
        await user.save();
        const savedPost = await createdPost.save();
        await savedPost.populate('author', '-password');
        
        // Post returned
        response.send(savedPost);
      } else {
        console.log('User not found');
        next(new UserNotFoundException(userId || ''));
      }
    } catch (error) {
      console.log('User not found');
      next(new UserNotFoundException(userId || ''));
    }
  }

  private getPostById = async(request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const post = await postModel.findById(id);
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }

  private deletePost = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const successResponse = await postModel.findByIdAndDelete(id);
    if (successResponse) {
      response.send({message: 'Post deleted', status: 200});
    } else {
      next(new PostNotFoundException(id));
    }
  }

  private modifyPost = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const postData: CreatePostDto = request.body;
    const post = await postModel.findByIdAndUpdate(id, postData, { new: true });
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }
}
 
export default PostsController;