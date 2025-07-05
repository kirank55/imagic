import { Schema, model, models, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  image?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = (models && models.User) ? models.User as Model<IUser> : model<IUser>("User", UserSchema);

export default User;