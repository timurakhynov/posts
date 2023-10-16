import { FunctionComponent, ReactElement } from "react";
import ICommentProps from "./ICommentProps";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store/store";
import { deleteCommentById } from "../../store/comments/comments.slice";
import DarkButton from "../UI/DarkButton/DarkButton";
import './Comment.css'
import {formatDateTime} from "../../helpers/formatDateTime";

const Comment: FunctionComponent<ICommentProps> = (props: ICommentProps): ReactElement => {
    const dispatch: AppDispatch = useDispatch();
    const { isAuth, user } = useSelector((state: AppState) => state.users, shallowEqual);
    
    const deleteIt = (id: string): void => {
        if (isAuth && String(props.comment.user_id) === user?._id  || props.comment.user_id._id === user?._id) {
            dispatch(deleteCommentById(id));
        };
    };
    
    return (
        <div className="Comment">
            <div className="Comment_top">
                <p className='Comment__author'>
                    {formatDateTime(props.comment.datetime)} by <b className="Comment_accent">
                        {props.comment.user_id.username ? props.comment.user_id.username : user?.username}
                    </b>
                </p>
                {isAuth && String(props.comment.user_id) === user?._id 
                || props.comment.user_id._id === user?._id 
                ?
                    <div className="Post-align-self-start">
                        <DarkButton click={() => deleteIt(props.comment._id)} label={"X"} />
                    </div>
                    :
                    null
                }
            </div>
            <div className="Comment_bottom">
                <p className="Comment_text">{props.comment.text}</p>
            </div>
        </div>
    );
};

export default Comment;