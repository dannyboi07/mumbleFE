import { useDispatch } from "react-redux";
import axiosInstance from "./axios";
import { useState } from "react";

interface ApiProps {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    data?: any;
    params?: any;
    headers?: any;
}

function useApi<T>() {
    const dispatch = useDispatch();
    const [response, setResponse] = useState<T | null>(null);
    // axiosInstance.request()
}
