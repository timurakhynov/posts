import IComment from "../interfaces/IComment";
import ICommentDto from "../interfaces/ICommentDto";
import IResponse from "../interfaces/IResponse";
import { mongo, Mongo } from "../repository/mongo";

export class CommentsService {
    private repository: Mongo;
    constructor() {
        this.repository = mongo;
    };
    
    public getCommentsByPost = async (id: string): Promise<IResponse<IComment[] | undefined>> => {
        return await this.repository.getCommentsByPost(id);
    };

    public addComment = async (userId: string, commentDto: ICommentDto):
        Promise<IResponse<IComment | undefined>> => {
        return await this.repository.addComment(userId, commentDto);
    };

    public deleteCommentById = async (userId: string, commentId: string):
        Promise<IResponse<IComment | undefined>> => {
        return await this.repository.deleteCommentById(userId, commentId);
    };
};

export const commentsService = new CommentsService();