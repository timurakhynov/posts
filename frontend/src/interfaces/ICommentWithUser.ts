export default interface ICommentWithUser  {
    _id: string
    user_id: {
        _id: string
        username: string
    } 
    post_id: string
    datetime: string
    text: string
}