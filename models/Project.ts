import mongoose, { Schema, Document } from "mongoose";

export type ProjectStatus = "TODO" | "INPROGRESS" | "COMPLETED";

export interface IProject extends Document {
    name: string;
    description: string;
    budget: number;
    status: ProjectStatus;
    assignedToManager?: mongoose.Types.ObjectId;
    assignedToEmployee?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    isDeleted: boolean;
}

const ProjectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        budget: { type: Number, required: true },
        status: { type: String, enum: ["TODO", "INPROGRESS", "COMPLETED"], default: "TODO" },
        assignedToManager: { type: Schema.Types.ObjectId, ref: "User" },
        assignedToEmployee: { type: Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
