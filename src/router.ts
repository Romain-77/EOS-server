import { Router } from "express";
const router = Router();

import categoryRoutes from "./routes/categoryRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import statRoutes from "./routes/statRoutes.js";
import userRoutes from "./routes/userRoutes.js";

router.use("/categories", categoryRoutes);
router.use("/notes", noteRoutes);
router.use("/stats", statRoutes);
router.use("/users", userRoutes);

export default router;