import { Router } from "express";
import noteController from "../controllers/noteController.js";
import isAuth from "../middleware/isAuth.js";

const router = Router();

router.get("/", isAuth, noteController.browse);
router.get("/:id", isAuth, noteController.read);
router.post("/", isAuth, noteController.add);
router.put("/:id",isAuth, noteController.edit);
router.delete("/:id",isAuth, noteController.destroy);

export default router;