
import ICommentWithUser from "../../interfaces/ICommentWithUser";

export default interface ICommentsState {
    comments: ICommentWithUser[]
    showError: boolean
    errorMessage: string
    showAddError: boolean
    errorAddMessage: string
};