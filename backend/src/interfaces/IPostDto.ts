import IPost from "./IPost";

export default interface IPostDto {
    title: IPost['title']
    description: IPost['description']
    image?: IPost['image']
    user: IPost['user']
};