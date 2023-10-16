import { Document, ObjectId } from "mongoose";
import IUser from "./IUser";


export default interface IPost extends Document {
    _id: ObjectId
    title: string
    description: string
    image?: string | File | undefined
    datetime: Date
    user: IUser | ObjectId
};