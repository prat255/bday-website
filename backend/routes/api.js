import { Router } from 'express';
import { verifyPassword, adminLogin } from '../controllers/authController.js';
import {
  listMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  reorderMemories,
  updateWebsitePassword,
} from '../controllers/memoryController.js';
import { requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/verify-password', verifyPassword);
router.get('/memories', listMemories);

router.post('/admin/login', adminLogin);

router.post('/admin/memory', requireAdmin, upload.single('image'), createMemory);
router.put('/admin/memory/reorder', requireAdmin, reorderMemories);
router.put('/admin/memory/:id', requireAdmin, upload.single('image'), updateMemory);
router.delete('/admin/memory/:id', requireAdmin, deleteMemory);
router.put('/admin/password', requireAdmin, updateWebsitePassword);

export default router;
