import express from 'express';

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.mjs';

const router = express.Router();

// Menampilkan semua user
router.get('/', getUsers);

// Menampilkan user berdasarkan ID
router.get('/:id', getUserById);

// Menambahkan user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Hapus user
router.delete('/:id', deleteUser);

export default router;