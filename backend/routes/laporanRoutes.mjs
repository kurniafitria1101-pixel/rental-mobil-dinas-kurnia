import express from "express";
import { getLaporan } from "../controllers/laporanController.mjs";
import { verifyToken } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// Menampilkan seluruh laporan
router.get("/", verifyToken, getLaporan);

export default router;