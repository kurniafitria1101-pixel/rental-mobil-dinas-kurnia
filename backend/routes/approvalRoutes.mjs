import express from 'express';

import {
    getApprovals,
    getApprovalById,
    createApproval,
    updateApproval,
    deleteApproval
} from '../controllers/approvalController.mjs';

const router = express.Router();

// GET semua approval
router.get('/', getApprovals);

// GET approval berdasarkan ID
router.get('/:id', getApprovalById);

// POST approval
router.post('/', createApproval);

// PUT approval
router.put('/:id', updateApproval);

// DELETE approval
router.delete('/:id', deleteApproval);

export default router;