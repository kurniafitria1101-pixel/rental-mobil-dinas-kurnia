import express from 'express';

import {
    getMobils,
    getMobilById,
    createMobil,
    updateMobil,
    deleteMobil
} from '../controllers/mobilController.mjs';

const router = express.Router();

// Menampilkan semua mobil
router.get('/', getMobils);

// Menampilkan mobil berdasarkan ID
router.get('/:id', getMobilById);

// Menambahkan mobil
router.post('/', createMobil);

// Update mobil
router.put('/:id', updateMobil);

// Hapus mobil
router.delete('/:id', deleteMobil);

export default router;