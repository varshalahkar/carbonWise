import mongoose, { Schema } from "mongoose";
import type { UserDocument } from "../types/domain.js";

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform(_document, returnedObject: Partial<UserDocument> & { password?: string; __v?: number }) {
    delete returnedObject.password;
    delete returnedObject.__v;
    return returnedObject;
  },
});

export const UserModel = mongoose.model<UserDocument>("User", userSchema, "users");
