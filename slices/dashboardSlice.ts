import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDashboardSummary = createAsyncThunk("dashboard/fetch", async () => {
    const res = await fetch("/api/dashboard/summary");
    const data = await res.json();

    return data.data;
});

interface DashboardState {
    summary: { status: Record<string, number>; budget: Record<string, number>; assignment: Record<string, number> };
    loading: boolean;
}

const initialState: DashboardState = {
    summary: {
        status: {},
        budget: {},
        assignment: {},
    },
    loading: false,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardSummary.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
                state.summary = action.payload;
                state.loading = false;
            })
            .addCase(fetchDashboardSummary.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default dashboardSlice.reducer;
