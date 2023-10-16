import IPost from "./IPost";

export default interface IPostCreateDto {
    title: IPost['title']
    description: IPost['description']
    image?: IPost['image']
};