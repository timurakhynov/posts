import { FunctionComponent, MouseEvent, ReactElement, useEffect } from "react";
import defaultImage from '../../../assets/img/default_img.png'
import { useNavigate } from "react-router-dom";
import './Post.css';
import IPostProps from "./IPostProps";
import { deletePostById, getPosts } from "../../../store/posts/posts.slice";
import { AppDispatch, AppState } from "../../../store/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { checkToken } from "../../../store/users/users.slice";
import XButton from "../../UI/XButton/XButton";
import {formatDateTime} from "../../../helpers/formatDateTime"

const Post: FunctionComponent<IPostProps> = (props: IPostProps): ReactElement => {

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { isAuth, user } = useSelector((state: AppState) => state.users, shallowEqual);

    const cklickHandler = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigate(`/posts/${props._id}`);
    };

    useEffect(() => {
        dispatch(checkToken());
    }, []);

    const deleteIt = (e: MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        if (isAuth && user?._id === props.author_id) {
            dispatch(deletePostById(props._id));
            dispatch(getPosts());
        };
    };

    return (
        <div className="Post-card" onClick={cklickHandler}>
            <div className="Post-card-row">
                <div className="Post-img-box">
                    {props.image !== '' ?
                        <img className="Post-image"
                            onError={(e) => { e.currentTarget.src = defaultImage }}
                            src={`${import.meta.env.VITE_BASE_URL}uploads/${props.image}`} alt={'post-image'}
                        />
                        :
                        <img className="Post-image" src={defaultImage} alt={defaultImage}
                        />
                    }
                </div>
                <div className="Post-description-box">
                    <div className="Post-head-row">
                        <p className='Post-time'>{formatDateTime(props.datetime)}
                            <span className="Post-author">by <span className="Post-uppercase">{props.author}</span></span>
                        </p>
                        {isAuth && user?._id === props.author_id ?
                            <div className="Post-align-self-start">
                                <XButton click={deleteIt} label={"X"} />
                            </div>
                            :
                            null
                        }
                    </div>
                    <p className='Post-count'>Comments: {props.count}</p>
                    <p className='Post-title'>{props.title}</p>
                </div>
            </div>

        </div>
    );
};

export default Post;