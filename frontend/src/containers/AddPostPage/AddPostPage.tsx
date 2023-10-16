import React, { ChangeEvent, useRef, useState } from "react";
import './AddPostPage.css';
import { useNavigate } from "react-router-dom";
import { AppDispatch, AppState } from "../../store/store";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import DarkButton from "../../components/UI/DarkButton/DarkButton";
import { addPost, clearErrors, getPosts } from "../../store/posts/posts.slice";
import IPostCreateDto from "../../interfaces/IPostCreateDto";
import IFileInput from "../../interfaces/IFileInput";

const AddPostPage: React.FunctionComponent = (): React.ReactElement => {
    const navigate = useNavigate();
    const fileInput = useRef(null)
    const dispatch: AppDispatch = useDispatch();
    const { showAddError, errorAddMessage } = useSelector((state: AppState) => state.posts, shallowEqual);
    const [imageDescriptionErrorMessage, setImageDescriptionErrorMessage] = useState<string>('');
    const [TitleErrorMessage, setTitleErrorMessage] = useState<string>('');
    const [inputValues, setInputValues] = useState<IPostCreateDto>({
        title: '',
        description: '',
        image: undefined
    });

    const [fileName, setFileName] = useState<string>('')
    const inputHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        dispatch(clearErrors());
        e.target.name === 'title' ? setTitleErrorMessage('') : setImageDescriptionErrorMessage('')
        setInputValues(prevState => {
            return {...prevState, [e.target.name]: e.target.value}
        });
    };

    const inputFileHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setImageDescriptionErrorMessage('')
        const file = e.target.files && e.target.files[0]
        if (file) {
            if(file && /\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
                setInputValues(prevState => {
                    return {...prevState, 
                        image: e.target.files ? e.target.files[0] : undefined}
                })
                setFileName(e.target.files && e.target.files[0] ? e.target.files[0].name : '')
            } else {
                alert('Please select a valid image file (jpg, jpeg, png or gif)')
            };
        };
    };

    const cancelFileHandler = () => {
        const inputCurrent = fileInput.current! as IFileInput
        inputCurrent.value = ''
        setFileName('');
        setInputValues(prevState => {
            return {...prevState, 
                image: undefined}
        });
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValues.title.trim() === '') {
            setTitleErrorMessage('Title is required!')
            return;
        };
        if ((!inputValues.description || inputValues.description.trim() === '') && !inputValues.image) {
            setImageDescriptionErrorMessage('Description cannot be empty if no picture is added!')
            return;
        };
        const formData = new FormData()
        Object.entries(inputValues).forEach(entry => {
            const [key, value] = entry;
            formData.append(key, value)
        })
        dispatch(addPost(formData));
        dispatch(getPosts());
        navigate('/');
    };

    return (
        <div className="AddPostPage-container">
            <div className="AddPostPage-background AddPostPage-flex-row">
                <div className="AddPostPage">
                    <h2 className="AddPostPage-title">Add new post:</h2>
                    <div className="AddPostPage-form-column">
                        {showAddError ? <p className='AddPostPage-error-text'>{errorAddMessage}</p> : null}
                        <form onSubmit={submitHandler} className="">
                            <div className="AddPostPage-form-box">
                                <label className="AddPostPage-label" htmlFor='title'>Title:</label>
                                <p className='AddPostPage-error-text'>{TitleErrorMessage}</p>
                                <input className={'AddPostPage-input'}
                                    type="text"
                                    onChange={inputHandler}
                                    name={'title'}
                                    value={inputValues.title}
                                />
                                <label className="AddPostPage-label" htmlFor='description'>Description:</label>
                                <p className='AddPostPage-error-text'>{imageDescriptionErrorMessage}</p>
                                <textarea
                                    className="AddPostPage-input AddPostPage-textarea"
                                    name="description"
                                    onChange={inputHandler}
                                    value={inputValues.description}
                                />
                                <div className="AddPostPage-fileInput-label-div">
                                    <label className='AddPostPage-fileInput-label'>
                                        <input
                                            className='AddPostPage-fileInput'
                                            type="file"
                                            name={'image'}
                                            onChange={inputFileHandler}
                                            ref={fileInput}
                                        />
                                        <p className="AddPostPage-fileInput-button">
                                            Choose file
                                        </p>
                                    </label>
                                    <span className="AddPostPage-fileInput-filename">{fileName}</span>
                                    {fileName && (
                                        <h5 className="AddPostPage-fileInput-button-cancel" onClick={cancelFileHandler}>
                                            Cancel
                                        </h5>
                                    )}
                                </div>
                                <DarkButton
                                    label={'Create post'}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPostPage