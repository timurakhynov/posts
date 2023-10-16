import IPost from "../interfaces/IPost";
import IPostDto from "../interfaces/IPostDto";
import IPostWithCount from "../interfaces/IPostWithCount";
import IResponse from "../interfaces/IResponse";
import { mongo, Mongo } from "../repository/mongo";

export class PostsService {
    private repository: Mongo;
    constructor() {
        this.repository = mongo;
    };

    public getPosts = async (): Promise<IResponse<IPostWithCount[] | undefined>> => {
        return await this.repository.getPosts();
    };

    public getPostById = async (id: string):
        Promise<IResponse<IPost | undefined>> => {
        return await this.repository.getPostById(id);
    };

    public addPost = async (userId: string, post: IPostDto):
        Promise<IResponse<IPost | undefined>> => {
        return await this.repository.addPost(userId, post);
    };

    public deletePostById = async (userId: string, postId: string):
        Promise<IResponse<IPost | undefined>> => {
        return await this.repository.deletePostById(userId, postId);
    };
};

export const postsService = new PostsService();