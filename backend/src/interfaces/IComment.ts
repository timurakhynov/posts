import { Document, ObjectId } from "mongoose"
import IUser from "./IUser"
import IPost from "./IPost"

export default interface IComment extends Document {
    _id: ObjectId
    user_id: IUser
    post_id: IPost
    datetime: Date
    text: string
}