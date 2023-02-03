import{ Document, model, Schema } from 'mongoose';
import User from './user.interface';
 
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});
 
const userModel = model<User & Document>('User', userSchema);
export default userModel;
