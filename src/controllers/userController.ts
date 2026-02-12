import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import userModel from "../models/userModel.js";

const add: RequestHandler = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            res.status(400).json({message: " Cet email est déjà utilisé."});
            return;
        }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
        username,
        email,
        password: hashedPassword
    });

    const newUserId = result.insertId;

    await userModel.initUserCategories(newUserId);

    res.status(201).json({ id: newUserId, message: "Utilisateur créé !" });
} catch (err) {
    next(err);
}
};

const login: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } =req.body;

        const user = await userModel.findByEmail(email);
        if (!user || !user.password) {
            res.status(401).json({ message: "Identifiants incorrects" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            res.status(401).json({ message: "Identifiants incorrects" });
            return;
        }
        console.log("Utilisateur trouvé:", user.email);
        const secret = process.env.APP_SECRET;
        console.log("Secret présent?", !!secret);
        if(!secret) throw new Error("APP_SECRET is not defined");

        const token = jwt.sign(
            {
                id: user.id, 
                userId: user.id,
                email: user.email
            },
            secret,
            {expiresIn: "24h"}
        );
       res.cookie("token", token, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax", 
    maxAge: 24 * 60 * 60 * 1000
});

return res.json({
    id: user.id,
    username: user.username,
    email: user.email
});
    } catch (err) {
        next(err);
    }
};

const getMe: RequestHandler = async (req, res, next) => {
    try {
        if(!req.auth) {
            res.status(401).json({ message: "Non autorisé" });
            return;
        }

        const user = await userModel.findById(req.auth.id);

        if (!user) {
            res.status(404).json ({message: "Utilisateur non trouvé"});
            return;
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        next (err);
    }
};

const logout: RequestHandler = (req, res, next) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({message: "Déconnexion réussie"});
};

export default { add, login, getMe, logout };
