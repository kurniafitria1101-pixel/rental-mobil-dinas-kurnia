import express from 'express';

import {
    getSopirs,
    getSopirById,
    createSopir,
    updateSopir,
    deleteSopir
} from '../controllers/sopirController.mjs';

const router = express.Router();

// Menampilkan semua sopir
router.get('/', getSopirs);

// Menampilkan sopir berdasarkan ID
router.get('/:id', getSopirById);

// Menambahkan sopir
router.post('/', createSopir);

// Update sopir
router.put('/:id', updateSopir);

// Hapus sopir
router.delete('/:id', deleteSopir);

export default router;