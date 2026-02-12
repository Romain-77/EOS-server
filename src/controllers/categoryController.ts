import { RequestHandler } from "express";
import categoryModel from "../models/categoryModel.js";

const browse: RequestHandler = async ( req, res, next) => {
    try {
        const userId = req.auth?.id;
        if (userId === undefined) {
            res.status(401).json({message: "Non autorisé"});
            return;
        }
        const categories = await categoryModel.readAll(userId);
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

const read: RequestHandler = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);
        const userId = req.auth?.id;

        if(Number.isNaN(categoryId || userId === undefined)) {
            res.status(400).json({ erro:"ID de catégorie invalide ou utilisateur invalide"});
            return;
        }

        const category = await categoryModel.read(categoryId);

        if (category == null) {
            res.status(404).json({ error: "Catégorie non trouvée"});
            return;
        }

        res.json(category);
    } catch (err) {
        next(err);
    }
};

export default { browse, read };
