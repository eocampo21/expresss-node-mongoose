import Post from "../post/post.interface";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    password: string | undefined;
    posts: Post[];
    address?: {
      street: string,
      city: string,
      country: string,
    };
}
export default User;