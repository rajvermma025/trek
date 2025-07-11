import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    hourlyRate: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: string;
    isOnboarded: boolean;
    onboardToken: string;
    onboardTokenExpiry: Date;
}

const UserSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["ADMIN", "MANAGER", "EMPLOYEE"],
            default: "ADMIN",
        },
        hourlyRate: { type: Number, default: null },
        isOnboarded: { type: Boolean, default: false },
        onboardToken: { type: String },
        onboardTokenExpiry: { type: Date },
    },
    { timestamps: true },
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
