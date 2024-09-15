type EnvType = "local" | "production";

interface Config {
    ENV: EnvType;
    BASE_API_URL: string;
}

const config: Config = {
    ENV: (process.env.ENV as EnvType) || "local",
    BASE_API_URL: process.env.REACT_APP_BACKEND_DOM_API || "localhost:8000",
};

export default config;
