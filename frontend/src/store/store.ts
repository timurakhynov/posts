import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { useDispatch } from 'react-redux'
import { postsSlice } from "./posts/posts.slice";
import { usersSlice } from "./users/users.slice";
import { commentsSlice } from "./comments/comments.slice";

const makeStore = () => {
    return configureStore({
        reducer: {
            users: usersSlice.reducer,
            posts: postsSlice.reducer,   
            comments: commentsSlice.reducer        
        }
    });
};

const store = makeStore()
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;