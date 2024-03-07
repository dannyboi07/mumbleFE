type ToastType = "info" | "err" | "suc" | "warn" | "err" | "message";
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

interface ToastPayload extends ToastState { }
