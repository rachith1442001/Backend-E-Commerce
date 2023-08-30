import Category from '../models/categorySchema.js';

export const categoryController = {

  async getAllCategories(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;

      const skip = (page - 1) * limit;

      const categories = await Category.find({ isDeleted: false })
        .skip(skip)
        .limit(limit);

      res.status(200).json(categories);
    } catch (error) {
      console.error('Error getting all categories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async getCategoryById(req, res) {
    try {
      const categoryId = req.params.id;
      const category = await Category.findOne({ _id : categoryId, isDeleted : false });
  
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      res.status(200).json(category);
    } catch (error) {
      console.error('Error getting category by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async createCategory(req, res) {
    try {
      const newCategory = await Category.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async updateCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { isDeleted: true },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  };
  