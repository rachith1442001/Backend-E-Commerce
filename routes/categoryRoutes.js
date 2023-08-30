import express from 'express';
import { categoryController } from '../controllers/categoryController.js';

const router = express.Router();
router.get('/:id', categoryController.getCategoryById)
.put('/:id', categoryController.updateCategory)
.delete('/:id', categoryController.deleteCategory);
router.get('/', categoryController.getAllCategories)
.post('/', categoryController.createCategory);
export default router;

