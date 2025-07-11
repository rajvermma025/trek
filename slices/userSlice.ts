import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import executeHttp from "@/Service/api";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "EMPLOYEE" | "MANAGER";
    hourlyRate?: number;
}

interface UserState {
    users: User[];
    manager: User[];
    employee: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    manager: [],
    employee: [],
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk("users/fetch", async (role: "MANAGER" | "EMPLOYEE") => {
    const response = await executeHttp({
        method: "GET",
        url: `/api/users?role=${role}`,
    });

    return response;
});

export const fetchManager = createAsyncThunk("users/fetchManager", async (role: "MANAGER" | "EMPLOYEE") => {
    const response = await executeHttp({
        method: "GET",
        url: `/api/users?role=${role}`,
    });

    return response;
});

export const fetchEmployee = createAsyncThunk("users/fetchEmployee", async (role: "MANAGER" | "EMPLOYEE") => {
    const response = await executeHttp({
        method: "GET",
        url: `/api/users?role=${role}`,
    });

    return response;
});

export const addUser = createAsyncThunk("users/add", async (data: Partial<User>) => {
    const response = await executeHttp({
        method: "POST",
        url: "/api/users",
        data,
    });

    return response;
});

export const updateUser = createAsyncThunk("users/update", async ({ id, data }: { id: string; data: Partial<User> }) => {
    await executeHttp({
        method: "POST",
        url: `/api/users/${id}`,
        data,
    });

    return { id, data };
});

export const deleteUser = createAsyncThunk("users/delete", async (id: string) => {
    await executeHttp({
        method: "DELETE",
        url: `/api/users/${id}`,
    });

    return id;
});

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch users";
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.meta.arg as User);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const { id, data } = action.payload;
                const index = state.users.findIndex((u) => u._id === id);

                if (index > -1) {
                    state.users[index] = { ...state.users[index], ...data };
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u._id !== action.payload);
            })
            .addCase(fetchManager.fulfilled, (state, action) => {
                state.manager = action.payload;
                state.loading = false;
            })
            .addCase(fetchEmployee.fulfilled, (state, action) => {
                state.employee = action.payload;
                state.loading = false;
            });
    },
});

export default userSlice.reducer;
