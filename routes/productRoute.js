import express from 'express';
import { productController } from '../controllers/productController.js';

const router = express.Router();

router.get('/', productController.getAllProducts)
.post('/', productController.createProduct);

router.get('/:id', productController.getProductById)
.put('/:id', productController.updateProduct)
.delete('/:id', productController.deleteProduct);

router.get('/search/:key', productController.searchProducts);

export default router;
