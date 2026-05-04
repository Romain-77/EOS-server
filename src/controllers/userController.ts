import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { sendResetEmail } from "../services/mailServices.js";
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

const forgotPassword: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel.findByEmail(email);

        if (!user) {
            res.status(200).json({ message: "Si cet email existe, un lien a été envoyé." });
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000);

        await userModel.updateResetToken(email, token, expires);
        await sendResetEmail(email, token);

        res.status(200).json({ message: "Email de réinitialisation envoyé" });
    } catch (err) {
        next(err);
    }
};

const resetPassword: RequestHandler = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const user = await userModel.findByResetToken(token);

        if (!user) { 
            res.status (400).json({message: "Token invalide ou éxpiré."});
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updatePasswordd(user.id, hashedPassword);

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (err) {
        next(err);
    }
};

export default { add, login, getMe, logout, forgotPassword, resetPassword };
