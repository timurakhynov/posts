import { EStatuses } from "../enums/EStatuses";
import IComment from "../interfaces/IComment";
import ICommentCreateDto from "../interfaces/ICommentCreateDto";
import ICommentWithUser from "../interfaces/ICommentWithUser";
import IResponse from "../interfaces/IResponse";
import { instance } from "./instance";

class CommentsApi {
    public getCommentsByPostId = async (postID: string): Promise<IResponse<ICommentWithUser[] | undefined>> => {
        try {
            const response = await instance.get(`/comments?post=${postID}`);
            return response.data;
        } catch (err: unknown) {
            const error = err as Error;
            return {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
        };
    };

    public addComment = async ( comment: ICommentCreateDto): Promise<IResponse<ICommentWithUser | undefined>> => {
        try {
            const response = await instance.post('/comments', comment);
            return response.data;
        } catch (err: unknown) {
            const error = err as Error;
            return {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
        };
    };

    public deleteCommentById = async (id: string): Promise<IResponse<IComment | undefined>> => {
        try {
            const response = await instance.delete(`/comments/${id}`);
            return response.data;
        } catch (err: unknown) {
            const error = err as Error;
            return {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
        };
    };
};

export const commentsApi = new CommentsApi();