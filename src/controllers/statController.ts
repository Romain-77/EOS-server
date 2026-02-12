import { RequestHandler } from "express";
import statModel from "../models/statModel.js";

const updateScore: RequestHandler = async (req, res, next) => {
    try {
        const { categoryId, score } = req.body;
        const userId = req.auth?.id;

        if (categoryId === undefined || score === undefined || userId === undefined) {
            return res.status(400).json({message: "Données manquantes"});
        }

        await statModel.createOrUpdate(Number(categoryId), Number(score), userId);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

const getDailyOverview: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.auth?.id
        if (userId === undefined) {
            res.status(401).json({ message: "Non autorisé" });
            return;
        }
        const overview = await statModel.getDailyOverview(userId);
        res.json(overview);
    } catch (err) {
        next(err);
    }
};

const getStatsHistory: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.auth?.id
        if (userId === undefined) {
            res.status(401).json({ message: "Non autorisé" });
            return;
        }
        const days = req.query.days ? Number(req.query.days) : 7;
        const history = await statModel.getStatsHistory(userId, days);
        res.json(history);
    } catch (err) {
        next(err);
    }
};

const updateCategoryTarget: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.auth?.id
        const { id } = req.params;
        const categoryId = parseInt(id as string, 10);
        const newTarget = parseInt(req.body.target, 10);

        if (userId === undefined || isNaN(categoryId) || isNaN(newTarget)) {
            return res.status(400).json ({error: "ID ou Objectif invalide"});
        }
        if (newTarget < 0 || newTarget > 10) {
            return res.status(400).json({error: "L'objectif doit être entre 0 et 10" });
        }
        await statModel.updateTarget(categoryId, newTarget, userId);
        res.json({
            success: true,
            message: "objectif mis à jour",
            data: { categoryId, newTarget }
        });
    } catch (err) {
        next(err);
    }
}

export default { updateScore, getDailyOverview, getStatsHistory, updateCategoryTarget };