import express from "express";
import { getDashboard } from "../controllers/dashboardController.mjs";
import { verifyToken } from "../middlewares/authMiddleware.mjs";
import { authorizeRole } from "../middlewares/roleMiddleware.mjs";

const router = express.Router();

// Dashboard hanya boleh diakses Admin
router.get(
    "/",
    verifyToken,
    authorizeRole(1),
    getDashboard
);

export default router;