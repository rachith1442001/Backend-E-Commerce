import Order from '../models/orderSchema.js';
import User from '../models/userSchema.js'; 
import { generateOTP } from '../helpers/otp.js';
import { sendOTPToUserEmail } from '../helpers/email.js';

export const orderController = {
  async createOrder(req, res) {
    try {
      const newOrder = await Order.create(req.body);
      const generatedOTP = generateOTP();
      const userId = req.body.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.orderOTP = generatedOTP;
      await user.save();
      sendOTPToUserEmail(user.email, generatedOTP);

      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .populate({
          path: 'orderItems',
          populate: {
            path: 'product',
            model: 'Product',
            select: 'name description price image',
          },
        })
        .populate('user', 'name');
      res.json(orders);
    } catch (error) {
      console.error('Error getting all orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getOrderById(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId)
        .populate({
          path: 'orderItems',
          populate: {
            path: 'product',
            model: 'Product',
            select: 'name description price image',
          },
        })
        .populate('user', 'name');
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      console.error('Error getting order by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateOrder(req, res) {
    try {
      const orderId = req.params.id;
      const updatedData = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedData, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteOrder(req, res) {
    try {
      const orderId = req.params.id;
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
