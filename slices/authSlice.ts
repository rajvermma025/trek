"use client";

import { Action, createAsyncThunk, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AxiosResponse } from "axios";

import executeHttp from "@/Service/api";
import { RootState } from "@/lib/store";

interface ThunkApiConfig {
    dispatch: ThunkDispatch<RootState, unknown, Action<string>>;
    state: RootState;
    extra: unknown;
}

const initialState = {
    isLoading: false,
    token: "",
    email: "",
    id: "",
    firstName: "",
    lastName: "",
    role: "",
    loading: false,
    error: "",
    success: false,
};

export const login = createAsyncThunk<AxiosResponse<string>, { values: { email: string; password: string } }, ThunkApiConfig>(
    "authSlice/login",
    async ({ values }) => {
        const response = await executeHttp({
            method: "POST",
            url: `/api/login`,
            data: { email: values.email.trim().toLowerCase(), password: values.password },
        });

        return response;
    },
);

export const onboardUser = createAsyncThunk("authSlice/onboardUser", async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    try {
        const res = await executeHttp({
            method: "POST",
            url: `/api/onboard-user`,
            data: { token, password },
        });

        return res;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const logout = createAsyncThunk<void, { router: AppRouterInstance }, ThunkApiConfig>("authSlice/logout", async ({ router }, { rejectWithValue }) => {
    try {
        await executeHttp({
            method: "POST",
            url: "/api/logout",
        });

        router.push("/login");
    } catch {
        return rejectWithValue("Logout failed");
    }
});

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setStateData: (state, action) => {
            state.email = action.payload.email;
            state.firstName = action.payload.firstName;
            state.id = action.payload.id;
            state.lastName = action.payload.lastName;
            state.role = action.payload.role;
            state.token = action.payload.token;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(onboardUser.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.success = false;
            })
            .addCase(onboardUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(onboardUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setStateData } = authSlice.actions;
export default authSlice.reducer;
