import express, { Router, Request, Response } from 'express';
import IResponse from '../interfaces/IResponse';
import { auth } from '../middlewares/auth';
import IComment from '../interfaces/IComment';
import IRequestWithTokenData from '../interfaces/IRequestWithTokenData';
import IUserGetDto from '../interfaces/IUserGetDto';
import { CommentsService, commentsService } from '../services/commentsService';
import { EStatuses } from '../enums/EStatuses';

export class CommentsController {
    private router: Router;
    private service: CommentsService;
    constructor() {
        this.router = express.Router();
        this.router.get('/', this.getCommentsByPost);
        this.router.post('/', auth, this.addComment);
        this.router.delete('/:id', auth, this.deleteCommentById)
        this.service = commentsService;
    };

    public getRouter = (): Router => {
        return this.router;
    };

    private getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
        const response: IResponse<IComment[] | undefined> = await this.service.getCommentsByPost(req.query?.post as string);
        res.send(response);
    };

    private addComment = async (expressReq: Request, res: Response): Promise<void> => {
        const req = expressReq as IRequestWithTokenData
        const user = req.dataFromToken as IUserGetDto
        const comment = req.body
        const response = await this.service.addComment(user._id, comment);
        res.send(response);
    };
    
    private deleteCommentById = async (expressReq: Request, res: Response): Promise<void> => {
        const req = expressReq as IRequestWithTokenData
        const user = req.dataFromToken as IUserGetDto
        const response = await this.service.deleteCommentById(user._id, req.params.id);
        res.send(response);
    };
};