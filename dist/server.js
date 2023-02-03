import validateEnv from './utils/validateEnv';
import App from './app';
import PostsController from './post/post.controller';
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: __dirname + '/.env' });
const port = process.env.PORT || 8080;
validateEnv();
const app = new App([
    new PostsController(),
]);
app.listen();
//# sourceMappingURL=server.js.map