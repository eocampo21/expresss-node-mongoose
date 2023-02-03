import Post from './post.interface';

import {Router, Request, Response, NextFunction} from 'express';
import postModel from './post.model';
import PostNotFoundException from '../exceptions/postNotFoundException';
import validationMiddleware from '../middlerware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middlerware/auth.middleware';

 
class PostsController {
  public path = '/post';
  public router: Router = Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get('/post', this.getAllPosts);
    this.router.get(`/post/:id`, this.getPostById);
    this.router.post(`/post`,authMiddleware, this.createAPost);
  }
 
  getAllPosts(request: Request, response: Response) {
    postModel.find()
      .then((posts) => {
        console.log("getAllPosts");
        response.json(posts);
      });
  }
 
  createAPost = (request: Request, response: Response) => {
    const postData: Post = request.body;
    const createdPost = new postModel(postData);
    createdPost.save()
    .then((savedPost) => {
        console.log("createAPost");
        response.send(savedPost);
    });
  }

  getPostById(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    postModel.findById(id)
      .then((post) => {
        console.log("getPostById");
        if (post) response.send(post);

        next(new PostNotFoundException(id));
      });
  }

  deletePost = (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    postModel.findByIdAndDelete(id)
      .then((successResponse) => {
        console.log("deletePost");
        if (successResponse)  response.send(200)

          next(new PostNotFoundException(id));
      });
  }
}
 
export default PostsController;