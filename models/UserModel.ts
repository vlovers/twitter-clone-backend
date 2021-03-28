import {Schema, Document, model} from 'mongoose';


export interface UserModelInterface {
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

const UserSchema = new Schema  ({
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
        required: true,
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

}, {
    timestamps: true,
});

export const UserModel = model('User', UserSchema);
  
 