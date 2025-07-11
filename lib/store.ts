import { configureStore } from "@reduxjs/toolkit";

import authSlice from "@/slices/authSlice";
import userSlice from "@/slices/userSlice";
import projectSlice from "@/slices/projectSlice";
import projectDetailSlice from "@/slices/projectDetailSlice";
import dashboardSlice from "@/slices/dashboardSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authSlice,
            user: userSlice,
            projects: projectSlice,
            projectDetail: projectDetailSlice,
            dashboard: dashboardSlice,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
