import Product from '../models/productSchema.js';
import mongoose from 'mongoose';
import Category from '../models/categorySchema.js';

export const productController = {
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3; 
  
      const skip = (page - 1) * limit;

      const products = await Product.find()
        .populate('category', 'type color icon image')
        .populate('countOfStock', 'availableQuantity')
        .skip(skip)
        .limit(limit);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId)
        .populate('category', 'type color icon image')
        .populate('countOfStock', 'availableQuantity')
        res.status(200).json(product);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

    async createProduct(req, res) {
      try {
        const newProductData = req.body;
        const newProduct = await Product.create(newProductData);
        res.status(201).json(newProduct);
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },
    
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updateData = req.body;

      if (updateData.category && !mongoose.Types.ObjectId.isValid(updateData.category)) {
        return res.status(400).json({ error: 'Invalid categoryId' });
      }

      if (updateData.category) {
        const category = await Category.findById(updateData.category);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async searchProducts(req, res) {
    try {
      const searchKey = req.params.key;
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
  
      const skip = (page - 1) * limit;
  
      const products = await Product.find({
        $or: [
          { 'name': { $regex: searchKey, $options: 'i' } },
          { 'brand': { $regex: searchKey, $options: 'i' } },
          { 'description': { $regex: searchKey, $options: 'i' } },
        ]
      })
      .populate('category', 'type')
      .populate('countOfStock', 'availableQuantity')
      .skip(skip)
      .limit(limit);
  
      if (products.length === 0) {
        return res.status(404).json({ error: 'No products found' });
      }
  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
};  
export default productController;
