import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  street: String,
  countru: String,
});

const userSchema = new mongoose.Schema(  {
  email: String,
  firstName: String,
  lastName: String,
  address: addressSchema,
  password: String,
  posts: [ // An user could has several posts
    {
      ref: 'Post',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
},);
 
const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
