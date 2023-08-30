// controllers/users.js
import bcrypt from 'bcrypt';
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import nodemailer from 'nodemailer';

export const userController = {

    async createUser(req, res) {
      try {
        const { name, email, password, street, apartment, city, zip, country, phone } = req.body;
  
        const saltRounds = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);
  
        const newUser = new User({
          name,
          email,
          passwordHash: hashedPassword,
          street,
          apartment,
          city,
          zip,
          country,
          phone,
          isAdmin: false,
        });
  
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ error: 'Email already in use' });
        }
  
        await newUser.save();
  
        res.status(201).json(newUser);
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },

    async hasMaxActiveSessions(req) {
      const activeSessionCount = req.session.activeSessions || 0;
      return activeSessionCount >= 3;
    },    
    async loginUser(req, res) {
      try {
        const user = await User.findOne({ email: req.body.email });
        const secret = process.env.JWT_SECRET;
    
        if (!user) return res.status(404).json({ error: 'User not found' });
    
        const passwordMatch = await bcrypt.compare(req.body.password, user.passwordHash);
    
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
        if (await userController.hasMaxActiveSessions(req)) {
          return res.status(403).json({ error: 'Maximum concurrent sessions reached' });
        }
        req.session.activeSessions = (req.session.activeSessions || 0) + 1;
    
        const token = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          secret,
          { expiresIn: '2d' }
        );
        return res.status(200).json({
          message: 'Login successful',
          user: user.email,
          token: token,
          expiresIn: 172800,
        });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },    
      
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error:'Internal Server Error' });
    }
  },

  async addToCart(req, res) {
    try {
      const userId = req.params.id;
      const { productId, quantity } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const existingCartItem = user.cart.find(item => item.product.toString() === productId);
      
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity: quantity });
      }
      await user.save();
  
      res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  async removeFromCart(req, res) {
    try {
      const userId = req.params.userId;
      const productId = req.params.productId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await User.findByIdAndDelete(productId);
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  async getCartItems(req, res) {
    try {
      const userId  = req.params.id;
      const user = await User.findById(userId).populate('cart.product');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user.cart);
    } catch (error) {
      console.error('Error getting cart items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },  
  
  
};

