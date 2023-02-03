import express from 'express';
require('dotenv').config({ path: __dirname + '/.env' });

class PostsController {
    constructor() {
        this.path = '/posts';
        this.router = express.Router();
        this.posts = [
           {}
        ];
        this.getAllPosts = (request, response) => {
            console.log(this.posts);
            response.send({});
        };
        this.createAPost = (request, response) => {
            const post = request.body;
            this.posts.push(post);
            response.send(post);
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.post(this.path, this.createAPost);
    }
}
export default PostsController;
//# sourceMappingURL=post.controller.js.map