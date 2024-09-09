type ToastType = "info" | "error" | "success" | "warning" | "error" | "message";

interface ToastState {
    type: ToastType;
    title: string;
    message?: string;
    contactDetails?: {
        name: string;
        profile_pic: string;
        // number: string;
    };
}

interface ToastPayload extends ToastState {}
