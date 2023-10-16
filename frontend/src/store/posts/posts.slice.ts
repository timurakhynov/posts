import { createSlice } from '@reduxjs/toolkit';
import { postsApi } from '../../api/postsApi';
import IPostWithUser from '../../interfaces/IPostWithUser';
import { createAppAsyncThunk } from '../createAppAsyncThunc';
import IPostsState from './IPostsState';
import IPostWithUserAndCount from '../../interfaces/IPostWithUserAndCount';

const namespace = 'posts';

export const getPosts = createAppAsyncThunk(
    `${namespace}/getPosts`,
    async () => {
        return postsApi.getPosts()
    }
);

export const getPostById = createAppAsyncThunk(
    `${namespace}/getPostById`,
    async (id: string) => {
        return postsApi.getPostById(id);
    }
);

export const addPost = createAppAsyncThunk(
    `${namespace}/addPost`,
    async (post: FormData) => {
        return postsApi.addPost(post)
    }
);

export const deletePostById = createAppAsyncThunk(
    `${namespace}/deletePostById`,
    async (id: string) => {
        return postsApi.deletePostById(id)
    }
);

export const postsSlice = createSlice({
    name: namespace,
    initialState: {
        posts: [] as IPostWithUserAndCount[],
        detailedPost: {},
        showError: false,
        errorMessage: '',
        showAddError: false,
        errorAddMessage: ''
    } as IPostsState,
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
            .addCase(getPosts.rejected, (state) => {
                state.showError = true;
                state.errorMessage = 'Connection error';
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                if (action.payload.status === 1) {
                    const result = action.payload.result as IPostWithUserAndCount[]
                    state.posts = result;
                } else {
                    state.showError = true;
                    state.errorMessage = action.payload.message;
                };
            })
            .addCase(getPostById.rejected, (state) => {
                state.showError = true;
                state.errorMessage = 'Connection error';
            })
            .addCase(getPostById.fulfilled, (state, action) => {
                if (action.payload.status === 1) {
                    const result = action.payload.result as IPostWithUser
                    state.detailedPost = result;
                } else {
                    state.showError = true;
                    state.errorMessage = action.payload.message;
                };
            })
            .addCase(addPost.rejected, (state) => {
                state.showError = true;
                state.errorMessage = 'Connection error';
            })
            .addCase(addPost.fulfilled, (state, action) => {
                if (action.payload.status === 0) {
                    state.showAddError = true;
                    state.errorAddMessage = action.payload.message;
                    const post = action.payload.result;
                    if (post) {
                        let postWithCount: IPostWithUserAndCount = {
                            ...post, 
                            count: 0
                        };
                        state.posts.unshift(postWithCount);
                    };
                } else {
                    state.showError = false;
                    state.errorMessage = '';
                };
            })
            .addCase(deletePostById.rejected, (state) => {
                state.showError = true;
                state.errorMessage = 'Connection error';
            })
            .addCase(deletePostById.fulfilled, (state, action) => {
                if (action.payload.status === 0) {
                    state.showError = true;
                    state.errorMessage = action.payload.message;
                } else {
                    state.showError = false;
                    state.errorMessage = '';
                    const array: IPostWithUserAndCount[] =
                        state.posts.filter((p) => p._id !== action.payload.result?._id);
                    state.posts = array;
                };
            })
    }
});

export const {
    clearErrors
} = postsSlice.actions;