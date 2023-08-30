import express from 'express';
import { inventoryController } from '../controllers/inventoryController.js';

const router = express.Router();

router.post('/', inventoryController.createProduct)
.get('/:id', inventoryController.getProductById)
.get('/', inventoryController.getAllProducts);
router.put('/:id', inventoryController.updateProduct)
.delete('/:id', inventoryController.deleteProduct);

export default router;
