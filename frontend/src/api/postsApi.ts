import { EStatuses } from "../enums/EStatuses";
import IPost from "../interfaces/IPost";
import IPostWithUser from "../interfaces/IPostWithUser";
import IPostWithUserAndCount from "../interfaces/IPostWithUserAndCount";
import IResponse from "../interfaces/IResponse";
import { instance } from "./instance";

class PostsApi {

    public getPosts = async (): Promise<IResponse<IPostWithUserAndCount[] | undefined>> => {
        try {
            const response = await instance.get('/posts');
            return response.data;
        } catch (err: unknown) {
            const error = err as Error;
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public getPostById = async (id: string): Promise<IResponse<IPostWithUser | undefined>> => {
        try {
            const response = await instance.get(`/posts/${id}`);
            return response.data;
        } catch (err: unknown) {
            const error = err as Error;
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public addPost = async (post: FormData): Promise<IResponse<IPostWithUser | undefined>> => {
        try {
            const response = await instance.post('/posts', post);
            return response.data;
        } catch (err: unknown) {
            const error = err as Error;
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public deletePostById = async (id: string): Promise<IResponse<IPost | undefined>> => {
        try {
            const response = await instance.delete(`/posts/${id}`);
            return response.data;
        } catch (err: unknown) {
            const error = err as Error;
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };
};

export const postsApi = new PostsApi();