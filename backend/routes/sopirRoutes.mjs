import express from 'express';

import {
    getSopirs,
    getSopirById,
    createSopir,
    updateSopir,
    deleteSopir
} from '../controllers/sopirController.mjs';

import { verifyToken } from '../middlewares/authMiddleware.mjs';
import { authorizeRole } from '../middlewares/roleMiddleware.mjs';

const router = express.Router();

// Semua yang login boleh melihat data sopir
router.get('/', verifyToken, getSopirs);

router.get('/:id', verifyToken, getSopirById);

// Hanya Admin yang boleh mengelola sopir
router.post('/', verifyToken, authorizeRole(1), createSopir);

router.put('/:id', verifyToken, authorizeRole(1), updateSopir);

router.delete('/:id', verifyToken, authorizeRole(1), deleteSopir);

export default router;