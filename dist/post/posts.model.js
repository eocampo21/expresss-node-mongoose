// import * as mongoose from 'mongoose';
// const mongoose = require('mongoose');
// import * as mongoose from 'mongoose';
import * as mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String,
});
const postModel = mongoose.model('Post', postSchema);
export default postModel;
//# sourceMappingURL=posts.model.js.map