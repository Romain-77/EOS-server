import express from "express";
import userController from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post('/register', userController.add);
router.post('/login', userController.login);
router.get('/me', isAuth, userController.getMe);
router.post('/logout', userController.logout);

export default router;