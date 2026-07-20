import express from 'express';

import {
    getPengajuans,
    getPengajuanById,
    createPengajuan,
    updatePengajuan,
    deletePengajuan
} from '../controllers/pengajuanController.mjs';

import { verifyToken } from '../middlewares/authMiddleware.mjs';
import { authorizeRole } from '../middlewares/roleMiddleware.mjs';

const router = express.Router();

// Semua user yang login boleh melihat pengajuan
router.get('/', verifyToken, getPengajuans);

router.get('/:id', verifyToken, getPengajuanById);

// Pegawai membuat pengajuan
router.post(
    '/',
    verifyToken,
    authorizeRole(2),
    createPengajuan
);

// Pegawai mengubah pengajuan
router.put(
    '/:id',
    verifyToken,
    authorizeRole(2),
    updatePengajuan
);

// Pegawai menghapus pengajuan
router.delete(
    '/:id',
    verifyToken,
    authorizeRole(2),
    deletePengajuan
);

export default router;