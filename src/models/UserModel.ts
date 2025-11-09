import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema);
