import IComment from "./IComment"

export default interface ICommentDto {
    user_id: IComment['user_id']
    post_id: IComment['post_id']
    text: IComment['text']
}