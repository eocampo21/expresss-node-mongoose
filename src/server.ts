import validateEnv from './utils/validateEnv';
import App from './app';
import PostsController from './post/post.controller';
import AuthenticationController from './authentication/authentication.controller';
import UserController from './user/user.controller';

require('dotenv').config({path: __dirname + '/.env'});


validateEnv();
 
const app = new App(
  [
    new PostsController(),
    new AuthenticationController(),
    new UserController(),
  ],
);
 
app.listen();
 