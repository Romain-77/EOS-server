import { AuthHandler, UserPayload } from "../express.js";
import jwt from "jsonwebtoken";

const isAuth: AuthHandler = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }

    try {
        const secret = process.env.APP_SECRET;
        if (!secret) throw new Error("APP_SECRET is not defined");

        const decoded = jwt.verify(token, secret) as UserPayload;
        req.auth = decoded;

        return next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(401).json({ message: "Token invalide" });
    }
};

export default isAuth;
