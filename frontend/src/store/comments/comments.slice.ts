import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../createAppAsyncThunc';
import { commentsApi } from '../../api/commentsApi';
import ICommentsState from './ICommentsState';
import ICommentWithUser from '../../interfaces/ICommentWithUser';
import ICommentGreateDto from '../../interfaces/ICommentCreateDto';

const namespace = 'comments';

export const getCommentsByPostId = createAppAsyncThunk(
    `${namespace}/getCommentsByPostId`,
    async (postID: string) => {
        return commentsApi.getCommentsByPostId(postID)
    }
);

export const addComment = createAppAsyncThunk(
    `${namespace}/addComment`,
    async (comment: ICommentGreateDto) => {
        return commentsApi.addComment(comment)
    }
);

export const deleteCommentById = createAppAsyncThunk(
    `${namespace}/deleteCommentById`,
    async (id: string) => {
        return commentsApi.deleteCommentById(id)
    }
);

export const commentsSlice = createSlice({
    name: namespace,
    initialState: {
        comments: [] as ICommentWithUser[],
        showError: false,
        errorMessage: '',
        showAddError: false,
        errorAddMessage: ''
    } as ICommentsState,
    reducers: {
        clearErrors(state) {
            state.errorMessage = '';
            state.showError = false;
            state.showAddError = false;
            state.errorAddMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCommentsByPostId.rejected, (state) => {
                state.showError = true;
                state.errorMessage = 'Connection error';
            })
            .addCase(getCommentsByPostId.fulfilled, (state, action) => {
                if (action.payload.status === 1) {
                    const result = action.payload.result as ICommentWithUser[]
                    state.comments = result;
                } else {
                    state.showError = true;
                    state.errorMessage = action.payload.message;
                };
            })
            .addCase(addComment.rejected, (state) => {
                state.showError = true;
                state.errorMessage = 'Connection error';
            })
            .addCase(addComment.fulfilled, (state, action) => {
                if (action.payload.status === 0) {
                    state.showAddError = true;
                    state.errorAddMessage = action.payload.message;       
                } else {
                    const comment = action.payload.result;
                    if (comment) { 
                        state.comments.unshift(comment);
                    };
                    state.showAddError = false;
                    state.errorAddMessage = '';
                };
            })
            .addCase(deleteCommentById.rejected, (state) => {
                state.showError = true;
                state.errorMessage = 'Connection error';
            })
            .addCase(deleteCommentById.fulfilled, (state, action) => {
                if (action.payload.status === 0) {
                    state.showError = true;
                    state.errorMessage = action.payload.message;
                } else {
                    state.showError = false;
                    state.errorMessage = '';
                    const array: ICommentWithUser[] =
                    state.comments.filter((c) => c._id !== action.payload.result?._id);
                    state.comments = array;
                };
            })
    }
});

export const {
    clearErrors
} = commentsSlice.actions;