import type { RequestHandler } from "express";
import streakModel from "../models/streakModel.js";

const getStreak: RequestHandler = async (req, res, next) => {
    try {
        if (!req.auth) {
            res.status(401).json({message: "non autorisé"});
            return;
        }
        const userId = req.auth.userId;
    const streakData = await streakModel.getStreak(userId);
res.json(streakData);
    } catch (err) {
        next(err);
    }
};

export default {
    getStreak
};