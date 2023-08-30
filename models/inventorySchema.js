import mongoose from 'mongoose';

const productWithInventorySchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true,
    unique: true,
    sparse: true, // Allows multiple documents to have null values
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  availableQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  reservedQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  soldQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const ProductWithInventory = mongoose.model('ProductWithInventory', productWithInventorySchema);

export default ProductWithInventory;
