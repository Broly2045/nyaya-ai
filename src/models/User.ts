import mongoose, { Document, Schema } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  subscription: "free" | "pro" | "chamber";
  documentsUsed: number;
  documentsLimit: number;
  preferredLanguage: "en" | "hi";
  barCouncilId?: string; // for advocates
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscription: {
      type: String,
      enum: ["free", "pro", "chamber"],
      default: "free",
    },
    documentsUsed: { type: Number, default: 0 },
    documentsLimit: { type: Number, default: 3 }, // 3 for free
    preferredLanguage: { type: String, enum: ["en", "hi"], default: "en" },
    barCouncilId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUserDoc>("User", UserSchema);
