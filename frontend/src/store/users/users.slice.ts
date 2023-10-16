import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../createAppAsyncThunc';
import IUserDto from '../../interfaces/IUserDto';
import { userApi } from '../../api/userApi';
import IUsersState from './IUsersState';
import IUserGetDto from '../../interfaces/IUserGetDto';

const namespace = 'users';

export const login = createAppAsyncThunk(
    `${namespace}/login`,
    async (user: IUserDto) => {
        return userApi.login(user);
    }
);

export const register = createAppAsyncThunk(
    `${namespace}/register`,
    async (user: IUserDto) => {
        return userApi.register(user);
    }
);

export const checkToken = createAppAsyncThunk(
    `${namespace}/checkToken`,
    async () => {
        return userApi.checkToken();
    }
);


const initialState: IUsersState = {
    user: {} as IUserGetDto,
    isAuth: false,
    showError: false,
    errorMessage: '',
    loginShowError: false,
    loginErrorMessage: '',
    registerShowError: false,
    registerErrorMessage: ''
}


export const usersSlice = createSlice({
    name: namespace,
    initialState: initialState,
    reducers: {
        initState(state) {
            state = initialState
        },
        clearError(state) {
            state.errorMessage = '';
            state.showError = false;
            state.loginShowError = false;
            state.loginErrorMessage = '';
            state.registerShowError = false;
            state.registerErrorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.rejected, (state) => {
                state.loginShowError = true;
                state.loginErrorMessage = 'Connection error';
            })
            .addCase(login.fulfilled, (state, action) => {
                if (action.payload.status === 1) {
                    state.loginShowError = false;
                    state.loginErrorMessage = '';
                    const user = action.payload.result;
                    state.user = user;
                    if (user) {
                        localStorage.setItem('token', user.token);
                        state.isAuth = true;
                    };
                } else {
                    state.loginShowError = true;
                    state.loginErrorMessage = action.payload.message;
                };
            })
            .addCase(register.rejected, (state) => {
                state.registerShowError = true;
                state.registerErrorMessage = 'Connection error';
            })
            .addCase(register.fulfilled, (state, action) => {
                if (action.payload.status === 1) {
                    state.registerShowError = false;
                    state.registerErrorMessage = '';
                    const user = action.payload.result;
                    state.user = user;
                    if (user) {
                        localStorage.setItem('token', user.token);
                        state.isAuth = true;
                    };
                } else {
                    state.registerShowError = true;
                    state.registerErrorMessage = action.payload.message;
                };
            })
            .addCase(checkToken.rejected, (state) => {
                state.showError = true;
                state.errorMessage = 'Connection error';
            })
            .addCase(checkToken.fulfilled, (state, action) => {
                if (action.payload.status === 1) {
                    const user = action.payload.result;
                    state.user = user;
                    if (user) {
                        state.isAuth = true;
                    } else {
                        state.isAuth = false;
                    };
                } else {
                    state.showError = true;
                    state.errorMessage = action.payload.message;
                };
            });
    }
});

export const {
    initState,
    clearError
} = usersSlice.actions;
