import { Router } from "express";
const router = Router();

import categoryRoutes from "./routes/categoryRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import statRoutes from "./routes/statRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";

router.use("/categories", categoryRoutes);
router.use("/notes", noteRoutes);
router.use("/stats", statRoutes);
router.use("/users", userRoutes);
router.use("/streaks", streakRoutes);

export default router;