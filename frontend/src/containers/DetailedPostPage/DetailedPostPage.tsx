import { FunctionComponent, ReactElement, useEffect } from "react";
import './DetailedPostPage.css';
import { useNavigate, useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store/store";
import { deletePostById, getPostById } from "../../store/posts/posts.slice";
import defaultImage from '../../assets/img/default_img.png'
import DarkButton from "../../components/UI/DarkButton/DarkButton";
import Comment from "../../components/Comment/Comment";
import { getCommentsByPostId } from "../../store/comments/comments.slice";
import AddCommentForm from "../../components/AddCommentForm/AddCommentForm";
import { checkToken } from "../../store/users/users.slice";
import { formatDateTime } from "../../helpers/formatDateTime";

const DetailedPostPage: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { detailedPost, showError, errorMessage } = useSelector((state: AppState) => state.posts, shallowEqual);
    const { comments } = useSelector((state: AppState) => state.comments, shallowEqual);
    const { isAuth, user } = useSelector((state: AppState) => state.users, shallowEqual);
    const params = useParams()

    const deleteIt = (): void => {
        if (isAuth && user?._id === detailedPost.user?._id) {
            dispatch(deletePostById(params.id as string));
            navigate('/');
        };
    };

    useEffect(() => {
        dispatch(checkToken());
        if (params.id) {
            dispatch(getPostById(params.id as string))
            dispatch(getCommentsByPostId(params.id as string))
        };
    }, []);

    return (
        <div className="DetailedPage">
            {showError ? <p className="DetailedPage__error">{errorMessage}</p> : null}
            <div className="DetailedPage__container">
                <div className="DetailedPage__post">
                    <div className="DetailedPage__image_block">
                        {detailedPost.image !== undefined ?
                            <img className="DetailedPage__image"
                                onError={(e) => { e.currentTarget.src = defaultImage }}
                                src={detailedPost.image !== "" ? `${import.meta.env.VITE_BASE_URL}uploads/${detailedPost.image}` : defaultImage} alt={'post-image'}
                            />
                            :
                            <img className="DetailedPage__image" src={defaultImage} alt={defaultImage}
                            />
                        }
                    </div>
                    <div className="DetailedPage__description">
                        <div className="DetailedPage__head">
                            <p className="DetailedPage__author">
                                {formatDateTime(detailedPost.datetime)} by <span className="DetailedPage__author_name">
                                    {detailedPost.user?.username}
                                </span>
                            </p>
                            {isAuth && user?._id === detailedPost.user?._id ?
                                <div className="Post-align-self-start">
                                    <DarkButton click={deleteIt} label={"Delete"} />
                                </div>
                                :
                                null
                            }
                        </div>
                        <h3 className="DetailedPage__title">{detailedPost.title}</h3>
                        <p className="DetailedPage__text">{detailedPost.description}</p>
                    </div>
                </div>
                <div className="CommentsList">
                    <h3 className="DetailedPage__subtitle">Comments:
                        {!comments.length ?
                            <span className="DetailedPage__transparentLetters"> no comments</span>
                            : null
                        }</h3>
                    {comments.length ? comments.map((c, i) => {
                        return <Comment
                            key={c._id}
                            comment={c}
                        />
                    }) : null}
                </div>
                <div className="AddCommentBlock">
                    {isAuth ? <AddCommentForm /> : null}
                </div>
            </div>
        </div>
    );
};

export default DetailedPostPage;