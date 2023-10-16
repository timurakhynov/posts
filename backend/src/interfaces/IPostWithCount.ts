import IPost from "./IPost"

export default interface IPostWithCount {
    _id: IPost['_id']
    title: IPost['title']
    description: IPost['description']
    image?: IPost['image']
    datetime: IPost['datetime']
    user: IPost['user']
    count: number
};