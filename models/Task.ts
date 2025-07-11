import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
    createdBy?: mongoose.Types.ObjectId;
    projectId?: mongoose.Types.ObjectId;
    name: string;
    status: string;
    hoursSpent: number[]; // Change from number to array
}

const taskSchema = new Schema<ITask>(
    {
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        name: { type: String, required: true },
        status: { type: String, enum: ["TODO", "INPROGRESS", "COMPLETED"], default: "TODO" },
        hoursSpent: { type: [Number], default: [] },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
