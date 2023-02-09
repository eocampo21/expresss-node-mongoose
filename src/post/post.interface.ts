import User from "../user/user.interface";

interface Post {
    author: User;
    content: string;
    title: string;
}

export default Post;