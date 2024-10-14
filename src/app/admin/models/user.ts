import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../lib/interfaces";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "ambassador"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  mongoose.models.user || mongoose.model<IUser>("user", userSchema);

export default UserModel;
