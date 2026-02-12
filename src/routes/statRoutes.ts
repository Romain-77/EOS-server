import { Router } from "express";
import statController from "../controllers/statController.js";
import isAuth from "../middleware/isAuth.js";

const router = Router();

router.get("/", isAuth, statController.getDailyOverview);
router.get("/history",isAuth, statController.getStatsHistory);
router.post("/", isAuth, statController.updateScore);
router.patch("/categories/:id/target", isAuth, statController.updateCategoryTarget);

export default router;