import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      token: String,
      expiresAt: Date,
    },
    forgotPasswordToken: {
      token: String,
    expiresAt: Date,
  },
  },
  { timestamps: true, strict: true }
);

export const User = mongoose.model("user", userSchema);
