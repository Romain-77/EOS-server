import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
import isAuth from "../middleware/isAuth.js";

const router = Router();

router.get("/", isAuth, categoryController.browse);

router.get("/:id", isAuth, categoryController.read);

export default router;