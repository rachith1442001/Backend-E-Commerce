import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

router.route('/')
  .post(userController.createUser)
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.post('/login', userController.loginUser);

router.post('/:id/add-to-cart', userController.addToCart);
router.get('/:id/cart', userController.getCartItems);
router.delete('/:userId/remove-from-cart/:productId', userController.removeFromCart);


export default router;
