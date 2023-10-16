import mongoose, { Schema } from "mongoose";
import IPost from "../interfaces/IPost";


const PostSchema: Schema = new Schema<IPost>({
    title: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: String,
    image: String
}, {
    versionKey: false
});

export const Post = mongoose.model<IPost>('Post', PostSchema);