import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { addToast } from "@heroui/react";

const defaultHeaders = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
};

interface Props<T = unknown> {
    url: string;
    data?: T;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    noHeaders?: boolean;
    retries?: number;
    timeout?: number;
    rest?: Omit<AxiosRequestConfig, "url" | "data" | "method" | "headers">;
}

interface ErrorResponse {
    message: string;
    error: { message: string };
}

export const defaultAxios = axios.create({
    timeout: 5000,
});

defaultAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(new Error(error.message)),
);

defaultAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response?.data?.message) {
            addToast({
                title: response?.data?.message,
                color: "success",
            });
        }

        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            const response = error.response.data as ErrorResponse;
            let errorMessage = "An error occurred";

            if (typeof response?.message === "string") {
                errorMessage = response.message;
            } else if (typeof response?.error?.message === "string") {
                errorMessage = response.error.message;
            } else if (typeof response?.error === "string") {
                errorMessage = response.error;
            }

            addToast({
                title: errorMessage,
                color: "danger",
            });
        }

        return Promise.reject(new Error(error.message));
    },
);

const executeHttp = async ({ url, data = {}, method = "GET", headers = {}, noHeaders, retries = 2, timeout = 5000, ...rest }: Props) => {
    let attempt = 0;

    const makeRequest = async () => {
        try {
            const response: AxiosResponse = await defaultAxios({
                method,
                url,
                headers: {
                    ...(noHeaders ? {} : defaultHeaders),
                    ...headers,
                },
                data,
                timeout,
                withCredentials: true,
                ...rest,
            });

            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const error = err.response?.data;

                const shouldRetry =
                    !err.response ||
                    [500, 502, 503, 504].includes(err.response?.status ?? 0) ||
                    ["ECONNABORTED", "EAI_AGAIN", "ETIMEDOUT", "ERR_NETWORK"].includes(err.code ?? "");

                if (shouldRetry && attempt < retries) {
                    attempt++;
                    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));

                    return makeRequest();
                }

                throw error ?? "An unknown error occurred";
            } else {
                throw err instanceof Error ? err.message : "An unknown error occurred";
            }
        }
    };

    return makeRequest();
};

export default executeHttp;
