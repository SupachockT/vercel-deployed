import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const service_url = "http://localhost:3000";

const axiosInstance = axios.create({
    baseURL: service_url,
    timeout: 5000,
});

const shortenUrlRequest = async ({ original_url, custom_url }) => {
    try {
        const response = await axiosInstance.post("/shorten", {
            original_url,
            custom_url,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log(error);
            throw new Error(error.response?.data?.error || "Error shortening the URL");
        } else if (error.request) {
            throw new Error("No response from the server.");
        } else {
            throw new Error(error.message || "Error setting up the request.");
        }
    }
};

const fetchUrlHistoryRequest = async () => {
    try {
        const response = await axiosInstance.get("/history");
        return response.data; // This is important for React Query to use the fetched data
    } catch (error) {
        if (error.response) {
            console.log(error);
            throw new Error(error.response?.data?.error || "Error fetching URL history");
        } else if (error.request) {
            throw new Error("No response from the server.");
        } else {
            throw new Error(error.message || "Error setting up the request.");
        }
    }
};

const useShortenUrl = () => {
    return useMutation({
        mutationFn: shortenUrlRequest,
        onError: (error) => {
            console.error("Error shortening the URL:", error.message);
        },
        onSuccess: (data) => {
            console.log("Successfully shortened the URL:", data);
        },
        onSettled: (data, error) => {
            console.log(error ? "Error during mutation:" : "Mutation settled, URL shortened:", error ? error.message : data);
        },
    });
};

const useUrlHistory = () => {
    return useQuery({
        queryKey: ['urlHistory'],
        queryFn: fetchUrlHistoryRequest,
        onError: (error) => {
            console.error("Error fetching URL history:", error.message);
        },
        onSuccess: (data) => {
            console.log("Successfully fetched URL history:", data);
        },
    });
};

export { useShortenUrl, useUrlHistory };
