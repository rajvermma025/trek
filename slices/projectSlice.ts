import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import executeHttp from "@/Service/api";

export interface Project {
    _id: string;
    name: string;
    description: string;
    budget: number;
    assignedToManager?: { _id: string; firstName: string; lastName: string };
    assignedToEmployee?: { _id: string; firstName: string; lastName: string; hourlyRate: number };
    status: string;
}

interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    projects: [],
    loading: false,
    error: null,
};

export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
    const res = await executeHttp({
        method: "GET",
        url: "/api/projects",
    });

    return res;
});

export const createProject = createAsyncThunk("projects/create", async (formData: any) => {
    const res = await executeHttp({
        method: "POST",
        url: "/api/projects",
        data: formData,
    });

    return res;
});

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.projects = action.payload.projects;
                state.loading = false;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch projects";
            })
            .addCase(createProject.rejected, (state, action) => {
                state.error = action.error.message ?? "Failed to create project";
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload.project);
            });
    },
});

export default projectSlice.reducer;
