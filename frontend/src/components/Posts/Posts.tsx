import IPostsProps from './IPostsProps';
import Post from './Post/Post';

const Posts: React.FunctionComponent<IPostsProps> = (props: IPostsProps) => {
    return (
        <>
            {props.posts.map((post) => {
                return <Post
                    key={post._id}
                    _id={post._id}
                    author={post.user.username}
                    author_id={post.user._id}
                    datetime={post.datetime}
                    image={post.image}
                    title={post.title}
                    count={post.count}
                />
            })}
        </>
    );
};

export default Posts;