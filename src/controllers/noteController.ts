import type { RequestHandler } from "express";
import noteModel from "../models/noteModel.js";

const browse: RequestHandler = async (req, res, next) => {
    try {
        if(!req.auth) {
            res.status(401).json({message: "Non autorisé"});
            return;
        }
        const userId = req.auth.userId;
        const notes = await noteModel.readAllByUserId(userId);
        res.json(notes);
    } catch (err) {
        next(err)
    }
};

const read: RequestHandler = async (req, res, next) => {
    try {
        if(!req.auth) return res.sendStatus(401);
        
        const noteId = Number(req.params.id);
        const userId = req.auth.userId;
        const note = await noteModel.read(noteId, userId);
        if (note ==  null) {
            res.sendStatus(404);
        } else {
            res.json(note);
        }
    } catch (err) {
        next(err);
    }
};

const add: RequestHandler = async (req, res, next) => {
    try {
        if (!req.auth) return res.sendStatus(401);

        const { title, content, categoryId } = req.body;
        const userId = req.auth.userId;
        const result = await noteModel.create({ title, content, categoryId, userId });
        res.status(201).json({ insertId: result.insertId});
    } catch (err) {
        next(err);
    }
};

const edit: RequestHandler = async (req, res, next) => {
    try {
        if (!req.auth) return res.sendStatus(401);

        const id = Number(req.params.id);
        const userId = req.auth.userId;
        const { title, content, categoryId } = req.body;
        const result = await noteModel.edit(id, userId, { title, content, categoryId });

        if (result.affectedRows === 0) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    } catch (err) {
        next(err);
    }
};

const destroy: RequestHandler = async (req, res, next) => {
    try {
        if (!req.auth) return res.sendStatus(401);

        const noteId = Number(req.params.id);
        const userId = req.auth.userId;
        const result = await noteModel.delete(noteId, userId);
        if (result.affectedRows === 0) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    } catch (err) {
        next(err);
    }
};

export default { browse, read, add, edit, destroy };