import mongoose from 'mongoose';
import dotenv from 'dotenv';

export const connectDB = async () => {
  try {
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = 'E-Commerce';
    const URI = `mongodb://${dbUser}:${dbPassword}@localhost:27017/${dbName}`;

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(URI, options);

    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1); 
  }
};
