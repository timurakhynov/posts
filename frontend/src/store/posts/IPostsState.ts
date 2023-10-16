import IPostWithUser from "../../interfaces/IPostWithUser";
import IPostWithUserAndCount from "../../interfaces/IPostWithUserAndCount";

export default interface IPostsState {
    posts: IPostWithUserAndCount[]
    detailedPost: IPostWithUser
    showError: boolean
    errorMessage: string
    showAddError: boolean
    errorAddMessage: string
};