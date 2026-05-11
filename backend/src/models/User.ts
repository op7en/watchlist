import mongoose, { Schema } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = (mongoose.model as any)("User", UserSchema);

export default User;
