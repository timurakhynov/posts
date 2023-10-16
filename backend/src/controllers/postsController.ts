import express, { Router, Request, Response } from 'express';
import { config } from '../index.config';
import multer from 'multer';
import shortid from "shortid";
import IResponse from '../interfaces/IResponse';
import { auth } from '../middlewares/auth';
import { postsService, PostsService } from '../services/postsService';
import IPost from '../interfaces/IPost';
import IRequestWithTokenData from '../interfaces/IRequestWithTokenData';
import IUserGetDto from '../interfaces/IUserGetDto';
import IPostWithCount from '../interfaces/IPostWithCount';

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, config.images)
    },
    filename(req, file, callback) {
        callback(null,
            `${shortid()}${file.originalname}`)
    },
});
const upload = multer({ storage });
export class PostsController {
    private router: Router;
    private service: PostsService;
    constructor() {
        this.router = express.Router();
        this.router.get('/', this.getPosts);
        this.router.get('/:id', this.getPostById);
        this.router.post('/', [auth, upload.single('image')], this.addPost);
        this.router.delete('/:id', auth, this.deletePostById)
        this.service = postsService;
    };

    public getRouter = (): Router => {
        return this.router;
    };

    private getPosts = async (req: Request, res: Response): Promise<void> => {
        const response: IResponse<IPostWithCount[] | undefined> = await this.service.getPosts();
        res.send(response);
    };

    private getPostById = async (req: Request, res: Response): Promise<void> => {
        const response: IResponse<IPost | undefined> =
            await this.service.getPostById(req.params.id);
        res.send(response);
    };

    private addPost = async (expressReq: Request, res: Response): Promise<void> => {
        const req = expressReq as IRequestWithTokenData
        const user = req.dataFromToken as IUserGetDto
        const post = req.body;
        post.image = req.file ? req.file.filename : '';
        const response = await this.service.addPost(user._id, post);
        res.send(response);
    };
    
    private deletePostById = async (expressReq: Request, res: Response): Promise<void> => {
        const req = expressReq as IRequestWithTokenData
        const user = req.dataFromToken as IUserGetDto
        const response = await this.service.deletePostById(user._id, req.params.id);
        res.send(response);
    };
};