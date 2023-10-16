import React, { useState } from 'react';
import './AddCommentForm.css'
import ICommentGreateDto from '../../interfaces/ICommentCreateDto';
import { useParams } from 'react-router-dom';
import { AppDispatch, AppState } from '../../store/store';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addComment, clearErrors } from '../../store/comments/comments.slice';
import DarkButton from '../UI/DarkButton/DarkButton';

const AddCommentForm: React.FunctionComponent = (): React.ReactElement => {
    const params = useParams()
    const dispatch: AppDispatch = useDispatch()
    const [comment, setComment] = useState<ICommentGreateDto>({
        post_id: '',
        text: ''
    });
    
    const {showAddError, errorAddMessage } = useSelector((state: AppState) => state.comments, shallowEqual);
    const [count, setCount] = useState(0)
    const textareaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        dispatch(clearErrors)
        setCount(e.target.value.length)
        setComment(prevState => {
            return {
                ...prevState, [e.target.name]: e.target.value,
                post_id: params.id as string
            }
        });
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearErrors())
        dispatch(addComment(comment));
        setComment({
            post_id: '',
            text: ''
        })
    };

    return (
        <form className="AddCommentForm" onSubmit={submitHandler}>
            {showAddError ? <p>Status: {errorAddMessage}</p> : null}
            <div className='AddCommentForm__top'>
                <textarea
                    onChange={textareaHandler}
                    className='AddCommentForm__textarea'
                    placeholder='Write comment'
                    name={'text'}
                    value={comment.text}
                    maxLength={333}
                ></textarea>
            </div>
            <div className='AddCommentForm__bottom'>
                <DarkButton label='Add'></DarkButton>
                <h3 className='AddCommentForm__bottom_text'>New comment</h3>
                <span className='AddCommentForm__count'>{count}/333</span>
            </div>
        </form>
    );
};

export default AddCommentForm;