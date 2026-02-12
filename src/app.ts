import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import fs from "node:fs";
import type { ErrorRequestHandler } from "express";

import router from "./router.js";


const app = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
    cors({
        origin: clientUrl,
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.use(express.json());
app.use(cookieParser());

const publicPath = path.join(process.cwd(), "public");
if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
}

app.use("/api", router);

const logErrors: ErrorRequestHandler =(err, req, res, next) => {
    console.error(err);
    console.error("on req:", req.method, req.path);
    next(err)
};
app.use(logErrors);

export default app;