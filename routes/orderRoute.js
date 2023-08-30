import express from 'express';
import { orderController } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', orderController.createOrder)
  .get('/', orderController.getAllOrders)
  .get('/:id', orderController.getOrderById)
  .put('/:id', orderController.updateOrder)
  .delete('/:id', orderController.deleteOrder);

export default router;
