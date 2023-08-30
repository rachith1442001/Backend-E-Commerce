import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    default: '',
  },
  apartment: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  zip: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  phone: {
    type: Number,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: '', 
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ]
});

const User = mongoose.model('User', userSchema);

export default User;
