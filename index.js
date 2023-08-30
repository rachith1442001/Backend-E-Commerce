import express from 'express';
import 'dotenv/config';
import productRoutes from './routes/productRoute.js'; 
import categoryRoutes from './routes/categoryRoutes.js'; 
import userRoutes from './routes/userRoute.js';
import orderRoutes from './routes/orderRoute.js'; 
import authjwt from './helpers/jwt.js';
import { connectDB } from './config/Db.js';
import inventoryRoutes from './routes/inventoryRoute.js';
import session from 'express-session';

const app = express();

const PORT = process.env.PORT || 8000;
const API_URL = process.env.API_URL || '/api/v1'; 

app.use(express.json());

app.use(authjwt());

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
}));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes); 
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/orders', orderRoutes); 

connectDB();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

