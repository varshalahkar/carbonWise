import dotenv from "dotenv";

dotenv.config({ path: "backend/.env" });

type Env = {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientOrigin: string;
};

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env: Env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongoUri: requireEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/carbonwise"),
  jwtSecret: requireEnv("JWT_SECRET", "development-only-change-this-secret"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://127.0.0.1:5173",
};
