import { FunctionComponent, ReactElement, useEffect } from "react";
import { AppDispatch, AppState } from "../../store/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import './PostsPage.css';
import { getPosts } from "../../store/posts/posts.slice";
import Posts from "../../components/Posts/Posts";

const PostsPage: FunctionComponent = (): ReactElement => {

    const dispatch: AppDispatch = useDispatch();    
    const { posts, showError, errorMessage } = useSelector((state: AppState) => state.posts, shallowEqual);

    useEffect(() => {
        dispatch(getPosts());
    }, [posts]);

    return (
        <div className="PostsPage-container">
            <div className="PostsPage-background PostsPage-flex-row">
                <div className="PostsPage-column">
                    <h2 className="PostsPage-title">Posts:</h2>
                    {showError ? <p className='PostsPage-error-text'>{errorMessage}</p> : null}
                    {posts === undefined || !posts.length ?
                        <p className='PostsPage-error-text'>No posts</p>
                        :
                        <Posts posts={posts} />
                    }
                </div>
            </div>
        </div>
    );
};

export default PostsPage;