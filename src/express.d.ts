import { RequestHandler } from "express";

export interface UserPayload {
    id: number;
    role?: string;
    userId: number;
    email: string;
}

export type AuthHandler = RequestHandler;

declare global {
    namespace Express {
        interface Request {
            auth?: UserPayload;
        }
    }
}

export {};