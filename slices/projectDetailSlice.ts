import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Project } from "./projectSlice";

import executeHttp from "@/Service/api";

interface Task {
    createdBy?: string;
    projectId?: string;
    name: string;
    status: string;
    estimation: number;
    hoursSpent: [number];
    _id: string;
}

interface ProjectDetailState {
    loading: boolean;
    error: string | null;
    project: Project | null;
    task: Task[];
}

const initialState: ProjectDetailState = {
    loading: false,
    error: null,
    project: null,
    task: [],
};

export const fetchProjectDetail = createAsyncThunk("projectDetail/fetchProjectDetail", async (projectId: string, thunkAPI) => {
    try {
        const res = await executeHttp({
            method: "GET",
            url: `/api/projects/${projectId}`,
        });

        return res;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const createTask = createAsyncThunk(
    "projectDetail/createTask",
    async ({ name, projectId }: { name: string; projectId: string }, { rejectWithValue }) => {
        try {
            const res = await executeHttp({
                method: "POST",
                url: `/api/tasks/${projectId}`,
                data: { name },
            });

            return res;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const updateTask = createAsyncThunk("projectDetail/updateTask", async ({ taskId, updates }: { taskId: string; updates: any }) => {
    const res = await executeHttp({
        method: "PUT",
        url: `/api/tasks/${taskId}`,
        data: updates,
    });

    return res;
});

export const assignUsers = createAsyncThunk("projectDetail/assignUsers", async ({ projectId, payload }: { projectId: string; payload: any }) => {
    const res = await executeHttp({
        method: "PATCH",
        url: `/api/projects/${projectId}`,
        data: payload,
    });

    return res;
});

export const updateProjectStatus = createAsyncThunk<any, { projectId: string; status: string }, { rejectValue: string }>(
    "projectDetail/updateProjectStatus",
    async ({ projectId, status }, thunkAPI) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to update project status");

            return data.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

const projectDetailSlice = createSlice({
    name: "projectDetail",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload.data.project;
                state.task = action.payload.data.tasks;
            })
            .addCase(fetchProjectDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder.addCase(createTask.fulfilled, (state, action) => {
            state.task.push(action.payload.data);
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const updated = action.payload.data;
            const index = state.task.findIndex((t) => t._id === updated._id);

            if (index !== -1) {
                state.task[index] = updated;
            }
        });
        builder.addCase(assignUsers.fulfilled, (state, action) => {
            console.log("action :", action);
            state.project = action.payload.data;
        });
        builder.addCase(updateProjectStatus.fulfilled, (state, action) => {
            state.project = action.payload;
        });
    },
});

export default projectDetailSlice.reducer;
