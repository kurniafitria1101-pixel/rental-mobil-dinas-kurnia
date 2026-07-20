import express from 'express';

import {
    getMobils,
    getMobilById,
    createMobil,
    updateMobil,
    deleteMobil
} from '../controllers/mobilController.mjs';

import { verifyToken } from '../middlewares/authMiddleware.mjs';
import { authorizeRole } from '../middlewares/roleMiddleware.mjs';

const router = express.Router();


// Menampilkan semua mobil
router.get('/', verifyToken, getMobils);

// Menampilkan mobil berdasarkan ID
router.get('/:id', verifyToken, getMobilById);

// Menambahkan mobil
router.post(
    '/',
    verifyToken,
    authorizeRole(1),
    createMobil
);

// Update mobil
router.put(
    '/:id',
    verifyToken,
    authorizeRole(1),
    updateMobil
);

// Hapus mobil
router.delete(
    '/:id',
    verifyToken,
    authorizeRole(1),
    deleteMobil
);

export default router;