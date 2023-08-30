import ProductWithInventory from '../models/inventorySchema.js';

export const inventoryController = {
  async createProduct(req, res) {
    try {
      const newProduct = await ProductWithInventory.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await ProductWithInventory.findById(productId).populate('category');
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3; 
  
      const skip = (page - 1) * limit;
  
      const products = await ProductWithInventory.find()
        .populate('category')
        .skip(skip)
        .limit(limit);
  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error getting all products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updatedProduct = await ProductWithInventory.findByIdAndUpdate(
        productId,
        req.body,
        { new: true, runValidators: true }
      );

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
      const deletedProduct = await ProductWithInventory.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
