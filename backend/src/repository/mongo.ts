import mongoose, { Mongoose } from "mongoose"
import { EStatuses } from "../enums/EStatuses";
import { generateJWT } from "../helpers/generateJWT";
import IPost from "../interfaces/IPost";
import IPostCreateDto from "../interfaces/IPostCreateDto";
import IResponse from "../interfaces/IResponse";
import IUserDto from "../interfaces/IUserDto";
import IUserGetDto from "../interfaces/IUserGetDto";
import { Post } from "../models/Post";
import { User } from "../models/User";
import IComment from "../interfaces/IComment";
import { Comment } from "../models/Comment";
import ICommentDto from "../interfaces/ICommentDto";
import IPostWithCount from "../interfaces/IPostWithCount";

export class Mongo {

    private client: Mongoose | null = null;

    public close = async (): Promise<void> => {
        if (!this.client) return;
        await this.client.disconnect();
    };

    public init = async (): Promise<void> => {
        this.client = await mongoose.connect(process.env.MONGO_CLIENT_URL || '');
        console.log('MongoDB is connected');
    };

    public register = async (user: IUserDto): Promise<IResponse<IUserGetDto | undefined>> => {
        try {
            if (user.username === undefined || user.username.trim() === '')
                throw new Error('Username is required!');
            if (user.password === undefined || user.password.trim() === '')
                throw new Error('Password is required!');

            const exists = await User.exists({ username: user.username })
            if (exists) throw new Error('This username is already registered!');

            const newUser = new User(user);
            await newUser.save();
            const data: IUserGetDto = {
                _id: String(newUser._id),
                username: newUser.username,
                token: generateJWT({ _id: newUser._id, username: newUser.username })
            };
            const response: IResponse<IUserGetDto> = {
                status: EStatuses.OK,
                result: data,
                message: ''
            };
            return response;
        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public login = async (user: IUserDto): Promise<IResponse<{ username: string, token: string } | undefined>> => {
        try {
            if (user.username === undefined || user.username.trim() === '')
                throw new Error('Username is required!');
            if (user.password === undefined || user.password.trim() === '')
                throw new Error('Password is required!');

            const foundUser = await User.findOne({ username: user.username });
            if (!foundUser) throw new Error('User is not found!');

            const isMatch: boolean = await foundUser.checkPassword(user.password);
            if (!isMatch) throw new Error('Wrong password!');

            await foundUser.save();
            const data = {
                username: foundUser.username,
                token: generateJWT({ _id: foundUser._id, username: foundUser.username })
            };
            const response: IResponse<{ username: string, token: string }> = {
                status: EStatuses.OK,
                result: data,
                message: ''
            };
            return response;
        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public getPosts = async (): Promise<IResponse<IPostWithCount[] | undefined>> => {
        try {
            const posts = await Post.find().populate('user').sort({ datetime: 'desc' });
            let data: IPostWithCount[] = [];
            for (let i = 0; i < posts.length; i++) {
                const count: number = await Comment.find({ post_id: posts[i]._id }).count();
                let postWithCount: IPostWithCount = {
                    _id: posts[i]._id,
                    title: posts[i].title,
                    description: posts[i].description,
                    image: posts[i].image,
                    datetime: posts[i].datetime,
                    user: posts[i].user,
                    count: count
                };
                data.push(postWithCount);
            };

            const response: IResponse<IPostWithCount[]> = {
                status: EStatuses.OK,
                result: data,
                message: ''
            };
            return response;
        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public getPostById = async (id: string): Promise<IResponse<IPost | undefined>> => {
        try {
            if (!id.match(/^[0-9a-fA-F]{24}$/)) throw new Error('Id is not valid!');
            const foundPost: IPost | null = await Post.findById(id).populate('user');
            if (!foundPost) throw new Error('This post is not found.');

            const response: IResponse<IPost | undefined> = {
                status: EStatuses.OK,
                result: foundPost,
                message: ''
            };
            return response;
        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public addPost = async (userId: string, post: IPostCreateDto): Promise<IResponse<IPost | undefined>> => {
        try {
            const foundUser = await User.findById(userId);
            if (!foundUser) throw new Error('Unauthorized!');

            if (post.title === undefined || post.title.trim() === '')
                throw new Error('Post title is required!');

            if (post.description === undefined || post.description.trim() === '') {
                if (post.image === '') throw new Error('Put description or an image!');
            };
            const newPost = new Post({ ...post, user: userId });
            const data = await newPost.save();
            const response: IResponse<IPost> = {
                status: EStatuses.OK,
                result: data,
                message: ''
            };
            return response;
        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public deletePostById = async (userId: string, postId: string):
        Promise<IResponse<IPost | undefined>> => {
        try {
            const foundUser = await User.findById(userId);
            if (!foundUser) throw new Error('Unauthorized!');

            if (!postId.match(/^[0-9a-fA-F]{24}$/)) throw new Error('Post id is not valid!');
            const foundPost = await Post.findById(postId);
            if (!foundPost) throw new Error('This post is not found.');

            if (String(foundUser?._id) !== String(foundPost.user))
                throw new Error('You have no permission to delete it!');

            const comments = await Comment.find({ post_id: postId });
            if (comments) await Comment.deleteMany({ post_id: postId });

            const data: IPost | null = await Post.findOneAndDelete({ _id: postId });
            const response: IResponse<IPost | undefined> = {
                status: EStatuses.OK,
                result: data || undefined,
                message: ''
            };
            return response;
        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };

    public addComment = async (id: string, commentDto: ICommentDto): Promise<IResponse<IComment | undefined>> => {
        try {
            const user = await User.findById(id);
            if (!user) throw new Error('Unauthorized!');
            if (commentDto.text === undefined || commentDto.text.trim() === '')
                throw new Error('Text is required!');
            const comment = new Comment({ ...commentDto, 'user_id': user?._id })
            const data = await comment.save()
            const response: IResponse<IComment> = {
                status: EStatuses.OK,
                result: data,
                message: ''
            }
            return response
        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            }
            return response
        }
    }

    public getCommentsByPost = async (id: string): Promise<IResponse<IComment[] | undefined>> => {
        try {
            const data = await Comment.find({ post_id: id }).sort({ datetime: 'desc' }).populate('user_id', 'username')
            const response: IResponse<IComment[]> = {
                status: EStatuses.OK,
                result: data,
                message: ''
            }
            return response

        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            }
            return response
        }
    };

    public deleteCommentById = async (userId: string, commentId: string):
        Promise<IResponse<IComment | undefined>> => {
        try {
            const foundUser = await User.findById(userId);
            if (!foundUser) throw new Error('Unauthorized!');

            if (!commentId.match(/^[0-9a-fA-F]{24}$/)) throw new Error('Comment id is not valid!');
            const foundComment = await Comment.findById(commentId);
            if (!foundComment) throw new Error('This comment is not found.');

            if (String(foundUser?._id) !== String(foundComment.user_id))
                throw new Error('You have no permission to delete it!');

            const data: IComment | null = await Comment.findOneAndDelete({ _id: commentId });
            const response: IResponse<IComment | undefined> = {
                status: EStatuses.OK,
                result: data || undefined,
                message: ''
            };
            return response;
        } catch (err: unknown) {
            const error = err as Error
            const response: IResponse<undefined> = {
                status: EStatuses.NOT_OK,
                result: undefined,
                message: error.message
            };
            return response;
        };
    };
};

export const mongo = new Mongo();