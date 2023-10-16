import mongoose, { Schema } from "mongoose";
import IComment from "../interfaces/IComment";

const CommentSchema: Schema = new Schema<IComment>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);