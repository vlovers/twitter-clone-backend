import {Schema, Document, model} from 'mongoose';


export interface UserModelInterface {
    _id?: string;
    email: string;
    fullname: string;
    username: string;
    password: string;
    confirm_hash: string;
    confirmed?: boolean;
    lokation?: string;
    about?: string;
    website?: string;
}

export type UserModelDocumentInterface = UserModelInterface & Document;

const UserSchema = new Schema<UserModelDocumentInterface> ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirm_hash: {
        type: String,
        required: true,
        unique: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    lokation: String,    
    about: String,
    website: String
});

UserSchema.set('toJSON', {
    transform: function (_: any, obj: any) {
        delete obj.password;
        delete obj.confirm_hash;
        return obj;
    }
})

export const UserModel = model('User', UserSchema);
  
 