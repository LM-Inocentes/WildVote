import { Schema, model } from 'mongoose';

export interface IUser{
    id: string;
    Fullname: string;
    isAdmin: boolean;
    ReferenceFaceURL: string;
}

export const UserSchema = new Schema<IUser>(
    {
        id: { type: String, required:true },
        Fullname: { type: String, required:true },
        isAdmin: { type: Boolean, required:true },
        ReferenceFaceURL: { type: String, required:true },
    },{
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        },
        timestamps:true
    }
)

export const UserModel = model<IUser>('WildVote-Users', UserSchema);