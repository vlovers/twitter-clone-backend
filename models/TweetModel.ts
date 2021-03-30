import {Schema, Document, model} from 'mongoose';
import { UserModelDocumentInterface } from './UserModel';


export interface TweetModelInterface {
    _id?: string;
    text: string;
    user: UserModelDocumentInterface | string;

}

export type TweetModelDocumentInterface = TweetModelInterface & Document;

const TweetSchema = new Schema<TweetModelDocumentInterface> ({
    text: {
        type: String,
        required: true,
        maxlength: 280
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

TweetSchema.set('toJSON', {
    transform: function (_: any, obj: any) {
        delete obj.password;
        delete obj.confirm_hash;
        return obj;
    }
})

export const TweetModel = model('Tweet', TweetSchema);
  
 